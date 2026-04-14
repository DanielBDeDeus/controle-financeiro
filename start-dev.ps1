# === CONFIG ===
$projectPath = "C:\Users\White\Documents\projetos\controle-financeiro"
$url = "http://localhost:5173"

# === START DEV SERVER (hidden) ===
$process = Start-Process "cmd.exe" `
    -ArgumentList "/c npm run dev" `
    -WorkingDirectory $projectPath `
    -WindowStyle Hidden `
    -PassThru

# === WAIT FOR SERVER ===
do {
    Start-Sleep -Seconds 1
    try {
        $res = Invoke-WebRequest -Uri $url -UseBasicParsing -TimeoutSec 1
        $ready = $true
    } catch {
        $ready = $false
    }
} while (-not $ready)

# === OPEN IN DEFAULT BROWSER ===
Start-Process $url

# === WAIT UNTIL CHROME CLOSES ===
while (Get-Process chrome -ErrorAction SilentlyContinue) {
    Start-Sleep -Seconds 2
}

# === KILL DEV SERVER ===
Stop-Process -Id $process.Id -Force