import test from 'tape'

import os from 'os'
import pkg from '../package'
import { sync as globSync } from 'glob'
import { join, relative, resolve } from 'path'
import { ensureDirSync, readFileSync, readJsonSync, removeSync } from 'fs-extra'
import generate from '../src/generate'
import userInput from './fixtures/userInput'

const tmpDir = resolve(os.tmpdir(), pkg.name)
const templateDir = join(__dirname, 'template')
const pathToOutput = (filename) => join(tmpDir, filename)

const before = () => ensureDirSync(tmpDir)
const after = () => removeSync(tmpDir)

function filesAt (dir) {
  return globSync('./**/*', {realpath: true, nodir: true, dot: true, cwd: dir})
}

function captureLogs (module) {
  let output = []
  module.__Rewire__('log', (...args) => { output.push(args.join(' ')) })
  return {
    get: () => output,
    clear: () => { output = [] },
    release: () => { module.__ResetDependency__('log') }
  }
}

test('It should output progress info.', async t => {
  t.plan(3)
  before()
  const expectedOutputFiles = [
    '.babelrc',
    'package.json',
    'README.md',
    'src/__tests__/index-test.js',
    'src/index.js'
  ]
  const output = captureLogs(generate)
  generate(templateDir, tmpDir, userInput)
  const expectedCreatedOutput = (msg, index) => msg === 'Created -> ' + expectedOutputFiles[index]
  t.equal(await output.get().every(expectedCreatedOutput), true, 'Outputs created info on initial generation.')
  // test overwrite
  const expectedNumberOfFiles = filesAt(templateDir).length
  const expectedNumberOfOverwrites = 3
  removeSync(pathToOutput('package.json'))
  removeSync(pathToOutput('README.md'))
  output.clear()
  generate(templateDir, tmpDir, userInput)
  t.equal(output.get().length, expectedNumberOfFiles, 'Output the correct number of files')
  const overwrites = output.get().filter(msg => msg.split(' ')[0] === 'Overwrite').length
  t.equal(overwrites, expectedNumberOfOverwrites, 'Outputs overwrite info.')
  output.release()

  after()
  t.end()
})

test('It should generate files.', t => {
  t.plan(4)
  before()
  const expectedOutputFiles = [
    '.babelrc',
    'package.json',
    'README.md',
    'src',
    'src/__tests__',
    'src/__tests__/index-test.js',
    'src/index.js'
  ]
  const output = captureLogs(generate)
  generate(templateDir, tmpDir, userInput)
  t.deepEqual(filesAt(tmpDir).map(f => relative(join('/private', tmpDir), f)), expectedOutputFiles, 'Generated the correct files.')
  const {name, version} = readJsonSync(join(tmpDir, 'package.json'))
  t.equal(name, userInput.pkg.name, 'Generated the correct pkg.name.')
  t.equal(version, userInput.pkg.version, 'Generated the correct pkg.version.')
  const readme = readFileSync(pathToOutput('README.md'), 'utf8')
  t.equal(readme, `# ${userInput.pkg.name}\n`, 'Generated the correct README info.')
  output.release()

  after()
  t.end()
})
