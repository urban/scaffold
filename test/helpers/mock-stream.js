import { Duplex } from 'stream'

const { nextTick } = process

export default class MockReadWriteStream extends Duplex {

  resume () {}
  pause () {}
  setEncoding () {}
  flush () {}
  read () {}
  end () {}

  write (msg) {
    this.emit('data', msg)
  }

  writeNextTick (msg) {
    nextTick(() => { this.write(msg) })
  }
}
