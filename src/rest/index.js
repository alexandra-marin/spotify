import fs from 'fs';
import path from 'path';

const exportRecursively = (dir) => fs.readdirSync(dir).forEach(file => {
  if (file === 'index.js') {
    return;
  }
  const filePath = path.join(dir, file);
  if (fs.lstatSync(filePath).isDirectory()) {
    exportRecursively(filePath);
    return;
  }
  module.exports[filePath] = require(filePath).default;
});

exportRecursively(__dirname);