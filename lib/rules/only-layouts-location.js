const fs = require('fs');
const path = require('path');
const { fileContext, executionContext } = require('../../helper');
const { escapedSep } = require('../../constants');

const dirsChecked = [];

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'This location should contain layout',
      category: 'Best Practices',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/A6wK-only-layouts-location',
    },
    messages: {
      missingLayoutFile: 'Missing {{ layoutFileName }} in {{ dirPath }}.',
    },
    schema: [], // no options
  },
  create(context) {
    const {
      pathPatterns,
    } = executionContext.get(context);
    const { file, parentDir } = fileContext.get(context);
    const layoutDirPattern = [pathPatterns.frontend.layouts, '\\w+'].join(escapedSep);
    const isLayout = (new RegExp(`${layoutDirPattern}$`, 'g')).test(parentDir.absolutePath);
    const dirPath = path.dirname(file.absolutePath);
    const layoutFileName = `${path.basename(dirPath)}.layout.tsx`;

    if (isLayout && file.name !== 'index.ts') {
      return {
        Program(node) {
          if (!dirsChecked.includes(dirPath)) {
            const filesInDir = fs.readdirSync(dirPath);

            if (!filesInDir.includes(layoutFileName)) {
              context.report({
                node,
                messageId: 'missingLayoutFile',
                data: {
                  layoutFileName,
                  dirPath,
                },
              });
            }
            dirsChecked.push(dirPath);
          }
          if (file.name === layoutFileName) {
            for (const item of node.body) {
              if (item.declaration && item.declaration.declarations && item.type === 'ExportNamedDeclaration') {
                if (!item.declaration.declarations[0].id.name.toLowerCase().includes('layout')) {
                  const declarationLocation = item.declaration.declarations[0].id.loc;
                  context.report({
                    loc: declarationLocation,
                    message: 'This file should export only layout',
                  });
                }
              }
            }
          }
        },
      };
    }

    return {};
  },
};
