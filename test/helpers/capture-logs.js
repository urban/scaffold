export default function captureLogs (module) {
  return () => new Promise(resolve => {
    module.__Rewire__('log', msg => { resolve(msg) })
  })
}
