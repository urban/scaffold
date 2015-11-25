/* @flow */
import { promisify } from 'bluebird'
import prompt from 'prompt'
import { green } from 'chalk'
import { unflatten } from 'flat'
import { log } from './logger'

const now = new Date()
const date = {
  day: now.getDate(),
  month: now.getMonth(),
  fullYear: now.getFullYear()
}

const stdin = process.stdin
const stdout = process.stdout

export default async function (questions: Object, props: Object): Promise {
  // customize prmopt
  Object.assign(prompt, {
    message: green('>'),
    delimiter: ': ',
    colors: false
  })
  // Set the overrides to skip prompts e.g. ---package.name="my-package"
  prompt.override = props
  // Start the prompt
  prompt.start({stdin, stdout})

  const userInput = promisify(prompt.get)
  const answers = unflatten(await userInput({properties: questions}))

  const confirmation = {
    name: 'confirmed',
    type: 'boolean',
    message: 'Is this correct?',
    warning: 'Must respond true or false',
    default: true
  }
  const results = JSON.stringify(answers, undefined, 2)
  log(results)
  const { confirmed } = await userInput(confirmation)
  const data = {...answers, date}
  return new Promise((resolve, reject) => {
    confirmed ? resolve(data) : reject()
  })
}
