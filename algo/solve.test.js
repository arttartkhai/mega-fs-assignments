const { solve } = require('./solve');

describe('solve function when wordList is ["ab", "bc", "cd"]', () => {
  const wordList = ['ab', 'bc', 'cd'];

  it('should return target words', () => {
    const target = 'abcd';
    const expectedOutput = ['ab', 'cd'];

    const result = solve(wordList, target);
    expect(result).toEqual(expectedOutput);
  });
  it('should return target words', () => {
    const target = 'cdab';
    const expectedOutput = ['cd', 'ab'];

    const result = solve(wordList, target);
    expect(result).toEqual(expectedOutput);
  });
  it('should return target words', () => {
    const target = 'abab';
    const expectedOutput = 'None';

    const result = solve(wordList, target);
    expect(result).toEqual(expectedOutput);
  });
});
