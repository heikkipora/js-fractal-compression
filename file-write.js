import fs from 'fs'
import {BLUE_COMPONENT, GREEN_COMPONENT, MAGIC_MARKER, RED_COMPONENT} from './file-constants.js'

export async function writeFile({r, g, b, width, height},  path) {
  const out = fs.createWriteStream(path)
  out.write(header(width, height))

  out.write(componentHeader(RED_COMPONENT, r.length))
  r.forEach(m => out.write(block(m)))

  out.write(componentHeader(GREEN_COMPONENT, g.length))
  g.forEach(m => out.write(block(m)))

  out.write(componentHeader(BLUE_COMPONENT, b.length))
  b.forEach(m => out.write(block(m)))

  out.close()
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

function block({t, b, c, x, y}) {
  if (x >= 4096) {
    throw Error(`X value ${x}s overflows 12 bits`)
  }
  if (y >= 4096) {
    throw Error(`Y value ${y}s overflows 12 bits`)
  }
  if (t >= 32) {
    throw Error(`T value ${t}s overflows 5 bits`)
  }
  const buf = Buffer.alloc(6)
  const packed = t << 24 | x << 12 | y
  buf.writeUInt32LE(packed, 0)
  buf.writeInt8(Math.round(b / 2), 4)
  buf.writeUInt8(c, 5)
  return buf
}

