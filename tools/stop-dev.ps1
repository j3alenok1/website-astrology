$ErrorActionPreference = "Stop"

try {
  Set-Location (Resolve-Path (Join-Path $PSScriptRoot ".."))

  if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Host "Docker не найден — нечего останавливать."
    exit 0
  }

  docker compose version *> $null
  if ($LASTEXITCODE -eq 0) {
    docker compose down
    exit 0
  }

  if (Get-Command docker-compose -ErrorAction SilentlyContinue) {
    docker-compose down
    exit 0
  }

  Write-Host "Не найдено ни 'docker compose', ни 'docker-compose'."
  exit 0
}
catch {
  Write-Host "ОШИБКА: $($_.Exception.Message)"
  exit 1
}

