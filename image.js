import sharp from 'sharp'

export async function fileToPixels(path) {
  const {data, info: {width, height, channels}} = await loadImage(path)
  const {r, g, b} = splitToRGB(data, channels)
  return {r, g, b, width, height}
}

function loadImage(path) {
  return sharp(path)
    .raw()
    .toBuffer({resolveWithObject: true})
}

function splitToRGB(pixelData, channels) {
  const length = pixelData.length / channels
  const r = new Uint8Array(new ArrayBuffer(length))
  const g = new Uint8Array(new ArrayBuffer(length))
  const b = new Uint8Array(new ArrayBuffer(length))

  for(let i = 0; i < length ; i++) {
    const offset = i * channels
    r[i] = pixelData[offset]
    g[i] = pixelData[offset + 1]
    b[i] = pixelData[offset + 2]
  }

  return {r, g, b}
}