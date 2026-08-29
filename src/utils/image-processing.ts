export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })

/**
 * Modern canvas-to-blob helper supporting WebP with JPEG fallback
 */
async function canvasToBlob(canvas: HTMLCanvasElement, quality = 0.85): Promise<Blob> {
  return new Promise((resolve) => {
    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob)
        } else {
          // Fallback to JPEG if WebP not supported
          canvas.toBlob((fallbackBlob) => {
            resolve(fallbackBlob || new Blob([], { type: 'image/jpeg' }))
          }, 'image/jpeg', quality)
        }
      },
      'image/webp',
      quality
    )
  })
}

/**
 * Returns a cropped and compressed WebP blob from a source image
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number },
  maxWidth = 1920,
  maxHeight = 1920
): Promise<Blob | null> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  let targetWidth = pixelCrop.width
  let targetHeight = pixelCrop.height

  if (targetWidth > maxWidth || targetHeight > maxHeight) {
    const ratio = Math.min(maxWidth / targetWidth, maxHeight / targetHeight)
    targetWidth = Math.round(targetWidth * ratio)
    targetHeight = Math.round(targetHeight * ratio)
  }

  canvas.width = targetWidth
  canvas.height = targetHeight

  ctx.imageSmoothingEnabled = true
  ctx.imageSmoothingQuality = 'high'

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    targetWidth,
    targetHeight
  )

  return canvasToBlob(canvas, 0.85)
}

/**
 * Automatically downsizes and compresses any raw file into a lightweight WebP before uploading
 */
export async function compressImageFile(
  file: File,
  maxWidth = 1920,
  maxHeight = 1920,
  quality = 0.85
): Promise<File> {
  // If file is already tiny (under 150KB), return as is
  if (file.size <= 150 * 1024 && file.type.includes('webp')) {
    return file
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = async () => {
      try {
        const imageSrc = reader.result as string
        const image = await createImage(imageSrc)
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        if (!ctx) {
          return resolve(file)
        }

        let width = image.naturalWidth || image.width
        let height = image.naturalHeight || image.height

        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height)
          width = Math.round(width * ratio)
          height = Math.round(height * ratio)
        }

        canvas.width = width
        canvas.height = height

        ctx.imageSmoothingEnabled = true
        ctx.imageSmoothingQuality = 'high'
        ctx.drawImage(image, 0, 0, width, height)

        const blob = await canvasToBlob(canvas, quality)
        const baseName = file.name.replace(/\.[^/.]+$/, '')
        const optimizedFile = new File([blob], `${baseName}.webp`, { type: 'image/webp' })
        resolve(optimizedFile)
      } catch (err) {
        console.warn('Image compression fallback to original file:', err)
        resolve(file)
      }
    }
    reader.onerror = () => resolve(file)
    reader.readAsDataURL(file)
  })
}

