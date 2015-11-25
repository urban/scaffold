/* @flow */
declare module 'handlebars' {
  declare function compile (template: string, options: Object): (data: Object) => string
}
