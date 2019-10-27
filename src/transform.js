// Functions to scale an 8 x 8 pixel block down to 4 x 4 while flipping or rotating it

export const transformFunctions = [flipX, flipY, rotate0, rotate90, rotate180, rotate270]

function flipX(xStart, yStart, src, width, dst) {
  let i = 0
  const xEnd = xStart + 6
  const yEnd = yStart + 8
  for (let y = yStart; y < yEnd; y += 2) {
    for (let x = xEnd; x >= xStart; x -= 2) {
      const offset = y * width + x
      dst[i++] = src[offset] +
                 src[offset + 1] +
                 src[offset + width] +
                 src[offset + width + 1] >> 2
   }
  }
  return dst
}

function flipY(xStart, yStart, src, width, dst) {
  let i = 0
  const xEnd = xStart + 8
  const yEnd = yStart + 6
  for (let y = yEnd; y >= yStart; y -= 2) {
    for (let x = xStart; x < xEnd; x += 2) {
      const offset = y * width + x
      dst[i++] = src[offset] +
                 src[offset + 1] +
                 src[offset + width] +
                 src[offset + width + 1] >> 2
   }
  }
  return dst
}

function rotate0(xStart, yStart, src, width, dst) {
  let i = 0
  const xEnd = xStart + 8
  const yEnd = yStart + 8
  for (let y = yStart; y < yEnd; y += 2) {
    for (let x = xStart; x < xEnd; x += 2) {
      const offset = y * width + x
      dst[i++] = src[offset] +
                 src[offset + 1] +
                 src[offset + width] +
                 src[offset + width + 1] >> 2
   }
  }
  return dst
}

function rotate90(xStart, yStart, src, width, dst) {
  let i = 0
  const xEnd = xStart + 8
  const yEnd = yStart + 6
  for (let x = xStart; x < xEnd; x += 2) {
    for (let y = yEnd; y >= yStart; y -= 2) {
      const offset = y * width + x
      dst[i++] = src[offset] +
                 src[offset + 1] +
                 src[offset + width] +
                 src[offset + width + 1] >> 2
   }
  }
  return dst
}

function rotate180(xStart, yStart, src, width, dst) {
  let i = 0
  const xEnd = xStart + 6
  const yEnd = yStart + 6
  for (let y = yEnd; y >= yStart; y -= 2) {
    for (let x = xEnd; x >= xStart; x -= 2) {
      const offset = y * width + x
      dst[i++] = src[offset] +
                 src[offset + 1] +
                 src[offset + width] +
                 src[offset + width + 1] >> 2
   }
  }
  return dst
}

function rotate270(xStart, yStart, src, width, dst) {
  let i = 0
  const xEnd = xStart + 6
  const yEnd = yStart + 8
  for (let x = xEnd; x >= xStart; x -= 2) {
    for (let y = yStart; y < yEnd; y += 2) {
      const offset = y * width + x
      dst[i++] = src[offset] +
                 src[offset + 1] +
                 src[offset + width] +
                 src[offset + width + 1] >> 2
   }
  }
  return dst
}
