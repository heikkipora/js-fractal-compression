import {transformFunctions} from './transform.js'

export function generateCatalog(src, width, height) {
  const blocks = []
  for (let y = 0; y <= height - 8; y += 8) {
    for (let x = 0; x <= width - 8; x += 8) {
      const variants = generateBlockVariants(x, y, src, width)
      blocks.push({x, y, variants})
    }
  }
  return blocks
}

function generateBlockVariants(x, y, src, width) {
  return transformFunctions.map(fn => fn(x, y, src, width, new Uint8Array(new ArrayBuffer(16))))
}
