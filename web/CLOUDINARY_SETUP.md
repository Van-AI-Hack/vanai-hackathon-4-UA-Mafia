# Cloudinary Setup Guide for GLB Avatar Storage

## 🚀 Quick Setup

### 1. Create Cloudinary Account
1. Go to [cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Note down your Cloud Name, API Key, and API Secret

### 2. Configure Environment Variables
Create a `.env.local` file in the `web` directory:

```bash
# Cloudinary Configuration
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_API_KEY=your_api_key_here
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_here
```

### 3. Create Upload Preset
1. Go to Cloudinary Dashboard → Settings → Upload
2. Click "Add upload preset"
3. Set these settings:
   - **Preset name**: `canadian-music-dna-avatars`
   - **Signing Mode**: Unsigned (for client-side uploads)
   - **Resource Type**: Raw
   - **Folder**: `canadian-music-dna/avatars`
   - **Public ID**: `{persona_name}`

### 4. Upload Your GLB Files
You can upload GLB files in two ways:

#### Option A: Using the Admin Interface
1. Add the GLBUploader component to your admin panel
2. Select persona and upload GLB file
3. Files will be automatically organized in Cloudinary

#### Option B: Manual Upload via Cloudinary Dashboard
1. Go to Cloudinary Dashboard → Media Library
2. Upload each GLB file with these public IDs:
   - `canadian-music-dna/avatars/digital-explorer-tech-savvy-youth-3d-model`
   - `canadian-music-dna/avatars/radio-traditionalist-steampunk-music-machine-3d-model`
   - `canadian-music-dna/avatars/casual-listener-3d-model`
   - `canadian-music-dna/avatars/ai-skeptic-acoustic-guitar-3d-model`
   - `canadian-music-dna/avatars/music-obsessive-musician-studio-3d-model`

## 🔧 Configuration Details

### File Structure in Cloudinary
```
canadian-music-dna/
└── avatars/
    ├── digital-explorer-tech-savvy-youth-3d-model.glb
    ├── radio-traditionalist-steampunk-music-machine-3d-model.glb
    ├── casual-listener-3d-model.glb
    ├── ai-skeptic-acoustic-guitar-3d-model.glb
    └── music-obsessive-musician-studio-3d-model.glb
```

### URL Format
GLB files will be accessible at:
```
https://res.cloudinary.com/{cloud_name}/raw/upload/{public_id}.glb
```

## 🎯 Benefits of Cloudinary

1. **No File Size Limits**: Unlike Vercel's 50MB limit
2. **Global CDN**: Fast loading worldwide
3. **Automatic Optimization**: Files are optimized for web delivery
4. **Transformations**: Can resize, compress, or convert files
5. **Analytics**: Track usage and performance
6. **Free Tier**: 25GB storage, 25GB bandwidth per month

## 🔒 Security Notes

- API Secret should never be exposed to client-side code
- Use unsigned upload presets for client uploads
- Consider adding authentication for admin uploads
- Set up CORS policies if needed

## 🚀 Deployment

1. Add environment variables to Vercel:
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all three Cloudinary variables

2. Deploy your application:
   ```bash
   npm run build
   npx vercel --prod
   ```

## 🧪 Testing

Test the setup by:
1. Checking if GLB files load in the persona results
2. Using the GLBUploader component to upload new files
3. Verifying files are accessible via direct URLs

## 📊 Monitoring

Monitor your Cloudinary usage:
- Dashboard → Analytics
- Track bandwidth and storage usage
- Monitor file access patterns








