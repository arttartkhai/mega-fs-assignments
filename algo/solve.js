const solve = (wordList = [], target = '') => {
  /* Description
   *   - separate target word into 2 fragments, and then find those fragments inside word list
   */

  for (let i = 1; i < target.length; i++) {
    const startWord = target.slice(0, i);
    const endWord = target.slice(i);

    const startWordIndex = wordList.findIndex((word) => word === startWord);
    const endWordIndex = wordList.findIndex((word) => word === endWord);

    if (
      startWordIndex !== -1 &&
      endWordIndex !== -1 &&
      startWordIndex !== endWordIndex
    ) {
      return [wordList[startWordIndex], wordList[endWordIndex]];
    }
  }

  return 'None';
};

module.exports = {
  solve,
};
