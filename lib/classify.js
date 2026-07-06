// Blocks are classified by the brightness ranking of their four quadrants (Fisher's scheme).
// The ranking is invariant under the encoder's brightness and contrast adjustment, so a
// well-matching block pair lands in the same class and only same-class candidates need
// to be compared.

// Quadrant pixel indices of a linear 4 x 4 block
const QUADRANTS = [
  [0, 1, 4, 5],
  [2, 3, 6, 7],
  [8, 9, 12, 13],
  [10, 11, 14, 15]
]

export const CLASS_COUNT = 24

export function classifyBlock(block) {
  const sums = QUADRANTS.map(([a, b, c, d]) => block[a] + block[b] + block[c] + block[d])
  const [first, second, third] = [0, 1, 2, 3].sort((a, b) => sums[b] - sums[a] || a - b)
  // Lehmer code of the quadrant permutation -> 0..23
  return first * 6 +
         (second - (second > first ? 1 : 0)) * 2 +
         (third - (third > first ? 1 : 0) - (third > second ? 1 : 0))
}
