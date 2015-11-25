/* @flow */
declare module 'fs-extra' {
  declare function stat (path: string, callback?: (err: Error, stats: Object) => any): void
  declare function accessSync (path: string, mode?: string): void
  declare function ensureDirSync (filename: string): void
  declare function readFileSync (filename: string): string
  declare function readFileSync (filename: string, encoding: string): string
  declare function outputFileSync (filename: string, data: any): void
  declare var F_OK: string
}
