import test from 'tape'

import os from 'os'
import pkg from '../package'
import scaffold from '../src'
import { join, resolve } from 'path'
import questions from './fixtures/questions'
import userInput from './fixtures/userInput'

process.on('unhandledRejection', err => console.error(err))

const tmpDir = resolve(os.tmpdir(), pkg.name)
const templateDir = join(__dirname, 'template')

test('It has the correct props.', async t => {
  const args = { 'pkg.name': 'foo' }
  let destination
  let promptProps
  let generateProps
  scaffold.__Rewire__('fse', { ensureDirSync: (dir) => destination = dir })
  scaffold.__Rewire__('prompt', (...args) => {
    promptProps = args
    return userInput
  })
  scaffold.__Rewire__('generate', (...args) => generateProps = args)

  await scaffold(templateDir, tmpDir, questions, args)
  t.equal(destination, tmpDir, 'Destination directory.')
  t.equal(promptProps[0], questions, 'Questions.')
  t.equal(promptProps[1], args, 'Question overrides.')
  t.equal(generateProps[0], templateDir, 'Source directory.')
  t.equal(generateProps[1], tmpDir, 'Destination directory.')
  t.equal(generateProps[2], userInput, 'Data.')

  scaffold.__ResetDependency__('fse')
  scaffold.__ResetDependency__('prompt')
  scaffold.__ResetDependency__('generate')
  t.end()
})
