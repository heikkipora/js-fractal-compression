import {CONTRAST} from './constants.js'
import {transformFunctions} from './transform.js'

export function findBestMatch(targetBlock, catalog, allowedError) {
  const {xs, ys, sums, variants, count} = catalog
  const variantCount = transformFunctions.length
  const targetSum = blockSum(targetBlock)

  let bestDiff = Number.POSITIVE_INFINITY
  let bestMatch = {}

  let offset = 0
  for (let i = 0; i < count && bestDiff > allowedError; i++) {
    // brightness only depends on the block sums, and is shared by all variants of a block
    const brightness = Math.round((targetSum - CONTRAST * sums[i] / 256) / 16)
    for (let transform = 0; transform < variantCount && bestDiff > allowedError; transform++) {
      let difference = 0
      for (let j = 0; j < 16 && difference < bestDiff; j++) {
        const diff = targetBlock[j] - variants[offset + j] - brightness
        difference += diff * diff
      }
      offset += 16
      if (difference < bestDiff) {
        bestDiff = difference
        bestMatch = {
          x: xs[i],
          y: ys[i],
          transform,
          brightness
        }
      }
    }
  }

  return bestMatch
}

function blockSum(block) {
  let sum = 0
  for (let i = 0; i < 16; i++) {
    sum += block[i]
  }
  return sum
}
