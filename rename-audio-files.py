import os
import shutil

source_dir = "Persona_playlists/Dashboard_playlist"
dest_dir = "web/public/audio/dashboard-playlist"

# Ensure destination exists
os.makedirs(dest_dir, exist_ok=True)

# Copy and rename files
for filename in os.listdir(source_dir):
    if filename.endswith('.mp3'):
        # Replace arrow with hyphen
        new_name = filename.replace('→', '-')
        
        source_path = os.path.join(source_dir, filename)
        dest_path = os.path.join(dest_dir, new_name)
        
        shutil.copy2(source_path, dest_path)
        print(f"✅ Copied: {filename}")
        print(f"   To: {new_name}")

print(f"\n✅ All {len(os.listdir(dest_dir))} files copied successfully!")

