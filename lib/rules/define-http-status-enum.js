module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'HttpException second parameter must be HttpStatus enum',
      category: 'Stylistic Issues',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/zsr9-define-http-status-enum',
    },
    schema: [],
  },
  create(context) {
    const reportProblem = (node) => {
      if (node.callee && node.callee.name === 'HttpException') {
        const [, arg2] = node.arguments;
        if (!arg2) {
          context.report({
            node,
            message: 'HttpStatus enum is missing in second parameter',
          });
        } else if (arg2.type !== 'MemberExpression'
          || (arg2.type === 'MemberExpression'
            && arg2.object.name !== 'HttpStatus')) {
          context.report({
            node,
            message: 'Second parameter is not HttpStatus enum',
          });
        }
      }
    };
    return {
      'ThrowStatement > NewExpression, ExpressionStatement > NewExpression': reportProblem,
    };
  },
};
