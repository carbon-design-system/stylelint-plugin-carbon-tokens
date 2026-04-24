import stylelint from 'stylelint';

const result = await stylelint.lint({
  code: '.test { color: red; }',
  config: {
    plugins: ['./dist/index.js'],
    rules: {
      'carbon/theme-use': [true, { acceptValues: ['red'] }],
    },
  },
});

console.log('Errored:', result.errored);
console.log('Results:', JSON.stringify(result.results, null, 2));
