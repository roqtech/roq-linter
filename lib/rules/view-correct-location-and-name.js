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
        + ' Exported function component name should match the view file mame ',
      category: 'Best Practices',
      url: 'https://docs.roq.tech/view-correct-location-and-name',
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

    return {
      Program(node) {
        if (isView && !isInViewFolder) {
          context.report({
            node,
            message: 'All views should be placed in this location (frontend/src/views/{view-name}/{view-name}.view.tsx)',
          });
        }
      },
      ExportNamedDeclaration(node) {
        if (isView && node.declaration.type === 'VariableDeclaration') {
          const fileNameWithExport = file.name.replace(/[-.]/gi, '').slice(0, -3);
          const { name, loc } = node.declaration.declarations[0].id;

          if (name.toLowerCase() !== fileNameWithExport) {
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
