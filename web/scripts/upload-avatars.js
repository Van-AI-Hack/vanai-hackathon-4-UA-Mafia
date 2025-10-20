/**
 * Script to upload GLB avatars to Cloudinary
 * 
 * Usage:
 * 1. Make sure you have your .env.local file configured with Cloudinary credentials
 * 2. Run: node scripts/upload-avatars.js
 */

const cloudinary = require('cloudinary').v2
const fs = require('fs')
const path = require('path')

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(__dirname, '../.env.local') })

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.VITE_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.VITE_CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Avatar files mapping
const avatarFiles = [
  {
    localPath: 'public/avatars/The AI Skeptic acoustic+guitar+3d+model.glb',
    publicId: 'canadian-music-dna/avatars/ai-skeptic-acoustic-guitar-3d-model',
    personaName: 'The AI Skeptic'
  },
  {
    localPath: 'public/avatars/The Casual Listener casual+listener+3d+model.glb',
    publicId: 'canadian-music-dna/avatars/casual-listener-3d-model',
    personaName: 'The Casual Listener'
  },
  {
    localPath: 'public/avatars/The Digital Explorer tech-savvy+youth+3d+model.glb',
    publicId: 'canadian-music-dna/avatars/digital-explorer-tech-savvy-youth-3d-model',
    personaName: 'The Digital Explorer'
  },
  {
    localPath: 'public/avatars/The Music Obsessive musician+in+studio+3d+model.glb',
    publicId: 'canadian-music-dna/avatars/music-obsessive-musician-studio-3d-model',
    personaName: 'The Music Obsessive'
  },
  {
    localPath: 'public/avatars/The Radio Traditionalist steampunk+music+machine+3d+model.glb',
    publicId: 'canadian-music-dna/avatars/radio-traditionalist-steampunk-music-machine-3d-model',
    personaName: 'The Radio Traditionalist'
  }
]

// Upload a single file
async function uploadFile(fileInfo) {
  const filePath = path.join(__dirname, '..', fileInfo.localPath)
  
  // Check if file exists
  if (!fs.existsSync(filePath)) {
    console.error(`❌ File not found: ${filePath}`)
    return { success: false, error: 'File not found' }
  }

  const fileSizeInMB = (fs.statSync(filePath).size / (1024 * 1024)).toFixed(2)
  
  console.log(`\n📤 Uploading: ${fileInfo.personaName}`)
  console.log(`   File: ${fileInfo.localPath}`)
  console.log(`   Size: ${fileSizeInMB} MB`)
  console.log(`   Public ID: ${fileInfo.publicId}`)

  try {
    const result = await cloudinary.uploader.upload(filePath, {
      resource_type: 'raw',
      public_id: fileInfo.publicId,
      overwrite: true
    })

    console.log(`✅ Success! URL: ${result.secure_url}`)
    return { success: true, url: result.secure_url }
  } catch (error) {
    console.error(`❌ Error uploading ${fileInfo.personaName}:`, error.message)
    return { success: false, error: error.message }
  }
}

// Main upload function
async function uploadAllAvatars() {
  console.log('🚀 Starting Cloudinary GLB Avatar Upload')
  console.log('=' .repeat(60))
  
  // Verify credentials
  if (!process.env.VITE_CLOUDINARY_CLOUD_NAME || !process.env.VITE_CLOUDINARY_API_KEY) {
    console.error('❌ ERROR: Cloudinary credentials not found!')
    console.error('   Please make sure your .env.local file is configured with:')
    console.error('   - VITE_CLOUDINARY_CLOUD_NAME')
    console.error('   - VITE_CLOUDINARY_API_KEY')
    console.error('   - CLOUDINARY_API_SECRET')
    process.exit(1)
  }

  console.log(`\n☁️  Cloud Name: ${process.env.VITE_CLOUDINARY_CLOUD_NAME}`)
  console.log(`📊 Total files to upload: ${avatarFiles.length}`)
  
  const results = []
  
  // Upload each file
  for (const fileInfo of avatarFiles) {
    const result = await uploadFile(fileInfo)
    results.push({ ...fileInfo, ...result })
    
    // Add a small delay between uploads
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 Upload Summary:')
  console.log('='.repeat(60))
  
  const successful = results.filter(r => r.success).length
  const failed = results.filter(r => !r.success).length
  
  console.log(`✅ Successful: ${successful}/${avatarFiles.length}`)
  console.log(`❌ Failed: ${failed}/${avatarFiles.length}`)
  
  if (failed > 0) {
    console.log('\n❌ Failed uploads:')
    results.filter(r => !r.success).forEach(r => {
      console.log(`   - ${r.personaName}: ${r.error}`)
    })
  }
  
  if (successful > 0) {
    console.log('\n✅ Successful uploads:')
    results.filter(r => r.success).forEach(r => {
      console.log(`   - ${r.personaName}`)
      console.log(`     ${r.url}`)
    })
  }
  
  console.log('\n🎉 Upload process complete!')
}

// Run the upload
uploadAllAvatars().catch(error => {
  console.error('💥 Fatal error:', error)
  process.exit(1)
})








