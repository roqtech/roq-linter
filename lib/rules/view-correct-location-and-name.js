const {
  allowedNamingPattern,
  escapedSep,
} = require('../../constants');
const { fileContext, executionContext } = require('../../helper');

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'All views should be placed in this (frontend/src/views/{view-name}/{view-name}.view.tsx) location.'
        + ' Exported function component name should match the view file mame and should be the only export from the view ',
      category: 'Best Practices',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/ByIC-view-correct-location-and-name',
    },
    schema: [],
  },
  create(context) {
    const {
      pathPatterns,
    } = executionContext.get(context);
    const { file, parentDir } = fileContext.get(context);
    const isView = file.nameWithoutExt.endsWith('.view');
    const isInViewFolder = new RegExp(`${[pathPatterns.frontend.views, allowedNamingPattern].join(escapedSep)}$`, 'g').test(parentDir.absolutePath);
    const isExportedDeclarationAFunction = (item) => item.declaration.declarations[0] && item.declaration.declarations[0].type === 'VariableDeclarator' && item.declaration.declarations[0].init && item.declaration.declarations[0].init.type === 'CallExpression';

    return {
      Program(node) {
        if (isView) {
          if (!isInViewFolder) {
            context.report({
              node,
              message: 'All views should be placed in this location (frontend/src/views/{view-name}/{view-name}.view.tsx)',
            });
          }
        }
      },
      ExportNamedDeclaration(node) {
        if (isView && node.declaration.type === 'VariableDeclaration') {
          const exportedMemberIsAFunction = isExportedDeclarationAFunction(node);
          const { name, loc } = node.declaration.declarations[0].id;
          const fileNameWithExport = file.name.replace(/[-.]/gi, '').slice(0, -3);

          if (!exportedMemberIsAFunction) {
            context.report({
              loc,
              message: 'Views should only have a single export and that should be the function component',
            });
          } else if (name.toLowerCase() !== fileNameWithExport) {
            context.report({
              loc,
              message: 'Exported function component name should match the file name',
            });
          }
        }
      },
    };
  },
};
