const crypto = require('crypto'); // eslint-disable-line @typescript-eslint/no-var-requires

Object.defineProperty(global.self, 'crypto', {
  value: {
    getRandomValues: (arr) => crypto.randomBytes(arr.length)
  }
});