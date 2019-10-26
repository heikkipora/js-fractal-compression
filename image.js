export async function urlToPixels(url) {
  const image = await loadImage(url)
  const width = image.width
  const height = image.height
  const rgba = getPixels(image, width, height)
  const {r, g, b} = splitToRGB(rgba)
  return {r, g, b, width, height}
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = url
  })  
}

function getPixels(image, width, height) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height

  const context = canvas.getContext('2d')
  context.drawImage(image, 0, 0)
  return context.getImageData(0, 0, width, height).data
}

function splitToRGB(rgba) {
  const length = rgba.length / 4
  const r = new Uint8Array(new ArrayBuffer(length))
  const g = new Uint8Array(new ArrayBuffer(length))
  const b = new Uint8Array(new ArrayBuffer(length))

  for(let i = 0; i < length ; i++) {
    r[i] = rgba[i << 2]
    g[i] = rgba[i << 2 + 1]
    b[i] = rgba[i << 2 + 2]
  }

  return {r, g, b}
}