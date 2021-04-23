const { fileContext } = require('../../helper');

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Avoid no-effect clsx calls.',
      category: 'Best Practices',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/YfNM-no-ineffective-clsx',
    },
    messages: {
      unexpectedArgument: 'Empty {{instanceOf}} argument is not expected in clsx calls as they do not have any effect',
    },
    schema: [], // no options
  },
  create(context) {
    const { file } = fileContext.get(context);
    if (file.extension.includes('tsx')) {
      return {
        CallExpression(node) {
          if (node.callee.type === 'Identifier' && node.callee.name === 'clsx') {
            node.arguments.forEach((arg) => {
              if (arg.type === 'ObjectExpression' && arg.properties.length === 0) {
                context.report({ loc: arg.loc, messageId: 'unexpectedArgument', data: { instanceOf: 'object' } });
              } else if (arg.type === 'Literal' && arg.value === '') {
                context.report({ loc: arg.loc, messageId: 'unexpectedArgument', data: { instanceOf: 'string' } });
              }
            });
          }
        },
      };
    }
    return {};
  },
};
