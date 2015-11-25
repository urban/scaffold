# @urban/scaffold

A simple static site generator.


## Install

```sh
npm i @urban/scaffold
```


## Usage

```js
import { join, resolve } from 'path'
import scaffold from '@urban/scaffold'
import { tmpdir }  from 'os'

const srcDir = join(__dirname, 'template')
const destDir = resolve(tmpdir(), 'my-project')
const props = { 'user.name': 'John Doe' }

const questions = {
  'user.name': {
    description: 'Your name',
    message: 'Required',
    required: true
  },
  'user.email': {
    description: 'Your email',
    format: 'email',
    message: 'Must be a valid email address'
  },
  'user.website': {
    description: 'Your website',
    format: 'url',
    message: 'Must be a valid url'
  }
}

scaffold(srcDir, destDir, questions, props)
```


## License

[The MIT License (MIT)](LICENSE). Copyright (c) [Urban Faubion](http://urbanfaubion.com).
