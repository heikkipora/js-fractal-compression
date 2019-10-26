// Functions to scale an 8 x 8 pixel block down to 4 x 4 while flipping or rotating it

export function flipX(xStart, yStart, src, width, dst) {
  let i = 0
  const xEnd = xStart + 6
  const yEnd = yStart + 8
  for (let y = yStart; y < yEnd; y += 2) {
    for (let x = xEnd; x >= xStart; x -= 2) {
      dst[i++] = src[y * width + x] +
                 src[y * width + x + 1] +
                 src[(y + 1) * width + x] +
                 src[(y + 1) * width + x + 1] >> 2
   }
  }
}

export function flipY(xStart, yStart, src, width, dst) {
  let i = 0
  const xEnd = xStart + 8
  const yEnd = yStart + 6
  for (let y = yEnd; y >= yStart; y -= 2) {
    for (let x = xStart; x < xEnd; x += 2) {
      dst[i++] = src[y * width + x] +
                 src[y * width + x + 1] +
                 src[(y + 1) * width + x] +
                 src[(y + 1) * width + x + 1] >> 2
   }
  }
}

export function rotate0(xStart, yStart, src, width, dst) {
  let i = 0
  const xEnd = xStart + 8
  const yEnd = yStart + 8
  for (let y = yStart; y < yEnd; y += 2) {
    for (let x = xStart; x < xEnd; x += 2) {
      dst[i++] = src[y * width + x] +
                 src[y * width + x + 1] +
                 src[(y + 1) * width + x] +
                 src[(y + 1) * width + x + 1] >> 2
   }
  }
}

export function rotate90(xStart, yStart, src, width, dst) {
  let i = 0
  const xEnd = xStart + 8
  const yEnd = yStart + 6
  for (let x = xStart; x < xEnd; x += 2) {
    for (let y = yEnd; y >= yStart; y -= 2) {
      dst[i++] = src[y * width + x] +
                 src[y * width + x + 1] +
                 src[(y + 1) * width + x] +
                 src[(y + 1) * width + x + 1] >> 2
   }
  }
}

export function rotate180(xStart, yStart, src, width, dst) {
  let i = 0
  const xEnd = xStart + 6
  const yEnd = yStart + 6
  for (let y = yEnd; y >= yStart; y -= 2) {
    for (let x = xEnd; x >= xStart; x -= 2) {
      dst[i++] = src[y * width + x] +
                 src[y * width + x + 1] +
                 src[(y + 1) * width + x] +
                 src[(y + 1) * width + x + 1] >> 2
   }
  }
}

export function rotate270(xStart, yStart, src, width, dst) {
  let i = 0
  const xEnd = xStart + 6
  const yEnd = yStart + 8
  for (let x = xEnd; x >= xStart; x -= 2) {
    for (let y = yStart; y < yEnd; y += 2) {
      dst[i++] = src[y * width + x] +
                 src[y * width + x + 1] +
                 src[(y + 1) * width + x] +
                 src[(y + 1) * width + x + 1] >> 2
   }
  }
}

export function brighten(dst) {
  for (let i = 0; i < 16; i++) {
    dst[i] = dst[i] * value >> 8
  }
}

export function brightess(dst) {
  for (let i = 0; i < 16; i++) {
    dst[i] = dst[i] * value >> 8
  }
}