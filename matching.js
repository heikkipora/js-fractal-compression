export function findBestMatch(targetBlock, blocks, allowedError) {
  let bestDiff = Number.POSITIVE_INFINITY
  let bestBlock = null;
  let bestTransform = 0;
  let bestOffset = 0;

  for(let i = 0; i < blocks.length && bestDiff > allowedError; i++) {
    var block = blocks[i]
    for(let transform = 0; transform < block.v.length; transform++) {
      var diff = difference(targetBlock, block.v[transform])
      if (diff < bestDiff) {
        bestDiff = diff
        bestBlock = block
        bestTransform = transform
        bestOffset = 0
        if (diff <= allowedError) {
          break;
        }
      }
      diff = differenceDarken(targetBlock, block.v[transform])
      if (diff < bestDiff) {
        bestDiff = diff
        bestBlock = block
        bestTransform = transform
        bestOffset = 1
        if (diff <= allowedError) {
          break;
        }
      }
      diff = differenceLighten(targetBlock, block.v[transform])
      if (diff < bestDiff) {
        bestDiff = diff
        bestBlock = block
        bestTransform = transform
        bestOffset = 2
        if (diff <= allowedError) {
          break;
        }
      }
    }
  }

  return {
    t: bestTransform,
    o: bestOffset,
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

function differenceDarken(blockA, blockB) {
  let sum = 0
  for (let i = 0; i < 16; i++) {
    sum += Math.abs(blockA[i] - Math.min(blockB[i] - 16, 0))
  }
  return sum
}

function differenceLighten(blockA, blockB) {
  let sum = 0
  for (let i = 0; i < 16; i++) {
    sum += Math.abs(blockA[i] - Math.max(blockB[i] + 16, 255))
  }
  return sum
}
