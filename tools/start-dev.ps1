$ErrorActionPreference = "Stop"

function Write-Step([string]$text) {
  Write-Host ""
  Write-Host "==> $text"
}

function Ensure-EnvFile {
  if (Test-Path ".env") { return }

  Write-Step "Создаю .env для локальной разработки"
  @"
# Auto-generated for local development
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/astro_consult?schema=public"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=dev-secret-change-me

# Admin Credentials
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123

# Dev: disable reCAPTCHA locally
DISABLE_RECAPTCHA=true
NEXT_PUBLIC_DISABLE_RECAPTCHA=true

# App
NEXT_PUBLIC_SITE_URL=http://localhost:3000
"@ | Out-File -FilePath ".env" -Encoding utf8 -Force

  Write-Host "Создан .env (dev). Для продакшна заполните .env вручную."
}

function Start-Postgres {
  Write-Step "Запускаю PostgreSQL (Docker)"

  if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    throw "Docker не найден. Установите Docker Desktop или используйте внешний PostgreSQL."
  }

  # Prefer `docker compose`, fallback to `docker-compose`
  docker compose version *> $null
  if ($LASTEXITCODE -eq 0) {
    docker compose up -d
    return
  }

  if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
    docker-compose up -d
    return
  }

  throw "Не найдено ни 'docker compose', ни 'docker-compose'."
}

function Install-Deps {
  if (Test-Path "node_modules") { return }
  Write-Step "Устанавливаю зависимости (npm install)"
  npm install
}

function Init-Db {
  Write-Step "Инициализирую Prisma и БД"
  npm run db:generate
  npm run db:push
  npm run db:seed
}

try {
  Set-Location (Resolve-Path (Join-Path $PSScriptRoot ".."))

  Write-Step "Проверяю .env"
  Ensure-EnvFile

  Start-Postgres
  Install-Deps
  Init-Db

  Write-Step "Запускаю сайт (npm run dev)"
  npm run dev
}
catch {
  Write-Host ""
  Write-Host "ОШИБКА: $($_.Exception.Message)"
  Write-Host "Если Docker не установлен — запустите PostgreSQL вручную и исправьте DATABASE_URL в .env."
  exit 1
}

