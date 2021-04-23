const { fileContext, executionContext } = require('../../helper');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: '"backend/src/{module}/interfaces/{filename}.ts" files should only export an interface',
      category: 'Possible Errors',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/XoHU-only-interface-export',
    },
    schema: [],
  },
  create(context) {
    const {
      pathPatterns,
    } = executionContext.get(context);
    const { file, parentDir } = fileContext.get(context);
    const isInterface = (new RegExp(pathPatterns.backend.interfaces, 'g')).test(parentDir.absolutePath);
    return {
      ExportNamedDeclaration(node) {
        if (isInterface && file.name !== 'index.ts') {
          const { type, loc } = node.declaration;
          if (type !== 'TSInterfaceDeclaration') {
            context.report({
              loc,
              message: 'This file should only export an Interface',
            });
          }
        }
      },
    };
  },
};
