const shell = require('shelljs');

const PROJECTS = [
  'core',
  'material',
];

console.log(hasUncommitedFiles());

function hasUncommitedFiles() {
  return !!shell.exec('git status --porcelain', {silent: true}).stdout;
}
