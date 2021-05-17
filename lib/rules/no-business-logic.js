const { fileContext } = require('../../helper');

function directoryCheck(directoryType, context, node) {
  const isUnsuitableDirectory = directoryType === 'dto'
    || directoryType === 'interface'
    || directoryType === 'model'
    || directoryType === 'entity';

  const functionWithDecoratorCheck = directoryType === 'entity'
    && node.parent
    && node.parent.parent
    && node.parent.parent.type === 'FunctionExpression'
    && node.parent.parent.parent.decorators;

  if (!functionWithDecoratorCheck && isUnsuitableDirectory) {
    context.report({
      loc: node.loc,
      message: 'This file must not contain any business logic',
    });
  }
}

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'This file must not contain any business logic',
      category: 'Possible Errors',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/xhvU-no-business-logic',
    },
    schema: [], // no options
  },
  create(context) {
    const { file, parentDir } = fileContext.get(context);
    if (file.extension.includes('ts')) {
      return {
        IfStatement(node) {
          directoryCheck(parentDir.type.camelCased, context, node);
        },
        WhileStatement(node) {
          directoryCheck(parentDir.type.camelCased, context, node);
        },
        DoWhileStatement(node) {
          directoryCheck(parentDir.type.camelCased, context, node);
        },
        ForStatement(node) {
          directoryCheck(parentDir.type.camelCased, context, node);
        },
        ForInStatement(node) {
          directoryCheck(parentDir.type.camelCased, context, node);
        },
        ForOfStatement(node) {
          directoryCheck(parentDir.type.camelCased, context, node);
        },
        SwitchStatement(node) {
          directoryCheck(parentDir.type.camelCased, context, node);
        },
        FunctionDeclaration(node) {
          directoryCheck(parentDir.type.camelCased, context, node);
        },
        Program(node) {
          const { lines } = context.getSourceCode();
          for (const line of lines) {
            if (line.includes('.map')
                || line.includes('.filter')
                || line.includes('.forEach')
                || line.includes('.reduce')
            ) {
              directoryCheck(parentDir.type.camelCased, context, node);
            }
          }
        },
      };
    }
    return {};
  },
};
