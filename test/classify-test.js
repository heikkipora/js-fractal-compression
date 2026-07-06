import {describe, it} from 'node:test'
import assert from 'node:assert/strict'
import {classifyBlock, CLASS_COUNT} from '../lib/classify.js'

describe('Block classification', () => {
  it('Should classify by descending quadrant brightness order', () => {
    assert.equal(classifyBlock(quadrants(40, 30, 20, 10)), 0)
    assert.equal(classifyBlock(quadrants(10, 20, 30, 40)), CLASS_COUNT - 1)
  })

  it('Should resolve ties consistently regardless of brightness level', () => {
    assert.equal(classifyBlock(quadrants(7, 7, 7, 7)), classifyBlock(quadrants(200, 200, 200, 200)))
  })

  it('Should not change the class when brightness and contrast are adjusted', () => {
    const block = quadrants(90, 35, 60, 10)
    const adjusted = block.map(pixel => (192 * pixel >> 8) + 30)
    assert.equal(classifyBlock(adjusted), classifyBlock(block))
  })

  it('Should map the 24 quadrant orderings to 24 distinct classes', () => {
    const values = [40, 30, 20, 10]
    const classes = new Set()
    for (const [a, b, c, d] of permutations([0, 1, 2, 3])) {
      classes.add(classifyBlock(quadrants(values[a], values[b], values[c], values[d])))
    }
    assert.equal(classes.size, CLASS_COUNT)
  })
})

function quadrants(tl, tr, bl, br) {
  return [
    tl, tl, tr, tr,
    tl, tl, tr, tr,
    bl, bl, br, br,
    bl, bl, br, br
  ]
}

function permutations(values) {
  if (values.length <= 1) {
    return [values]
  }
  return values.flatMap(value =>
    permutations(values.filter(v => v !== value)).map(rest => [value, ...rest])
  )
}
