import React from 'react'
import GLBUploader from '../components/GLBUploader'

const AdminUpload: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-cyan-400 mb-8">GLB Avatar Upload</h1>
        
        <div className="bg-gray-800 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold text-white mb-4">Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-300">
            <li>Select the persona from the dropdown</li>
            <li>Choose the corresponding GLB file</li>
            <li>Click "Upload GLB File"</li>
            <li>Wait for confirmation</li>
            <li>Repeat for all personas</li>
          </ol>
        </div>
        
        <GLBUploader onUploadComplete={(url) => {
          console.log('Upload complete:', url)
          alert('Upload successful! URL: ' + url)
        }} />
        
        <div className="mt-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-bold text-white mb-4">File Names Reference</h2>
          <ul className="space-y-2 text-gray-300">
            <li><strong>The Digital Explorer:</strong> tech-savvy+youth+3d+model.glb</li>
            <li><strong>The Radio Traditionalist:</strong> steampunk+music+machine+3d+model.glb</li>
            <li><strong>The Casual Listener:</strong> casual+listener+3d+model.glb</li>
            <li><strong>The AI Skeptic:</strong> acoustic+guitar+3d+model.glb</li>
            <li><strong>The Music Obsessive:</strong> musician+in+studio+3d+model.glb</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default AdminUpload






