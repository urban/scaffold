/* @flow */
import validate from 'validate-npm-package-name'

export default {
  'pkg.name': {
    description: 'Package name',
    message: 'Must be a valid npm package name',
    before: (name: string): string => name.trim(),
    // I wish conform was a promise!
    conform: (name: string): boolean => {
      const {validForNewPackages, validForOldPackages} = validate(name)
      return validForNewPackages && validForOldPackages
    }
  },
  'pkg.version': {
    description: 'Package version',
    message: 'Must follow SemVer (MAJOR.MINOR.PATCH)',
    pattern: /^(?:\d+\.{1,3}){2}(\d){1,3}$/,
    default: '0.1.0',
    required: true
  },
  'pkg.description': {
    description: 'Package description',
    type: 'string',
    maxLength: 140
  },
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
  },
  'user.github': {
    description: 'Your GitHub username',
    pattern: /^[a-z0-9]+[a-z0-9\-]+[a-z0-9]+$/i,
    message: 'Should be a valid GitHub username',
    required: true
  }
}
