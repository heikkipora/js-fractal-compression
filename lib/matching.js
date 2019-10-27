import {CONTRAST} from './constants.js'

export function findBestMatch(targetBlock, catalog, allowedError) {
  let bestDiff = Number.POSITIVE_INFINITY
  let bestMatch = {}

  for(let i = 0; i < catalog.length && bestDiff > allowedError; i++) {
    const block = catalog[i]
    for(let transform = 0; transform < block.variants.length && bestDiff > allowedError; transform++) {
      const {difference, brightness} = adjustedDifference(targetBlock, block.variants[transform])
      if (difference < bestDiff) {
        bestDiff = difference
        bestMatch = {
          x: block.x,
          y: block.y,
          transform,
          brightness
        }
      }
    }
  }

  return bestMatch
}

function adjustedDifference(blockA, blockB) {
  const brightness = averageBrightnessDifference(blockA, blockB)

  let difference = 0
  for (let i = 0; i < 16; i++) {
    const adjusted = (CONTRAST * blockB[i] >> 8) + brightness
    difference += Math.pow(Math.abs(blockA[i] - adjusted), 2)
  }
  return {difference, brightness}
}

function averageBrightnessDifference(blockA, blockB) {
  let brightness = 0
  for (let i = 0; i < 16; i++) {
    brightness += blockA[i] - CONTRAST * blockB[i] / 256
  }
  return Math.round(brightness / 16)
}