export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (error) => reject(error))
    image.setAttribute('crossOrigin', 'anonymous') // needed to avoid cross-origin issues on CodeSandbox
    image.src = url
  })

/**
 * This function was adapted from the one in the react-easy-crop project
 */
export async function getCroppedImg(
  imageSrc: string,
  pixelCrop: { x: number; y: number; width: number; height: number }
): Promise<Blob | null> {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  if (!ctx) {
    return null
  }

  const MAX_WIDTH = 1920
  const MAX_HEIGHT = 1920
  let targetWidth = pixelCrop.width
  let targetHeight = pixelCrop.height

  if (targetWidth > MAX_WIDTH || targetHeight > MAX_HEIGHT) {
    const ratio = Math.min(MAX_WIDTH / targetWidth, MAX_HEIGHT / targetHeight)
    targetWidth = targetWidth * ratio
    targetHeight = targetHeight * ratio
  }

  // set canvas size to match the desired crop size
  canvas.width = targetWidth
  canvas.height = targetHeight

  // draw cropped image onto canvas
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

  // As a blob
  return new Promise((resolve) => {
    canvas.toBlob((blob) => {
      resolve(blob)
    }, 'image/jpeg', 0.85)
  })
}
