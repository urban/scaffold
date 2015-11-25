export default function createInput (stream) {
  return str => {
    process.nextTick(() => { stream.write(str + '\n') })
  }
}
