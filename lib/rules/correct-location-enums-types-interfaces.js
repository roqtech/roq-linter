const { fileContext, executionContext } = require('../../helper');

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Enums, Types and Interfaces should be placed in the same file with associated component.',
      category: 'Best Practices',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/mR1C-correct-location-enums-types-interfaces',
    },
    schema: [], // no options
  },
  create(context) {
    const {
      pathPatterns,
    } = executionContext.get(context);
    const { file, parentDir } = fileContext.get(context);
    const isCommonComponent = (new RegExp(pathPatterns.frontend['roq-ui'], 'g')).test(parentDir.absolutePath);

    if (file.extension.includes('ts') && isCommonComponent) {
      return {
        Program(node) {
          for (const item of node.body) {
            let isNeededDeclaration;

            if (item.declaration) {
              isNeededDeclaration = item.declaration.type === 'TSEnumDeclaration'
                || item.declaration.type === 'TSInterfaceDeclaration'
                || item.declaration.type === 'TSTypeAliasDeclaration';
            }

            if (isNeededDeclaration) {
              const declarationName = item.declaration.id.name;
              const declarationLocation = item.declaration.id.loc;
              const sourceCodeLines = context.getSourceCode().lines;

              let usageCounter = 0;
              for (const line of sourceCodeLines) {
                if (line.includes(declarationName)) {
                  usageCounter += 1;
                }
              }

              if (usageCounter === 1) {
                context.report({
                  loc: declarationLocation,
                  message: 'Enums, Types and Interfaces should be placed in the same file with associated component',
                });
              }
            }
          }
        },
      };
    }
    return {};
  },
};
