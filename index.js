import {urlToPixels} from './image.js'
import {findBestMatch} from './matching.js'

const workBlock = new Uint8Array(new ArrayBuffer(16))

processImage('example.jpg')
  .then(() => console.log('completed'))

async function processImage(url) {
  const {r, g, b, width, height} = await urlToPixels(url)
  const timestamp = Date.now()
  await processComponent(r, width, height)
  await processComponent(g, width, height)
  await processComponent(b, width, height)  
  const took = Date.now() - timestamp
  console.log('seconds', (took / 1000).toFixed(0))
}

async function processComponent(component, width, height) {
  for (let y = 0; y < height; y += 4) {
    const timestamp = Date.now()
    for (let x = 0; x < width; x += 4) {
      const match = await processBlock(component, x, y, width, height)
    }
    const took = Date.now() - timestamp
    console.log('milliseconds per block', took / (width >> 2))
  }  
}

async function processBlock(component, x, y, width, height) {
  return new Promise(resolve => {
    extractBlock(component, x, y, width, workBlock)
    const match = findBestMatch(width, height, component, workBlock)
    setTimeout(() => resolve(match), 0)  
  })
}

function extractBlock(src, xStart, yStart, width, dst) {
  let i = 0
  const xEnd = xStart + 4
  const yEnd = yStart + 4
  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      dst[i++] = src[y * width + x]
    }
  }
}