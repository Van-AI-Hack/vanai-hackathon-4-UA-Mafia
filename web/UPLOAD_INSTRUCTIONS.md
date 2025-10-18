# 📤 How to Upload GLB Files to Cloudinary

## 🚀 **Quick Method: Cloudinary Dashboard Upload**

### **Step 1: Navigate to Media Library**
1. Go to: https://cloudinary.com/console/media_library
2. Log in with your Cloudinary account

### **Step 2: Create Folder Structure**
1. Click "New Folder" button (top right)
2. Create folder: `canadian-music-dna`
3. Open that folder
4. Create subfolder: `avatars`
5. Open the `avatars` folder

### **Step 3: Upload Your GLB Files**

Your GLB files are located at:
```
web/public/avatars/
```

#### **Upload Each File with These Names:**

| File to Upload | Rename To |
|---------------|-----------|
| `The AI Skeptic acoustic+guitar+3d+model.glb` | `ai-skeptic-acoustic-guitar-3d-model` |
| `The Casual Listener casual+listener+3d+model.glb` | `casual-listener-3d-model` |
| `The Digital Explorer tech-savvy+youth+3d+model.glb` | `digital-explorer-tech-savvy-youth-3d-model` |
| `The Music Obsessive musician+in+studio+3d+model.glb` | `music-obsessive-musician-studio-3d-model` |
| `The Radio Traditionalist steampunk+music+machine+3d+model.glb` | `radio-traditionalist-steampunk-music-machine-3d-model` |

#### **How to Upload Each File:**
1. Click "Upload" button
2. Select the GLB file from your computer
3. Before confirming, edit the "Public ID" field
4. Change it to match the "Rename To" column above
5. Make sure "Resource Type" is set to "Raw"
6. Click "Upload"
7. Wait for upload to complete
8. Repeat for all 5 files

### **Step 4: Verify Uploads**
Your files should appear in:
```
canadian-music-dna/avatars/
├── ai-skeptic-acoustic-guitar-3d-model.glb
├── casual-listener-3d-model.glb
├── digital-explorer-tech-savvy-youth-3d-model.glb
├── music-obsessive-musician-studio-3d-model.glb
└── radio-traditionalist-steampunk-music-machine-3d-model.glb
```

Each file should be accessible at:
```
https://res.cloudinary.com/YOUR_CLOUD_NAME/raw/upload/canadian-music-dna/avatars/FILE_NAME.glb
```

---

## 🔧 **Alternative: Using Cloudinary CLI (Advanced)**

If you prefer command line:

### **Install Cloudinary CLI:**
```bash
npm install -g cloudinary-cli
```

### **Configure:**
```bash
cld config
# Enter your cloud name, API key, and API secret
```

### **Upload Files:**
```bash
cd web/public/avatars

cld uploader upload "The AI Skeptic acoustic+guitar+3d+model.glb" \
  --public-id "canadian-music-dna/avatars/ai-skeptic-acoustic-guitar-3d-model" \
  --resource-type raw

cld uploader upload "The Casual Listener casual+listener+3d+model.glb" \
  --public-id "canadian-music-dna/avatars/casual-listener-3d-model" \
  --resource-type raw

cld uploader upload "The Digital Explorer tech-savvy+youth+3d+model.glb" \
  --public-id "canadian-music-dna/avatars/digital-explorer-tech-savvy-youth-3d-model" \
  --resource-type raw

cld uploader upload "The Music Obsessive musician+in+studio+3d+model.glb" \
  --public-id "canadian-music-dna/avatars/music-obsessive-musician-studio-3d-model" \
  --resource-type raw

cld uploader upload "The Radio Traditionalist steampunk+music+machine+3d+model.glb" \
  --public-id "canadian-music-dna/avatars/radio-traditionalist-steampunk-music-machine-3d-model" \
  --resource-type raw
```

---

## ✅ **Verification**

After uploading, test that files are accessible:

1. Visit your Cloudinary URL:
   ```
   https://res.cloudinary.com/YOUR_CLOUD_NAME/raw/upload/canadian-music-dna/avatars/digital-explorer-tech-savvy-youth-3d-model.glb
   ```

2. The file should download or open

3. Repeat for all 5 files

---

## 🚨 **Common Issues**

### **Issue: File size too large**
- **Solution**: Cloudinary free tier supports up to 100MB files
- Your files are ~20-23MB each, so they should work fine

### **Issue: Wrong public ID**
- **Solution**: Make sure to use exact names from the table above
- **Solution**: No spaces, use hyphens instead
- **Solution**: Don't include file extension in Public ID

### **Issue: Wrong resource type**
- **Solution**: Make sure "Resource Type" is set to "Raw" not "Image"

---

## 📊 **Expected Result**

Once all files are uploaded:
- ✅ 5 files in `canadian-music-dna/avatars/` folder
- ✅ Each file ~20-23MB
- ✅ All files accessible via direct URL
- ✅ Your app will load avatars from Cloudinary

---

## 🎯 **Next Step**

After uploading all files:
1. Make sure your `.env.local` file is configured
2. Restart your development server: `npm run dev`
3. Complete the persona quiz
4. Verify 3D avatars load from Cloudinary
5. Deploy to Vercel with environment variables


