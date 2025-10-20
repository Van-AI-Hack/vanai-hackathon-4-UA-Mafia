import React, { useState } from 'react'
import { uploadAvatarGLB, AVATAR_MODELS } from '../services/avatarService'

interface GLBUploaderProps {
  onUploadComplete?: (url: string) => void
}

const GLBUploader: React.FC<GLBUploaderProps> = ({ onUploadComplete }) => {
  const [uploading, setUploading] = useState(false)
  const [selectedPersona, setSelectedPersona] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadStatus, setUploadStatus] = useState<string>('')

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.name.endsWith('.glb')) {
      setSelectedFile(file)
    } else {
      alert('Please select a .glb file')
    }
  }

  const handleUpload = async () => {
    if (!selectedFile || !selectedPersona) {
      alert('Please select both a persona and a GLB file')
      return
    }

    setUploading(true)
    setUploadStatus('Uploading...')

    try {
      const url = await uploadAvatarGLB(selectedFile, selectedPersona)
      setUploadStatus(`Upload successful! URL: ${url}`)
      onUploadComplete?.(url)
    } catch (error) {
      console.error('Upload failed:', error)
      setUploadStatus(`Upload failed: ${error}`)
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="p-6 bg-gray-800 rounded-lg">
      <h3 className="text-xl font-bold text-cyan-400 mb-4">GLB Avatar Uploader</h3>
      
      <div className="space-y-4">
        {/* Persona Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select Persona
          </label>
          <select
            value={selectedPersona}
            onChange={(e) => setSelectedPersona(e.target.value)}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          >
            <option value="">Choose a persona...</option>
            {Object.keys(AVATAR_MODELS).map((persona) => (
              <option key={persona} value={persona}>
                {persona}
              </option>
            ))}
          </select>
        </div>

        {/* File Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Select GLB File
          </label>
          <input
            type="file"
            accept=".glb"
            onChange={handleFileSelect}
            className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
          />
        </div>

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={uploading || !selectedFile || !selectedPersona}
          className="w-full px-4 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded transition-colors"
        >
          {uploading ? 'Uploading...' : 'Upload GLB File'}
        </button>

        {/* Status */}
        {uploadStatus && (
          <div className={`p-3 rounded ${
            uploadStatus.includes('successful') 
              ? 'bg-green-800 text-green-200' 
              : 'bg-red-800 text-red-200'
          }`}>
            {uploadStatus}
          </div>
        )}
      </div>
    </div>
  )
}

export default GLBUploader









