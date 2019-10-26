import {
  flipX,
  flipY,
  rotate0,
  rotate90,
  rotate180,
  rotate270
} from './transform.js'

const transformFunctions = [flipX, flipY, rotate0, rotate90, rotate180, rotate270]

export function generateBlocks(src, width, height) {
  const blocks = []
  for (let y = 0; y < height - 8; y++) {
    for (let x = 0; x < width - 8; x++) {
      const v = executeTransforms(x, y, src, width)
      blocks.push({x, y, v})
    }
  }
  return blocks
}

function executeTransforms(x, y, src, width) {
  return transformFunctions.map(fn => fn(x, y, src, width, new Uint8Array(new ArrayBuffer(16))))
}

export function findBestMatch(targetBlock, blocks) {
  let bestDiff = Number.POSITIVE_INFINITY
  let bestBlock = null;
  let bestTransform = 0;

  for(let i = 0; i < blocks.length && bestDiff > 1; i++) {
    var block = blocks[i]
    for(let transform = 0; transform < block.v.length; transform++) {
      var diff = difference(targetBlock, block.v[transform])
      if (diff < bestDiff) {
        bestDiff = diff
        bestBlock = block
        bestTransform = transform
        if (diff < 2) {
          break;
        }
      }
    }
  }

  return {
    transform: bestTransform,
    x: bestBlock.x,
    y: bestBlock.y
  }
}

function difference(blockA, blockB) {
  let sum = 0
  for (let i = 0; i < 16; i++) {
    sum += Math.abs(blockA[i] - blockB[i])
  }
  return sum
}

