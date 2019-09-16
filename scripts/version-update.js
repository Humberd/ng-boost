const shell = require('shelljs');

const DEBUG_MODE = true;

const PROJECTS = [
  'core',
  'material',
];

if (!DEBUG_MODE && hasUncommitedFiles()) {
  throw Error('You have some uncommited files');
}

for (const project of PROJECTS) {
  shell.cd(`./projects/${project}`);

  shell.exec('npm version prerelease --preid=beta -m "Version: %s"');

  shell.cd('../../');

  shell.exec(`ng build ${project}`);
}

function hasUncommitedFiles() {
  return !!shell.exec('git status --porcelain', {silent: true}).stdout;
}
