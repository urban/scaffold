/* @flow */
import prompt from './prompt'
import fse from 'fs-extra'
import generate from './generate'

// TODO: Add options object, { silent, force }
// TODO: Prompt for overwrite, defaults to yes
export default async function scaffold (srcDir: string, destDir: string, questions: Object = {}, props: Object = {}): Promise {
  fse.ensureDirSync(destDir)
  const data = await prompt(questions, props)
  generate(srcDir, destDir, data)
}
