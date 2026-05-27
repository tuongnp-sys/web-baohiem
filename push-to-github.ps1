# Chay sau khi da: gh auth login
$ErrorActionPreference = "Stop"
$env:Path = "C:\Program Files\Git\bin;C:\Program Files\GitHub CLI;" + $env:Path
Set-Location $PSScriptRoot

gh auth status
if ($LASTEXITCODE -ne 0) {
  Write-Host "Chua dang nhap GitHub. Chay: gh auth login -h github.com -p https -w"
  exit 1
}

$login = gh api user -q .login
git config user.name $login
git config user.email "$login@users.noreply.github.com"

$exists = gh repo view "$login/web-bao-hiem" 2>$null
if ($LASTEXITCODE -eq 0) {
  Write-Host "Repo da ton tai. Gan remote va push..."
  git remote remove origin 2>$null
  git remote add origin "https://github.com/$login/web-bao-hiem.git"
  git push -u origin main
} else {
  gh repo create web-bao-hiem --public --source=. --remote=origin --push
}

Write-Host "Xong: https://github.com/$login/web-bao-hiem"
