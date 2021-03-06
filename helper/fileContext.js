const path = require('path');
const pluralize = require('pluralize');
const { sep } = require('../constants');

const getFormattedNames = (array, isDir = false) => {
  const names = {
    camelCased: '', pascalCased: '', snakeCased: '', dotSeparated: '', hyphenSeparated: '',
  };
  for (let t = 0; t < array.length; t += 1) {
    let part = array[t];
    part = part.toLowerCase();

    if (isDir && t === array.length - 1) { // required for directories
      if (part !== 'data') { // The singular form of data is datum, which looks like a word from an unknown world
        part = pluralize.singular(part);
      }
    }

    if (t === 0) {
      names.camelCased += part.charAt(0).toLowerCase() + part.substring(1);
      names.pascalCased += part.charAt(0).toUpperCase() + part.substring(1);
      names.snakeCased += `${part}`;
      names.dotSeparated += `${part}`;
      names.hyphenSeparated += `${part}`;
    } else {
      names.camelCased += part.charAt(0).toUpperCase() + part.substring(1);
      names.pascalCased += part.charAt(0).toUpperCase() + part.substring(1);
      names.snakeCased += `_${part}`;
      names.dotSeparated += `.${part}`;
      names.hyphenSeparated += `-${part}`;
    }
  }
  return names;
};

const getWordsFromCaseDifferedStrings = (strToProcess) => {
  let str = strToProcess;
  const wordArray = [];
  let word = '';
  str = str.replace(/[-._]\w/g, (match) => match.toUpperCase()).replace(/[-._]/g, '');
  for (let ind = 0; ind < str.length; ind += 1) {
    const char = str.charAt(ind);
    const asciiOfChar = str.charCodeAt(ind);
    if (ind !== 0 && (asciiOfChar >= 65 && asciiOfChar <= 90)) {
      wordArray.push(word);
      word = char.toLowerCase();
    } else {
      word += char;
    }
  }
  if (word) wordArray.push(word);
  if (str.length !== 0 && wordArray.length === 0) {
    wordArray.push(str);
  }
  return wordArray;
};

const get = (context) => {
  let absoluteFilePath = context.getFilename();

  if (sep !== '/' && absoluteFilePath.includes('/')) {
    absoluteFilePath = absoluteFilePath.replace(/\//g, '\\'); // for tests to be cross-platform compliant
  }

  const parentDir = {
    absolutePath: path.resolve(absoluteFilePath, '../'),
    type: {
      camelCased: '', pascalCased: '', snakeCased: '', dotSeparated: '', hyphenSeparated: '',
    },
  };
  const parentDirName = parentDir.absolutePath.split(sep).slice(-1)[0];

  const parentDirNameParts = getWordsFromCaseDifferedStrings(parentDirName);
  parentDir.type = getFormattedNames(parentDirNameParts, true);
  parentDir.rawType = getFormattedNames(parentDirNameParts);
  const file = {
    extension: '',
    name: '',
    nameWithoutExt: '',
    absolutePath: '',
    resourceType: {
      camelCased: '', pascalCased: '', snakeCased: '', dotSeparated: '', hyphenSeparated: '',
    },
    resourceName: {
      camelCased: '', pascalCased: '', snakeCased: '', dotSeparated: '', hyphenSeparated: '',
    },
  };

  const filePathParts = absoluteFilePath.split(sep);
  const fileName = filePathParts[filePathParts.length - 1];
  const fileTypeParts = fileName.split('.');
  const extension = `.${fileTypeParts[fileTypeParts.length - 1]}`;

  const type = fileTypeParts.slice(1, -1);
  const fileNameParts = fileTypeParts[0].split('-');

  file.name = fileName;
  file.extension = extension;
  file.nameWithoutExt = fileName.replace(new RegExp(`${extension}$`), '');
  file.resourceType = getFormattedNames(type);
  file.resourceName = getFormattedNames(fileNameParts);
  file.absolutePath = absoluteFilePath;

  return { parentDir, file };
};

module.exports = {
  get, getWordsFromCaseDifferedStrings, getFormattedNames,
};
