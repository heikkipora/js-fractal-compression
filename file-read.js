import fs from 'fs'
import {BLUE_COMPONENT, GREEN_COMPONENT, MAGIC_MARKER, RED_COMPONENT} from './file-constants.js'

export async function readFile(path) {
  const buf = await fs.promises.readFile(path)
  let offset = 0
  const {marker, width, height} = header(buf, offset)
  offset += 8
  if (marker !== MAGIC_MARKER) {
    throw new Error('Uknown file type, marker not found')
  }

  const r = component(buf, offset, RED_COMPONENT)
  offset += r.length * 4 + 8
  const g = component(buf, offset, GREEN_COMPONENT)
  offset += g.length * 4 + 8
  const b = component(buf, offset, BLUE_COMPONENT)
  offset += b.length * 4 + 8

  return {r, g, b, width, height}
}

function header(buf, offset) {
  const marker = buf.readUInt32LE(offset)
  const width = buf.readUInt16LE(offset + 4)
  const height = buf.readUInt16LE(offset + 6)
  return {marker, width, height}
}

function component(buf, offset, expectedId) {
  const {id, length} = componentHeader(buf, offset)
  if (id !== expectedId) {
    throw new Error('File parsing failed, unkown component header id ' + expectedId)
  }
  const blocks = []
  for (let i = 0; i < length; i++) {
    blocks.push(block(buf, offset + 8 + i * 4))
  }
  return blocks
}

function componentHeader(buf, offset) {
  const id = buf.readUInt32LE(offset)
  const length = buf.readUInt32LE(offset + 4)
  return {id, length}
}

function block(buf, offset) {
  const packed = buf.readUInt32LE(offset)
  const o = packed & 0x60000000 >> 29
  const t = packed & 0x01F00000 >> 24
  const x = packed & 0x00FFF000 >> 12
  const y = packed & 0x00000FFF
  return {t, o, x, y}
}