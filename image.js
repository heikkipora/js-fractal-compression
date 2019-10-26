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

export async function pixelsToFile(r, g, b, width, height, path) {
  const pixels = mergeToRGB(r, g, b)
  await saveImage(pixels, width, height, path)
}

function saveImage(pixels, width, height, path) {
  const options = {raw: {width, height, channels: 3}}
  return sharp(pixels, options)
    .jpeg({quality: 90})
    .toFile(path)
}

function mergeToRGB(r, g, b) {
  var pixels = Buffer.alloc(r.length * 3);
  for(let i = 0; i < r.length ; i++) {
    pixels[i * 3] = r[i]
    pixels[i * 3 + 1] = g[i]
    pixels[i * 3 + 2] = b[i]
  }
  return pixels
}