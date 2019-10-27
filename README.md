# Fractal image compression with ES6

See [Wikipedia](https://en.wikipedia.org/wiki/Fractal_compression) for a short introduction to the theory.

Fractal compression was a thing during the 1990s but industry interest later faded and less computationally intensive formats such as JPEG prevailed. Fractal compression is a massively asymmetric process where the encoding is very pricey and decoding is very simple.

I was intrigued by the beauty of the idea (of fractal compression) then and still am. Having implemented a fractal encoder/decoder in MC680x0 assembler during mid-1990s for some Amiga demoscene stuff I had some faint memories of how one should work. Not having that source code around anymore I wanted to give it a try with my current main language (ES6) - out of my head without a reference implementation :)

A weekend of coding resulted in this simplistic implementation which still produces visually appealling results.
Note that I have prioritized performance and encoding efficiency over code beauty (such as functional paradigms).

A nice writeup of a similar implementation (in python & numpy) by *pvigier* is here: https://pvigier.github.io/2018/05/14/fractal-image-compression.html

[![build status](https://travis-ci.org/heikkipora/js-fractal-compression.svg?branch=master)](https://travis-ci.org/heikkipora/js-fractal-compression)

## Example images

| Original | Compressed |
| -------- | ---------- |
| <img src="https://raw.github.com/heikkipora/js-fractal-compression/master/examples/castle.jpg" width="400"/> | <img src="https://raw.github.com/heikkipora/js-fractal-compression/master/examples/castle.decoded.jpg" width="400"/> |
| ```bin/encode examples/castle.jpg examples/castle.fractal``` | ```bin/decode examples/castle.fractal examples/castle.decoded.jpg``` |
| <img src="https://raw.github.com/heikkipora/js-fractal-compression/master/examples/hedgehog.jpg" width="400"/> | <img src="https://raw.github.com/heikkipora/js-fractal-compression/master/examples/hedgehog.decoded.jpg" width="400"/> |
| ```bin/encode examples/hedgehog.jpg examples/hedgehog.fractal``` | ```bin/decode examples/hedgehog.fractal examples/hedgehog.decoded.jpg``` |

Note that it takes several minutes to encode the images.

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

- Node.js v12.13.0 or newer

## Installation

```npm install```

## Test execution with mocha

```npm test```

## Running

- ```bin/encode <input-image> <output-file>```
- ```bin/decode <input-file> <output-image> [iterations]```

Format of input and output images is determined automatically by ```sharp```. The default number of iterations is 16 which should be enough for all uses.
