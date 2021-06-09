module.exports = {
  root: true,
  extends: ['standard', 'prettier'],
  globals: {
    IS_DEVELOPMENT: 'readonly',
  },
  parserOptions: {
    ecmasVersion: 2020,
    node: true,
  },
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': ['error', { singleQuote: true, parser: 'flow' }],
  },
};
