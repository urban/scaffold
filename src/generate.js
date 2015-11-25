/* @flow */
import glob from 'glob'
import { join, relative } from 'path'
import fse from 'fs-extra'
import handlebars from 'handlebars'
import { log } from './logger'
import { gray, green, red, yellow } from 'chalk'

const exists = (path) => {
  try {
    fse.accessSync(path, fse.F_OK)
  } catch (err) {
    return false
  }
  return true
}

function compileContent (data, content) {
  return handlebars.compile(content)(data)
}

// TODO: Add options object, { silent, force }
// TODO: Prompt for overwrite, defaults to yes
export default function generate (srcDir: string, destDir: string, props: Object = {}): void {
  fse.ensureDirSync(destDir)
  const sources = glob.sync('./**/*', {cwd: srcDir, realpath: true, nodir: true, dot: true})
  for (let filename of sources) {
    const destination = join(destDir, relative(srcDir, filename))
    const location = relative(srcDir, filename)
    const overwrite = exists(destination)
    const outputMessage = [overwrite ? red('Overwrite') : green('Created'), gray('->'), yellow(location)].join(' ')
    log(outputMessage)
    const content = compileContent(props, fse.readFileSync(filename, 'utf8'))
    fse.outputFileSync(destination, content)
  }
}
