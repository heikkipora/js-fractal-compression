import {
  flipX,
  flipY,
  rotate0,
  rotate90,
  rotate180,
  rotate270
} from './transform.js'

const transformFunctions = [flipX, flipY, rotate0, rotate90, rotate180, rotate270]
const workBlock = new Uint8Array(new ArrayBuffer(16))

export function findBestMatch(srcWidth, srcHeight, src, targetBlock) {
  let bestDiff = Number.POSITIVE_INFINITY
  let bestTransform = 0
  let bestX = 0
  let bestY = 0

  for (let y = 0; y < srcHeight - 16; y++) {
    for (let x = 0; x < srcWidth - 16; x++) {
      const match = findBestMatchForPosition(x, y, src, srcWidth, targetBlock)
      if (match.bestDiff < bestDiff) {
        bestDiff = match.bestDiff
        bestTransform = match.bestTransform
        bestX = x
        bestY = y
      }
    }
  }

  return {
    transform: bestTransform,
    x: bestX,
    y: bestY
  }
}

function findBestMatchForPosition(xStart, yStart, src, srcWidth, targetBlock) {
  let bestDiff = Number.POSITIVE_INFINITY
  let bestTransform = 0;

  for (let i = 0; i < transformFunctions.length; i++) {
    transformFunctions[i](xStart, yStart, src, srcWidth, workBlock)
    const diff = difference(workBlock, targetBlock)
    if (diff < bestDiff) {
      bestDiff = diff
      bestTransform = i
    }
  }

  return {bestTransform, bestDiff}
}

function difference(blockA, blockB) {
  let sum = 0
  for (let i = 0; i < 16; i++) {
    sum += Math.abs(blockA[i] - blockB[i])
  }
  return sum
}