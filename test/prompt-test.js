import test from 'tape'

import prompt from '../src/prompt'
import MockStream from './helpers/mock-stream'
import flatten from 'flat'
import questions from './fixtures/questions'
import userInput from './fixtures/userInput'
import captureOutput from './helpers/capture-output'

process.on('unhandledRejection', (err) => { console.error(err) })

const { nextTick } = process

const stdin = new MockStream()
const stdout = new MockStream()

prompt.__Rewire__('stdin', stdin)
prompt.__Rewire__('stdout', stdout)
prompt.__Rewire__('log', msg => stdout.write(msg))

const question = captureOutput(stdout)

const prompts = Object.keys(questions)
  .reduce((result, key) => {
    const { description } = questions[key]
    const defaultValue = questions[key]['default']
    result[key] = defaultValue
      ? `>: ${description}: (${defaultValue})`
      : `>: ${description}:`
    return result
  }, {})

test('It askes all the questions.', async t => {
  try {
    const answer = (str) => stdin.writeNextTick(str + '\n')
    const results = new Promise(resolve => {
      nextTick(() => resolve(prompt(questions)))
    })

    const userProps = flatten(userInput)
    for (let key in userProps) {
      t.equal(await question(), prompts[key], `Asked for ${key}.`)
      answer(userProps[key])
    }
    const finalProps = await question()
    t.deepEqual(finalProps.trim(), JSON.stringify(userInput, undefined, 2), 'Has correct answers')
    answer(true)
    const now = new Date()
    const expectedResults = { ...userInput, date: { day: now.getDate(), month: now.getMonth(), fullYear: now.getFullYear() } }
    t.deepEqual(await Promise.resolve(results), expectedResults, 'Has correct output')
    t.end()
  } catch (err) {
    console.log(err)
  }
})

test('It should skip questions with overrides.', async t => {
  try {
    nextTick(() => prompt(questions, { 'pkg.name': 'test' }))
    const firstQuestion = await question()
    t.equal(firstQuestion, prompts['pkg.version'], 'Skipped pkg.name.')
    t.end()
  } catch (err) {
    console.log(err)
  }
})
