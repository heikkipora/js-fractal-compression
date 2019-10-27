import {transformFunctions} from './transform.js'

export function generateBlocks(src, width, height) {
  const blocks = []
  for (let y = 0; y <= height - 8; y++) {
    for (let x = 0; x <= width - 8; x++) {
      const v = executeTransforms(x, y, src, width)
      blocks.push({x, y, v})
    }
  }
  return blocks
}

function executeTransforms(x, y, src, width) {
  return transformFunctions.map(fn => fn(x, y, src, width, new Uint8Array(new ArrayBuffer(16))))
}
