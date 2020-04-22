itShould('reverse strings ...', function reverseSuite(suite) {

  itShould('... with numbers', test => {
    const arg = '321';
    const actual = reverse(arg);
    const expected = '123';
    test.strictEqual(actual, expected);
  },
    { after: r => suite.log(r) });

  itShould('... with letters', function withLetters(test) {
    const arg = 'asdf';
    const actual = reverse(arg);
    const expected = 'fdsa';
    test.strictEqual(actual, expected);
  },
    { after: r => suite.log(r) });

},
  { after: r => renderReport('tests', reverse, r) });
