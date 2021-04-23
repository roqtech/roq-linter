const { fileContext, executionContext } = require('../../helper');

const reportProblem = (context, loc, messageId) => {
  context.report({
    loc,
    messageId,
  });
};

module.exports = {
  meta: {
    type: 'layout',
    messages: {
      enumCountMismatch: 'The file should export exactly one enum.',
    },
    docs: {
      description: 'Each file should contain only a single enum definition.',
      category: 'Best Practices',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/7BMk-exactly-one-enum-definition',
    },
    schema: [], // no options
  },
  create(context) {
    const {
      pathPatterns,
    } = executionContext.get(context);
    const { file, parentDir } = fileContext.get(context);
    const dirPath = parentDir.absolutePath;
    const isEnum = (new RegExp(`${pathPatterns.backend.enums}$`)).test(dirPath);
    const isIndexFile = file.name === 'index.ts';

    if (isEnum && !isIndexFile) {
      return {
        Program(node) {
          const totalElementsInBody = node.body.length;
          let totalEnumCount = 0;
          for (let ind = 0; ind < totalElementsInBody; ind += 1) {
            const element = node.body[ind];
            if (element.declaration && element.declaration.type === 'TSEnumDeclaration') {
              totalEnumCount += 1;
            }
            if (totalEnumCount > 1) {
              reportProblem(context, element.declaration.loc || node.loc, 'enumCountMismatch');
              break;
            }
          }
          if (totalEnumCount === 0) {
            reportProblem(context, node.loc, 'enumCountMismatch');
          }
        },
      };
    } return {};
  },
};
