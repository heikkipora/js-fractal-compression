import {classifyBlock} from './classify.js'
import {CONTRAST} from './constants.js'

export function findBestMatch(targetBlock, targetX, targetY, catalog, allowedError) {
  const targetSum = blockSum(targetBlock)
  const targetKey = targetY * catalog.width + targetX
  const best = {difference: Number.POSITIVE_INFINITY, match: {}}

  searchClass(catalog.classes[classifyBlock(targetBlock)], targetBlock, targetSum, targetKey, allowedError, best)
  if (best.difference === Number.POSITIVE_INFINITY) {
    // the target's class has no candidates (possible for very small images) - search all classes
    for (const blockClass of catalog.classes) {
      searchClass(blockClass, targetBlock, targetSum, targetKey, allowedError, best)
    }
  }

  return best.match
}

function searchClass(blockClass, targetBlock, targetSum, targetKey, allowedError, best) {
  const {count, xs, ys, transforms, sums, keys, variants} = blockClass

  // scan candidates ordered by their distance to the target block, as nearby
  // image content is the most likely to contain a good match early
  let right = insertionPoint(keys, targetKey, count)
  let left = right - 1

  while ((left >= 0 || right < count) && best.difference > allowedError) {
    let i
    if (left < 0) {
      i = right++
    } else if (right >= count) {
      i = left--
    } else if (targetKey - keys[left] <= keys[right] - targetKey) {
      i = left--
    } else {
      i = right++
    }

    // brightness only depends on the block sums
    const brightness = Math.round((targetSum - CONTRAST * sums[i] / 256) / 16)
    const offset = i * 16
    let difference = 0
    for (let j = 0; j < 16 && difference < best.difference; j++) {
      const diff = targetBlock[j] - variants[offset + j] - brightness
      difference += diff * diff
    }
    if (difference < best.difference) {
      best.difference = difference
      best.match = {
        x: xs[i],
        y: ys[i],
        transform: transforms[i],
        brightness
      }
    }
  }
}

function insertionPoint(keys, key, count) {
  let lo = 0
  let hi = count
  while (lo < hi) {
    const mid = (lo + hi) >> 1
    if (keys[mid] < key) {
      lo = mid + 1
    } else {
      hi = mid
    }
  }
  return lo
}

function blockSum(block) {
  let sum = 0
  for (let i = 0; i < 16; i++) {
    sum += block[i]
  }
  return sum
}
