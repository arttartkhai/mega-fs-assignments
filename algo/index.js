const { readFileSync, writeFileSync } = require('fs');
const chalk = require('chalk');
const { solve } = require('./solve');

// Read Input
const wordListInput = readFileSync('./input/word_list.txt', 'utf-8');
const target = readFileSync('./input/target.txt', 'utf-8');

// Transform word_list.txt to array
const wordList = wordListInput?.split(/\n/);

// Solving
const result = solve(wordList, target);

// Write output
writeFileSync('./output/solve_result.txt', result.toString());

// Show result
console.log(
  chalk.cyanBright.bgBlack('The result is  -->  '),
  chalk.green(result)
);
