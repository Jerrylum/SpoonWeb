module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  transform: {
    '^.+\\.vue$': 'vue-jest'
  },
  "roots": [
    "<rootDir>"
  ],
  "modulePaths": [
    "<rootDir>"
  ],
  "moduleDirectories": [
    "node_modules",
    "src"
  ]
}
