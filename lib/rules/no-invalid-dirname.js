const {
  sep,
} = require('../../constants');

const { fileContext } = require('../../helper');

const dirChecked = [];

module.exports = {
  meta: {
    type: 'layout',
    messages: {
      invalidDirName: 'Invalid directory name "{{dirName}}". {{expectedDescription}}',
    },
    docs: {
      description: 'Directory names should abide by the namimg style defined by the options (default: lowercased alphanumeric strings with dots and hyphens)',
      category: 'Stylistic Issues',
      url: 'https://docs.roq.tech/no-invalid-dirname',
    },
    schema: [
      {
        type: 'object',
        properties: {
          casing: {
            default: 'lowerCased',
            enum: ['lowerCased', 'upperCased', 'camelCased', 'pascalCased'],
          },
          allowedSeparator: {
            default: 'any',
            enum: ['dot', 'hyphen', 'underscore', 'any', 'none'],
          },
          noNumerics: {
            default: false,
            type: 'boolean',
          },
        },
        additionalProperties: false,
      },
    ],
  },
  create(context) {
    const { options: ruleOptions } = context;
    const { parentDir } = fileContext.get(context);
    const dirPath = parentDir.absolutePath;

    if (dirChecked.includes(dirPath)) {
      return {};
    }

    const dirName = dirPath.split(sep).slice(-1)[0];
    let desiredCasing = 'lowerCased';
    let desiredSeparators = 'any';
    let noNumerics = false;
    let allowedNamingPattern = '';

    if (ruleOptions && ruleOptions[0]) {
      desiredCasing = ruleOptions[0].casing || 'lowerCased';
      desiredSeparators = ruleOptions[0].allowedSeparator || 'any';
      noNumerics = ruleOptions[0].noNumerics || false;
    }

    switch (desiredCasing) {
      case 'lowerCased':
        if (desiredSeparators === 'dot') {
          allowedNamingPattern = noNumerics ? '^[a-z.]*$' : '^[a-z0-9.]*$';
        } else if (desiredSeparators === 'hyphen') {
          allowedNamingPattern = noNumerics ? '^[a-z-]*$' : '^[a-z0-9-]*$';
        } else if (desiredSeparators === 'underscore') {
          allowedNamingPattern = noNumerics ? '^[a-z_]*$' : '^[a-z0-9_]*$';
        } else if (desiredSeparators === 'any') {
          allowedNamingPattern = noNumerics ? '^[a-z-._]*$' : '^[a-z0-9-._]*$';
        } else {
          allowedNamingPattern = noNumerics ? '^[a-z]*$' : '^[a-z0-9]*$';
        }
        break;
      case 'upperCased':
        if (desiredSeparators === 'dot') {
          allowedNamingPattern = noNumerics ? '^[A-Z.]*$' : '^[A-Z0-9.]*$';
        } else if (desiredSeparators === 'hyphen') {
          allowedNamingPattern = noNumerics ? '^[A-Z-]*$' : '^[A-Z0-9-]*$';
        } else if (desiredSeparators === 'underscore') {
          allowedNamingPattern = noNumerics ? '^[A-Z_]*$' : '^[A-Z0-9_]*$';
        } else if (desiredSeparators === 'any') {
          allowedNamingPattern = noNumerics ? '^[A-Z-._]*$' : '^[A-Z0-9-._]*$';
        } else {
          allowedNamingPattern = noNumerics ? '^[A-Z]*$' : '^[A-Z0-9]*$';
        }
        break;
      case 'camelCased':
        if (desiredSeparators === 'dot') {
          allowedNamingPattern = noNumerics ? '^[a-z][A-Za-z.]*$' : '^[a-z][A-Za-z0-9.]*$';
        } else if (desiredSeparators === 'hyphen') {
          allowedNamingPattern = noNumerics ? '^[a-z][A-Za-z-]*$' : '^[a-z][A-Za-z0-9-]*$';
        } else if (desiredSeparators === 'underscore') {
          allowedNamingPattern = noNumerics ? '^[a-z][A-Za-z_]*$' : '^[a-z][A-Za-z0-9_]*$';
        } else if (desiredSeparators === 'any') {
          allowedNamingPattern = noNumerics ? '^[a-z][A-Za-z-._]*$' : '^[a-z][A-Za-z0-9-._]*$';
        } else {
          allowedNamingPattern = noNumerics ? '^[a-z][A-Za-z]*$' : '^[a-z][A-Za-z0-9]*$';
        }
        break;
      case 'pascalCased':
        if (desiredSeparators === 'dot') {
          allowedNamingPattern = noNumerics ? '^[A-Z][A-Za-z.]*$' : '^[A-Z][A-Za-z0-9.]*$';
        } else if (desiredSeparators === 'hyphen') {
          allowedNamingPattern = noNumerics ? '^[A-Z][A-Za-z-]*$' : '^[A-Z][A-Za-z0-9-]*$';
        } else if (desiredSeparators === 'underscore') {
          allowedNamingPattern = noNumerics ? '^[A-Z][A-Za-z_]*$' : '^[A-Z][A-Za-z0-9_]*$';
        } else if (desiredSeparators === 'any') {
          allowedNamingPattern = noNumerics ? '^[A-Z][A-Za-z.-_]*$' : '^[A-Z][A-Za-z0-9.-_]*$';
        } else {
          allowedNamingPattern = noNumerics ? '^[A-Z][A-Za-z]*$' : '^[A-Z][A-Za-z0-9]*$';
        }
        break;
      default:
        allowedNamingPattern = noNumerics ? '^[a-z-._]*$' : '^[a-z0-9-._]*$';
        break;
    }

    if (!new RegExp(allowedNamingPattern).test(dirName)) {
      dirChecked.push(dirPath);
      return {
        Program(node) {
          context.report({
            node,
            messageId: 'invalidDirName',
            data: {
              dirName,
              expectedDescription: `It should be a ${desiredCasing} string with${noNumerics ? 'out' : ''} numbers and with${desiredSeparators !== 'none' ? ` ${desiredSeparators}` : 'out'} separator(s)`,
            },
          });
        },
      };
    }

    dirChecked.push(dirPath);
    return {};
  },
};
