
export function extractBlock(src, xStart, yStart, width, dst) {
  let i = 0
  const xEnd = xStart + 4
  const yEnd = yStart + 4
  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      dst[i++] = src[y * width + x]
    }
  }
}