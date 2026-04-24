import stylelint from 'stylelint';

const result = await stylelint.lint({
  code: '.test { margin: 16px; }',
  config: {
    plugins: ['./dist/index.js'],
    rules: {
      'carbon/layout-use': true,
    },
  },
});

console.log('Errored:', result.errored);
console.log('Warnings:', result.results[0]?.warnings);
console.log('Output:', result.output);
