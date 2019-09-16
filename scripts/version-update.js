const shell = require('shelljs');

const PROJECTS = [
  'core',
  'material',
];

if (hasUncommitedFiles()) {
  throw Error('You have some uncommited files');
}
shell.cd('projects');

for (const project of PROJECTS) {
  shell.cd(`projects/${project}`);

  shell.exec('npm version prerelease --preid=beta');

  shell.cd('../../');

  shell.exec(`ng build ${project}`);
}

function hasUncommitedFiles() {
  return !!shell.exec('git status --porcelain', {silent: true}).stdout;
}
