const stylelint = require('stylelint');

async function test() {
  const result = await stylelint.lint({
    code: '.test { background: linear-gradient(to right, $layer-01, $layer-02); }',
    config: {
      plugins: ['./dist/index.js'],
      rules: {
        'carbon/theme-use': [true, { validateGradients: false }],
      },
    },
  });

  console.log('Errored:', result.errored);
  console.log('Warnings:', result.results[0].warnings.length);
  if (result.results[0].warnings.length > 0) {
    result.results[0].warnings.forEach(w => {
      console.log('\nWarning:', w.text);
      console.log('Line:', w.line, 'Column:', w.column);
    });
  }
}

test().catch(console.error);
