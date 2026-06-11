# GGCC Website - Setup Script
# Run this script in PowerShell after cloning the repository.
# Requires: Node.js 20+ and Git

$ErrorActionPreference = "Stop"

Write-Host ""
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host "   GGCC Website - Setup Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
try {
  $nodeVersion = node --version
  Write-Host "Node.js: $nodeVersion" -ForegroundColor Green
} catch {
  Write-Host "ERROR: Node.js is not installed." -ForegroundColor Red
  Write-Host "Download from: https://nodejs.org/en/download" -ForegroundColor Yellow
  exit 1
}

# Check Git
try {
  $gitVersion = git --version
  Write-Host "Git: $gitVersion" -ForegroundColor Green
} catch {
  Write-Host "ERROR: Git is not installed." -ForegroundColor Red
  Write-Host "Download from: https://git-scm.com/download/win" -ForegroundColor Yellow
  exit 1
}

# Check .env.local
if (-not (Test-Path ".env.local")) {
  Write-Host ""
  Write-Host "Creating .env.local from .env.example..." -ForegroundColor Yellow
  Copy-Item ".env.example" ".env.local"
  Write-Host ".env.local created. Fill in your environment variables before running 'npm run dev'." -ForegroundColor Yellow
}

# Install dependencies
Write-Host ""
Write-Host "Installing dependencies..." -ForegroundColor Cyan
npm install

# Generate Prisma client
Write-Host ""
Write-Host "Generating Prisma client..." -ForegroundColor Cyan
npx prisma generate

Write-Host ""
Write-Host "=====================================" -ForegroundColor Green
Write-Host "   Setup complete!" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor White
Write-Host "  1. Fill in .env.local with your credentials" -ForegroundColor White
Write-Host "  2. Run: npx prisma migrate deploy" -ForegroundColor White
Write-Host "  3. Run: npx prisma db seed" -ForegroundColor White
Write-Host "  4. Run: npm run dev" -ForegroundColor White
Write-Host ""
