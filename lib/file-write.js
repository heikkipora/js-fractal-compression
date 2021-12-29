import fs from 'fs'
import {BLUE_COMPONENT, GREEN_COMPONENT, MAGIC_MARKER, RED_COMPONENT} from './constants.js'

export function writeFile({r, g, b, width, height},  path) {
  return new Promise((resolve, reject) => {
    const out = fs.createWriteStream(path)
    out.on('error', reject)
    out.on('finish', resolve)

    out.write(header(width, height))

    out.write(componentHeader(RED_COMPONENT, r.length))
    r.forEach(m => out.write(block(m)))
  
    out.write(componentHeader(GREEN_COMPONENT, g.length))
    g.forEach(m => out.write(block(m)))
  
    out.write(componentHeader(BLUE_COMPONENT, b.length))
    b.forEach(m => out.write(block(m)))
  
    out.close()  
  })
}

function header(width, height) {
  const buf = Buffer.alloc(8)
  buf.writeUInt32LE(MAGIC_MARKER, 0)
  buf.writeUInt16LE(width, 4)
  buf.writeUInt16LE(height, 6)
  return buf
}

function componentHeader(id, length) {
  const buf = Buffer.alloc(8)
  buf.writeUInt32LE(id, 0)
  buf.writeUInt32LE(length, 4)
  return buf
}

function block({transform, brightness, x, y}) {
  const buf = Buffer.alloc(4)
  // move brightness from -255..255 to 0...511 (9 bits)
  const b = brightness + 255
  // transform fits into 3 bits
  // block size is 8 x 8, so the coordinates can be safely scaled down by 8, each has 10 bits (max value 8191)
  const packed = b << 23 | transform << 20 | x << 7 | y >> 3
  buf.writeInt32LE(packed, 0)
  return buf
}

