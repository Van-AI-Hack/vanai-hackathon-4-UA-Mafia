# 3D Avatar Models

This directory contains GLB (GL Transmission Format) 3D models for persona avatars.

## Supported Formats

- **GLB** (Recommended) - Single file format with embedded textures and animations
- **GLTF** - JSON-based format (will be converted to GLB for web use)

## File Naming Convention

Name your GLB files according to the persona IDs:

- `digital-explorer.glb`
- `radio-55-plus.glb`
- `social-streamer.glb`
- `ai-enthusiast.glb`
- `concert-goer.glb`
- `music-curator.glb`
- `casual-listener.glb`
- `vinyl-collector.glb`

## Model Requirements

### Technical Specifications
- **Format**: GLB (preferred) or GLTF
- **File Size**: Keep under 2MB for optimal web performance
- **Polygon Count**: 5,000-15,000 triangles recommended
- **Textures**: Use PBR materials (Base Color, Normal, Roughness, Metallic)
- **Animations**: Optional, but supported

### Design Guidelines
- **Scale**: Models should be roughly 1 unit in height
- **Origin**: Center the model at (0,0,0)
- **Orientation**: Face forward (positive Z direction)
- **Materials**: Use materials that work well with dynamic lighting
- **Colors**: Models will be tinted with persona colors, so use neutral base colors

## Creating GLB Models

### Using Blender
1. Create your 3D model
2. Apply materials and textures
3. Export as GLB: File → Export → glTF 2.0 (.glb/.gltf)
4. Check "Include Selected Objects" and "Export Materials"

### Using Online Converters
- [glTF Viewer](https://gltf-viewer.donmccurdy.com/)
- [Three.js Editor](https://threejs.org/editor/)
- [Babylon.js Sandbox](https://sandbox.babylonjs.com/)

## Testing Your Models

1. Place your GLB file in this directory
2. Update the `getAvatarModelPath` function in `PersonaAvatar.tsx` if needed
3. Run the development server: `npm run dev`
4. Complete the persona quiz to see your avatar in action

## Fallback Behavior

If a GLB model is not found, the system will automatically display a geometric fallback avatar based on the persona type.

## Performance Tips

- Compress textures to reduce file size
- Use LOD (Level of Detail) for complex models
- Optimize geometry by removing unnecessary polygons
- Test loading times on slower connections
