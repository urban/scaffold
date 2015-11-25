export default function captureOutput (stream) {
  return () => new Promise(resolve => {
    stream.once('data', data => resolve(data.toString().trim()))
  })
}
