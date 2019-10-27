export function findBestMatch(targetBlock, blocks, allowedError) {
  let bestDiff = Number.POSITIVE_INFINITY
  let bestMatch = {}

  for(let i = 0; i < blocks.length && bestDiff > allowedError; i++) {
    const block = blocks[i]
    for(let transform = 0; transform < block.variants.length; transform++) {
      const {difference, brightness, contrast} = adjustedDifference(targetBlock, block.variants[transform])
      if (difference < bestDiff) {
        bestDiff = difference
        bestMatch = {
          t: transform,
          x: block.x,
          y: block.y,
          b: brightness,
          c: contrast
        }
        if (bestDiff <= allowedError) {
          break;
        }
      }
    }
  }

  return bestMatch
}

function adjustedDifference(blockA, blockB) {
  const {brightness, contrast} = brightnessAndContrast(blockA, blockB)

  let sum = 0
  for (let i = 0; i < 16; i++) {
    const adjusted = (contrast * blockB[i] >> 8) + brightness
    sum += Math.pow(Math.abs(blockA[i] - adjusted), 2)
  }
  return {difference: sum, contrast, brightness}
}

function brightnessAndContrast(blockA, blockB) {
  const contrast = 192
  let brightness = 0
  for (let i = 0; i < 16; i++) {
    brightness += blockA[i] - (contrast * blockB[i]) / 256
  }
  return {brightness: Math.round(brightness / 16), contrast}
}