# Script to create .env file for Canadian Music DNA project
# Run this script from the project root directory

Write-Host "🎵 Canadian Music DNA - Environment Setup" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Get Cloudinary credentials from user
Write-Host "Please enter your Cloudinary credentials:" -ForegroundColor Yellow
Write-Host "(You can find these at: https://cloudinary.com/console)" -ForegroundColor Gray
Write-Host ""

$cloudName = Read-Host "Enter your Cloudinary Cloud Name"
$apiKey = Read-Host "Enter your Cloudinary API Key"
$uploadPreset = Read-Host "Enter your Upload Preset name (press Enter for default: canadian-music-dna-avatars)"

# Set default upload preset if none provided
if ([string]::IsNullOrWhiteSpace($uploadPreset)) {
    $uploadPreset = "canadian-music-dna-avatars"
}

# Create .env file content
$envContent = @"
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=$cloudName
VITE_CLOUDINARY_API_KEY=$apiKey
VITE_CLOUDINARY_UPLOAD_PRESET=$uploadPreset

# Note: API Secret should be kept server-side only
# CLOUDINARY_API_SECRET=your_api_secret
"@

# Write to .env file in web directory
$envPath = Join-Path $PSScriptRoot "web\.env"
$envContent | Out-File -FilePath $envPath -Encoding UTF8 -NoNewline

Write-Host ""
Write-Host "✅ Success! .env file created at: web\.env" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Your configuration:" -ForegroundColor Cyan
Write-Host "  Cloud Name: $cloudName" -ForegroundColor White
Write-Host "  API Key: $apiKey" -ForegroundColor White
Write-Host "  Upload Preset: $uploadPreset" -ForegroundColor White
Write-Host ""
Write-Host "🚀 Next steps:" -ForegroundColor Yellow
Write-Host "  1. Make sure your upload preset '$uploadPreset' is created in Cloudinary" -ForegroundColor White
Write-Host "  2. Upload your GLB files to Cloudinary (see UPLOAD_INSTRUCTIONS.md)" -ForegroundColor White
Write-Host "  3. Run: cd web" -ForegroundColor White
Write-Host "  4. Run: npm install" -ForegroundColor White
Write-Host "  5. Run: npm run dev" -ForegroundColor White
Write-Host ""

