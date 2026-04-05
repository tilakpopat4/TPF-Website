'use client'

import React, { useState } from 'react'
import { useUploadThing } from '@/utils/uploadthing'
import ImageCropper from './ImageCropper'
import styles from '@/app/admin/page.module.css'

interface CropUploadFieldProps {
  onUploadComplete: (url: string) => void
  label: string
  aspectRatio?: number
}

export default function CropUploadField({ onUploadComplete, label, aspectRatio }: CropUploadFieldProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [isCropping, setIsCropping] = useState(false)
  const [isUploading, setIsUploading] = useState(false)

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      if (res && res.length > 0) {
        onUploadComplete(res[0].url)
        alert("Image adjusted and uploaded successfully!")
      }
      setIsUploading(false)
    },
    onUploadError: (error) => {
      alert(`Upload failed: ${error.message}`)
      setIsUploading(false)
    }
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      setOriginalFile(file)
      const reader = new FileReader()
      reader.addEventListener('load', () => {
        setSelectedImage(reader.result as string)
        setIsCropping(true)
      })
      reader.readAsDataURL(file)
    }
  }

  const handleSkip = async () => {
    if (originalFile) {
      setIsCropping(false)
      setIsUploading(true)
      await startUpload([originalFile])
      setSelectedImage(null)
      setOriginalFile(null)
    }
  }

  const handleCropComplete = async (croppedBlob: Blob) => {
    setIsCropping(false)
    setIsUploading(true)
    
    // Create a File object from the blob
    const file = new File([croppedBlob], 'cropped-image.jpg', { type: 'image/jpeg' })
    
    // Start the upload
    await startUpload([file])
    setSelectedImage(null)
  }

  return (
    <div className={styles.uploadField}>
      <p className={styles.label}>{label}</p>
      
      <div className={styles.fileInputWrapper}>
        <input 
          type="file" 
          accept="image/*" 
          onChange={handleFileChange} 
          className={styles.fileInput} 
          disabled={isUploading}
        />
        <div className={`${styles.fileInputOverlay} glass`}>
          {isUploading ? "Uploading processed image..." : "Select & Adjust Photo"}
        </div>
      </div>

      {isCropping && selectedImage && (
        <ImageCropper
          image={selectedImage}
          aspectRatio={aspectRatio}
          onCropComplete={handleCropComplete}
          onSkip={handleSkip}
          onCancel={() => {
            setIsCropping(false)
            setSelectedImage(null)
            setOriginalFile(null)
          }}
        />
      )}
    </div>
  )
}
