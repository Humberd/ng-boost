const shell = require('shelljs');
const PROJECTS = require('./release.js');

shell.cd('dist');

for (const project of PROJECTS) {
  shell.exec(`npm publish ${project} --access public`)
}
