$sourceDir = "Persona_playlists/Dashboard_playlist"
$destDir = "web/public/audio/dashboard-playlist"

# Ensure destination exists
New-Item -ItemType Directory -Force -Path $destDir | Out-Null

# Copy and rename files
Get-ChildItem $sourceDir -Filter *.mp3 | ForEach-Object {
    $newName = $_.Name -replace '→', '-'
    $destPath = Join-Path $destDir $newName
    
    Copy-Item $_.FullName $destPath -Force
    Write-Host "✅ Copied: $($_.Name)" -ForegroundColor Green
    Write-Host "   To: $newName" -ForegroundColor Cyan
}

$fileCount = (Get-ChildItem $destDir).Count
Write-Host "`n✅ All $fileCount files copied successfully!" -ForegroundColor Green

