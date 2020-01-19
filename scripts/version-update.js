const shell = require('shelljs');
const PROJECTS = require('./projects');

const DEBUG_MODE = true;

if (!DEBUG_MODE && hasUncommitedFiles()) {
  throw Error('You have some uncommited files');
}

let currentVersion;

for (const project of PROJECTS) {
  shell.cd(`./projects/${project}`);

  currentVersion = shell.exec('npm version prerelease --preid=beta').stdout;

  shell.cd('../../');

  shell.exec(`ng build ${project} --prod`);
}

shell.exec('git add -A');

shell.exec(`git commit -m "Version: ${currentVersion.slice(1)}"`);

function hasUncommitedFiles() {
  return !!shell.exec('git status --porcelain', {silent: true}).stdout;
}
