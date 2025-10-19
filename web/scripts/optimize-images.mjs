#!/usr/bin/env node

/**
 * Image Optimization Script
 * Converts PNG persona images to WebP format for better performance
 * Run: node scripts/optimize-images.mjs
 */

import sharp from 'sharp'
import { readdirSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const INPUT_DIR = join(__dirname, '../public/images/personas')
const OUTPUT_DIR = join(__dirname, '../public/images/personas/webp')

// Create output directory if it doesn't exist
if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true })
}

async function optimizeImages() {
  console.log('🎨 Starting image optimization...\n')

  try {
    const files = readdirSync(INPUT_DIR).filter(file => file.endsWith('.png'))
    
    if (files.length === 0) {
      console.log('❌ No PNG files found in', INPUT_DIR)
      return
    }

    console.log(`📁 Found ${files.length} PNG files to convert\n`)

    let totalOriginalSize = 0
    let totalOptimizedSize = 0

    for (const file of files) {
      const inputPath = join(INPUT_DIR, file)
      const outputFileName = file.replace('.png', '.webp')
      const outputPath = join(OUTPUT_DIR, outputFileName)

      console.log(`⚙️  Processing: ${file}`)

      // Get original file size
      const { size: originalSize } = await sharp(inputPath).metadata()
      totalOriginalSize += originalSize

      // Convert to WebP with high quality
      await sharp(inputPath)
        .webp({ 
          quality: 85, // High quality for detailed anime art
          effort: 6    // More effort for better compression
        })
        .toFile(outputPath)

      // Get optimized file size
      const { size: optimizedSize } = await sharp(outputPath).metadata()
      totalOptimizedSize += optimizedSize

      const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(1)
      const originalMB = (originalSize / 1024 / 1024).toFixed(2)
      const optimizedMB = (optimizedSize / 1024 / 1024).toFixed(2)

      console.log(`   Original:  ${originalMB} MB`)
      console.log(`   Optimized: ${optimizedMB} MB`)
      console.log(`   ✅ Saved ${savings}% (${(originalSize - optimizedSize) / 1024 / 1024 | 0} MB)\n`)
    }

    // Summary
    const totalOriginalMB = (totalOriginalSize / 1024 / 1024).toFixed(2)
    const totalOptimizedMB = (totalOptimizedSize / 1024 / 1024).toFixed(2)
    const totalSavings = ((1 - totalOptimizedSize / totalOriginalSize) * 100).toFixed(1)

    console.log('━'.repeat(50))
    console.log('📊 SUMMARY')
    console.log('━'.repeat(50))
    console.log(`Total Original Size:  ${totalOriginalMB} MB`)
    console.log(`Total Optimized Size: ${totalOptimizedMB} MB`)
    console.log(`Total Savings:        ${totalSavings}% (${((totalOriginalSize - totalOptimizedSize) / 1024 / 1024).toFixed(2)} MB)`)
    console.log('━'.repeat(50))
    console.log(`\n✨ Success! WebP images saved to: ${OUTPUT_DIR}`)
    console.log('\n💡 Next step: Update ImageAvatar.tsx to use WebP images')
    
  } catch (error) {
    console.error('❌ Error during optimization:', error)
    process.exit(1)
  }
}

optimizeImages()

