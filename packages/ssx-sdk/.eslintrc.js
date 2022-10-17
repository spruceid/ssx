module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'airbnb-base',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: [
    '@typescript-eslint',
  ],
  rules: {
    'object-property-newline': 'error',
    'import/prefer-default-export': 'off',
    'no-promise-executor-return': 'warn',
    'no-unused-vars': ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: false }],
    'no-use-before-define': 'warn',
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
    'max-len': 'warn',
    'max-classes-per-file': 'off',
    'no-plusplus': 'off',
    'no-await-in-loop': 'off',
  },
};
