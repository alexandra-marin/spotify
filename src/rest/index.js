/* eslint-disable import/no-dynamic-require */
/* eslint-disable global-require */
import fs from 'fs';
import path from 'path';

// Register each route in this folder and subfolders
// Traverses alphabetically files starting from the current folder
// and exports all JS modules it finds
const exportRecursively = dir => fs.readdirSync(dir).forEach((file) => {
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
