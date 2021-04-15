const { fileContext } = require('../../helper');

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'Export should have module decorator',
      category: 'Possible Errors',
      url: 'https://docs.roq.tech/exports-should-module-decorator',
    },
    schema: [],
  },
  create(context) {
    const { file, parentDir } = fileContext.get(context);
    const isModule = (new RegExp(`${parentDir.type.hyphenSeparated}.module.ts$`, 'g')).test(file.name);

    return {
      ClassDeclaration(node) {
        if (isModule) {
          const { decorators = [] } = node;
          if (!decorators.length || decorators.every((decorator) => decorator.expression.callee.name !== 'Module')) {
            context.report({
              node,
              message: 'Export have not module decorator',
            });
          }
        }
      },
    };
  },
};
