# Builds a signed release APK: prebuild --clean, gradlew assembleRelease, copy to dist/ with a sha256 file.
# Needs the keystore password in the local secret store (secret name below); it only ever lives in this
# process's environment variables and is never printed or written to disk.
param(
  [string]$AndroidHome = "$env:LOCALAPPDATA\Android\Sdk",
  [string]$JavaHome = 'C:\Program Files\Eclipse Adoptium\jdk-25.0.3.9-hotspot',
  [string]$KeystorePath = 'C:\Users\maizn\.keystores\nftmarketplace-release.jks',
  [string]$KeyAlias = 'nftmarketplace',
  [string]$SecretName = 'nftmarketplace-keystore-password',
  [switch]$SkipPrebuild,
  # Only for local emulator testing: allows EXPO_PUBLIC_APPCHECK_DEBUG_TOKEN to be baked into the build.
  [switch]$AllowAppCheckDebugToken
)
$ErrorActionPreference = 'Stop'
if ($env:EXPO_PUBLIC_APPCHECK_DEBUG_TOKEN -and -not $AllowAppCheckDebugToken) {
  throw 'EXPO_PUBLIC_APPCHECK_DEBUG_TOKEN is set: a release build must not embed an App Check debug token. Unset it, or pass -AllowAppCheckDebugToken for a local test build.'
}
$repo = Split-Path -Parent $PSScriptRoot
Set-Location $repo


if (-not (Test-Path $KeystorePath)) { throw "Keystore not found: $KeystorePath" }
$env:ANDROID_HOME = $AndroidHome
$env:ANDROID_SDK_ROOT = $AndroidHome
$env:JAVA_HOME = $JavaHome
$env:Path = "$JavaHome\bin;$env:Path"
$env:CI = '1'

$pw = & "$env:LOCALAPPDATA\Secrets\secret.ps1" get $SecretName
if (-not $pw) { throw "Could not read secret $SecretName" }
$env:ORG_GRADLE_PROJECT_NFT_STORE_FILE = $KeystorePath
$env:ORG_GRADLE_PROJECT_NFT_STORE_PASSWORD = $pw
$env:ORG_GRADLE_PROJECT_NFT_KEY_ALIAS = $KeyAlias
$env:ORG_GRADLE_PROJECT_NFT_KEY_PASSWORD = $pw
$pw = $null

try {
  $version = (Get-Content package.json -Raw | ConvertFrom-Json).version

  if (-not $SkipPrebuild) {
    npx expo prebuild --platform android --clean
    if ($LASTEXITCODE) { throw 'expo prebuild failed' }
  }

  Push-Location android
  try {
    .\gradlew.bat assembleRelease --no-daemon
    if ($LASTEXITCODE) { throw 'gradle assembleRelease failed' }
  } finally { Pop-Location }

  $apk = Get-ChildItem android\app\build\outputs\apk\release\*.apk | Select-Object -First 1
  if (-not $apk) { throw 'No release APK found' }
  New-Item -ItemType Directory -Force dist | Out-Null
  $dest = "dist\NFTMarketplace-v$version.apk"
  Copy-Item $apk.FullName $dest -Force
  # .NET directly: Get-FileHash is missing when Windows PowerShell 5.1 is started from pwsh 7.
  $stream = [IO.File]::OpenRead((Resolve-Path $dest).Path)
  try { $hash = -join ([Security.Cryptography.SHA256]::Create().ComputeHash($stream) | ForEach-Object { $_.ToString('x2') }) }
  finally { $stream.Dispose() }
  "$hash  NFTMarketplace-v$version.apk" | Set-Content "$dest.sha256" -Encoding ascii
  Write-Host "APK: $((Resolve-Path $dest).Path)"
  Write-Host "SHA256: $hash"
} finally {
  Remove-Item Env:ORG_GRADLE_PROJECT_NFT_STORE_PASSWORD, Env:ORG_GRADLE_PROJECT_NFT_KEY_PASSWORD -ErrorAction SilentlyContinue
}



