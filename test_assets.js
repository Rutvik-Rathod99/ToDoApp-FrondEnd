const fs = require('fs');
let aj = JSON.parse(fs.readFileSync('angular.json', 'utf8'));
aj.projects['angular-todo-app'].architect.build.options.assets = [
  {
    "glob": "**/*",
    "input": "public",
    "output": "/"
  },
  {
    "glob": "**/*",
    "input": "src/assets",
    "output": "/assets"
  }
];
fs.writeFileSync('angular.json', JSON.stringify(aj, null, 2));
