/* @flow */
declare module 'prompt' {
  declare function start (): void
  declare function get (schema: Array<Object>, callback: Function): void
  declare var override: Object
  declare var message: string
  declare var delimiter: string
  declare var colors: boolean
}
