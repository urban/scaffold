/* @flow */
import { red } from 'chalk'

export const transports = {
  stdout: process.stdout,
  stderr: process.stderr
}

export let exitOnError = true

export function log (msg: string): void {
  transports.stdout.write(msg + '\n')
}

export function fatal (msg: string): void {
  if (msg instanceof Error) {
    msg = msg.message.trim()
  }
  transports.stderr.write(red(msg))
  if (exitOnError) {
    process.exit(1)
  }
}

export function success (msg: string): void {
  transports.stdout.write(msg + '\n')
  process.exit(0)
}
