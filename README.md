# Fractal image compression with ES6

See [Wikipedia](https://en.wikipedia.org/wiki/Fractal_compression) for a short introduction to the theory.

Fractal compression was a thing during the 1990s but industry interest later faded and less computationally intensive formats such as JPEG prevailed. Fractal compression is a massively asymmetric process where the encoding is very pricey and decoding is very simple.

I was intrigued by the beauty of the idea (of fractal compression) then and still am. Having implemented a fractal encoder/decoder in MC680x0 assembler during mid-1990s for some Amiga demoscene stuff I had some faint memories of how one should work. Not having that source code around anymore I wanted to give it a try with my current main language (ES6) - out of my head without a reference implementation :)

A weekend of coding resulted in this simplistic implementation which still produces visually appealing results.
Note that I have prioritized performance and encoding efficiency over code beauty (such as functional paradigms).

A nice writeup of a similar implementation (in python & numpy) by *pvigier* is here: https://pvigier.github.io/2018/05/14/fractal-image-compression.html

![Run tests](https://github.com/heikkipora/js-fractal-compression/actions/workflows/test.yml/badge.svg)

## Example images

| Original | Compressed |
| -------- | ---------- |
| <img src="https://raw.github.com/heikkipora/js-fractal-compression/master/examples/castle.jpg" width="400"/> | <img src="https://raw.github.com/heikkipora/js-fractal-compression/master/examples/castle.decoded.jpg" width="400"/> |
| ```bin/encode examples/castle.jpg examples/castle.fractal``` | ```bin/decode examples/castle.fractal examples/castle.decoded.jpg``` |
| <img src="https://raw.github.com/heikkipora/js-fractal-compression/master/examples/hedgehog.jpg" width="400"/> | <img src="https://raw.github.com/heikkipora/js-fractal-compression/master/examples/hedgehog.decoded.jpg" width="400"/> |
| ```bin/encode examples/hedgehog.jpg examples/hedgehog.fractal``` | ```bin/decode examples/hedgehog.fractal examples/hedgehog.decoded.jpg``` |

## Decoding process visualized

The decoding process applies a set of block transformations determined in encoding phase (and stored in the .fractal file) on top of an image (any image, a blank one, one with random pixels, anything goes).

The table below illustrates the twelve first iterations decoding ```examples/helena.fractal``` including the blank seed image. The number of iterations required for a recognizable image is surprisingly low, and after ten iterations the changes are barely noticeable.

|     |      |      |      |
| --- | ---- | ---- | ---- |
| <img src="https://raw.github.com/heikkipora/js-fractal-compression/master/examples/helena-0.png" width="200"/> | <img src="https://raw.github.com/heikkipora/js-fractal-compression/master/examples/helena-1.png" width="200"/> | <img src="https://raw.github.com/heikkipora/js-fractal-compression/master/examples/helena-2.png" width="200"/> | <img src="https://raw.github.com/heikkipora/js-fractal-compression/master/examples/helena-3.png" width="200"/> |
| <img src="https://raw.github.com/heikkipora/js-fractal-compression/master/examples/helena-4.png" width="200"/> | <img src="https://raw.github.com/heikkipora/js-fractal-compression/master/examples/helena-5.png" width="200"/> | <img src="https://raw.github.com/heikkipora/js-fractal-compression/master/examples/helena-6.png" width="200"/> | <img src="https://raw.github.com/heikkipora/js-fractal-compression/master/examples/helena-7.png" width="200"/> |
| <img src="https://raw.github.com/heikkipora/js-fractal-compression/master/examples/helena-8.png" width="200"/> | <img src="https://raw.github.com/heikkipora/js-fractal-compression/master/examples/helena-9.png" width="200"/> | <img src="https://raw.github.com/heikkipora/js-fractal-compression/master/examples/helena-10.png" width="200"/> | <img src="https://raw.github.com/heikkipora/js-fractal-compression/master/examples/helena-11.png" width="200"/> |


*All example images by me (Heikki Pora)*

## Pre-requisites

- Node.js v24.18 or newer

## Installation

```npm install```

## Test execution with the Node.js test runner

```npm test```

## Running

- ```bin/encode <input-image> <output-file>```
- ```bin/decode <input-file> <output-image> [iterations]```

Format of input and output images is determined automatically by ```sharp```. The default number of iterations is 16 which should be enough for all uses.

## How it works

The idea of fractal compression is to express every small block of an image as a transformed copy of some larger block found elsewhere in the same image - and store only the recipe of copies instead of any pixels.

### Encoding

Each color channel (red, green, blue) is encoded with the same algorithm, in parallel worker threads (one per channel):

1. A catalog of candidate blocks is built first: every 8 x 8 pixel block aligned on an 8-pixel grid is scaled down to 4 x 4 (by averaging 2 x 2 pixel cells) in six variants - flipped horizontally, flipped vertically, as-is, and rotated by 90°, 180° and 270°.
2. Every variant is classified by the brightness ranking of its four quadrants into one of 24 classes. The ranking doesn't change when brightness or contrast is adjusted, which means that a good match for a target block is found within the target's own class.
3. The image is then processed as 4 x 4 pixel target blocks. For each target block, the catalog candidates of the block's own class are scanned outward from the block's position, as nearby image content is the most likely to contain a good match. Every candidate gets a brightness adjustment (computed from the pixel sums), after which the pixel-wise squared difference is accumulated. A candidate is abandoned as soon as its difference exceeds the best one found so far, and the whole scan ends early if the difference is below the allowed error threshold.
4. The best match is stored as the candidate block's coordinates, transform index and brightness adjustment.

Contrast is not stored per block: all copies are scaled towards the average with a fixed 75% contrast factor (```CONTRAST``` in ```lib/constants.js```). This is what makes the decoding iteration converge.

A ```.fractal``` file is simply a small header (magic marker, image width and height) followed by the matches of the three channels, each packed into 32 bits: 9 bits of brightness (-255...255), 3 bits of transform index and 10 + 10 bits of block coordinates (scaled down by 8).

### Decoding

The stored transformations form a contractive mapping: applying them to *any* image produces an image that is closer to the encoded one. Decoding is simply repeating that until the changes become invisible:

1. Start with a seed image - blank, random pixels, anything goes.
2. For every 4 x 4 block of the target image, copy its stored 8 x 8 source block from the previous iteration's image, scaled down, transformed, and adjusted with the stored brightness and the fixed contrast factor.
3. Swap the two image buffers and repeat - 16 iterations by default, though a recognizable image emerges after just a few (see the visualization above).

As decoding only needs a single pass over the pixels per iteration, it runs several orders of magnitude faster than encoding - the asymmetry that fractal compression is famous for.
