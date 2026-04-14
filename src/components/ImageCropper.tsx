'use client'

import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import { getCroppedImg } from '@/utils/image-processing'
import styles from '@/app/admin/page.module.css'

interface ImageCropperProps {
  image: string
  aspectRatio?: number
  onCropComplete: (croppedImage: Blob) => void
  onSkip: () => void
  onCancel: () => void
}

export default function ImageCropper({ image, aspectRatio, onCropComplete, onSkip, onCancel }: ImageCropperProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
  const [currentAspect, setCurrentAspect] = useState<number | undefined>(aspectRatio)

  const onCropChange = (crop: any) => {
    setCrop(crop)
  }

  const onZoomChange = (zoom: number) => {
    setZoom(zoom)
  }

  const onCropCompleteInternal = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }, [])

  const handleSave = async () => {
    if (croppedAreaPixels) {
      const croppedBlob = await getCroppedImg(image, croppedAreaPixels)
      if (croppedBlob) {
        onCropComplete(croppedBlob)
      }
    }
  }

  return (
    <div className={styles.cropperOverlay}>
      <div className={`${styles.cropperContainer} glass`}>
        <div className={styles.cropperViewport}>
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={currentAspect}
            onCropChange={onCropChange}
            onCropComplete={onCropCompleteInternal}
            onZoomChange={onZoomChange}
          />
        </div>
        
        <div className={styles.cropperControls}>
          <div className={styles.aspectSelector}>
            <button 
              type="button"
              className={currentAspect === 3/2 ? styles.aspectBtnActive : styles.aspectBtn}
              onClick={() => setCurrentAspect(3/2)}
            >
              Landscape
            </button>
            <button 
              type="button"
              className={currentAspect === 2/3 ? styles.aspectBtnActive : styles.aspectBtn}
              onClick={() => setCurrentAspect(2/3)}
            >
              Portrait
            </button>
            <button 
              type="button"
              className={currentAspect === 1 ? styles.aspectBtnActive : styles.aspectBtn}
              onClick={() => setCurrentAspect(1)}
            >
              Square
            </button>
            <button 
              type="button"
              className={currentAspect === undefined ? styles.aspectBtnActive : styles.aspectBtn}
              onClick={() => setCurrentAspect(undefined)}
            >
              Free
            </button>
          </div>

          <div className={styles.zoomControl}>
            <label>Zoom</label>
            <input
              type="range"
              value={zoom}
              min={1}
              max={3}
              step={0.1}
              aria-labelledby="Zoom"
              onChange={(e: any) => onZoomChange(Number(e.target.value))}
              className={styles.rangeInput}
            />
          </div>
          
          <div className={styles.cropperActions}>
            <button onClick={onCancel} className={styles.cancelBtn}>Cancel</button>
            <button onClick={onSkip} className={styles.skipBtn}>Skip & Use Original</button>
            <button onClick={handleSave} className={styles.btn}>Crop & Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}
