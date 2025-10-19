# 🎨 Visual Guide: Uploading GLB Files to Cloudinary

## 📸 **Step-by-Step with Visual Instructions**

### **Step 1: Login to Cloudinary**
```
🌐 Go to: https://cloudinary.com/console
👤 Login with your account
```

---

### **Step 2: Open Media Library**
```
📁 Click "Media Library" in left sidebar
   OR
🔗 Direct link: https://cloudinary.com/console/media_library
```

**What you'll see:**
```
┌─────────────────────────────────────────┐
│ Media Library                           │
├─────────────────────────────────────────┤
│ [+ Upload]  [New Folder]  [Search...]  │
├─────────────────────────────────────────┤
│                                         │
│  📁 My Folders                          │
│  (empty or existing folders)            │
│                                         │
└─────────────────────────────────────────┘
```

---

### **Step 3: Create Folder**
```
1. Click [New Folder] button
2. Type: canadian-music-dna
3. Press Enter or click Create
```

**Result:**
```
📁 canadian-music-dna (newly created)
```

---

### **Step 4: Create Avatars Subfolder**
```
1. Double-click on "canadian-music-dna" folder
2. Click [New Folder] again
3. Type: avatars
4. Press Enter or click Create
```

**Result:**
```
📁 canadian-music-dna
  └── 📁 avatars (you are here)
```

---

### **Step 5: Upload First File**

**Example: Uploading The Digital Explorer**

```
1. Click [+ Upload] button
2. Click "Browse" or drag & drop file
3. Select: "The Digital Explorer tech-savvy+youth+3d+model.glb"
```

**Upload Dialog appears:**
```
┌─────────────────────────────────────────────┐
│ Upload Asset                                │
├─────────────────────────────────────────────┤
│ File: The Digital Explorer tech-s...glb    │
│ Size: 23.3 MB                              │
│                                            │
│ Public ID: [____________________________]  │
│            👆 CHANGE THIS!                 │
│                                            │
│ Resource Type: [Raw ▼]                    │
│                                            │
│ Folder: canadian-music-dna/avatars        │
│                                            │
│ [Cancel]                    [Upload]       │
└─────────────────────────────────────────────┘
```

**⚠️ IMPORTANT: Change Public ID to:**
```
digital-explorer-tech-savvy-youth-3d-model
```

**Then click [Upload]**

---

### **Step 6: Repeat for All Files**

**Upload these 5 files with exact Public IDs:**

| # | File from your computer | Public ID to use |
|---|------------------------|------------------|
| 1️⃣ | `The Digital Explorer tech-savvy+youth+3d+model.glb` | `digital-explorer-tech-savvy-youth-3d-model` |
| 2️⃣ | `The Radio Traditionalist steampunk+music+machine+3d+model.glb` | `radio-traditionalist-steampunk-music-machine-3d-model` |
| 3️⃣ | `The Casual Listener casual+listener+3d+model.glb` | `casual-listener-3d-model` |
| 4️⃣ | `The AI Skeptic acoustic+guitar+3d+model.glb` | `ai-skeptic-acoustic-guitar-3d-model` |
| 5️⃣ | `The Music Obsessive musician+in+studio+3d+model.glb` | `music-obsessive-musician-studio-3d-model` |

---

### **Step 7: Verify All Uploads**

**After uploading, you should see:**
```
📁 canadian-music-dna/avatars/
├── 📄 ai-skeptic-acoustic-guitar-3d-model.glb (22.9 MB)
├── 📄 casual-listener-3d-model.glb (22.8 MB)
├── 📄 digital-explorer-tech-savvy-youth-3d-model.glb (23.3 MB)
├── 📄 music-obsessive-musician-studio-3d-model.glb (11.8 MB)
└── 📄 radio-traditionalist-steampunk-music-machine-3d-model.glb (23.4 MB)

Total: 5 files, ~104 MB
```

---

### **Step 8: Test Access**

**Click on any file to see its details:**
```
┌─────────────────────────────────────────┐
│ Asset Details                           │
├─────────────────────────────────────────┤
│ Public ID:                              │
│ canadian-music-dna/avatars/             │
│ digital-explorer-tech-savvy-youth-      │
│ 3d-model                                │
│                                         │
│ URL:                                    │
│ https://res.cloudinary.com/YOUR_CLOUD/  │
│ raw/upload/canadian-music-dna/avatars/  │
│ digital-explorer-tech-savvy-youth-      │
│ 3d-model.glb                            │
│                                         │
│ Resource Type: Raw                      │
│ Format: glb                             │
│ Size: 23.3 MB                           │
└─────────────────────────────────────────┘
```

**Copy the URL and test it in your browser** ✅

---

## 🎯 **Quick Checklist**

Before you finish, verify:

- [ ] Created `canadian-music-dna` folder
- [ ] Created `avatars` subfolder inside it
- [ ] Uploaded all 5 GLB files
- [ ] Each file has correct Public ID (no spaces, use hyphens)
- [ ] Resource Type is "Raw" for all files
- [ ] Can access each file via direct URL
- [ ] Total storage used: ~104 MB

---

## 🚀 **What's Next?**

1. ✅ Files uploaded to Cloudinary
2. ⚙️ Configure `.env.local` with your Cloudinary credentials
3. 🔄 Restart development server
4. 🧪 Test the persona quiz
5. 🎉 See your 3D avatars load from the cloud!

---

## 💡 **Pro Tips**

- **Batch Upload**: You can select all 5 files at once, but you'll need to edit each Public ID individually
- **Organize**: Keep all avatar files in the `avatars` folder for easy management
- **Monitor**: Check your Cloudinary usage in Dashboard → Analytics
- **Free Tier**: 25GB storage, 25GB bandwidth/month - plenty for this project!

---

## ❓ **Need Help?**

If you encounter issues:
1. Check Public IDs match exactly (case-sensitive)
2. Verify Resource Type is "Raw" not "Image"
3. Make sure files are in `canadian-music-dna/avatars/` folder
4. Test direct URLs in browser
5. Check Cloudinary console for error messages






