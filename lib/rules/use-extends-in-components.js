const { fileContext, executionContext } = require('../../helper');

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'React components should have their interfaces extend (not "&") other components/interfaces',
      category: 'Best Practices',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/QN4y-use-extends-in-components',
    },
    schema: [], // no options
  },
  create(context) {
    const {
      pathPatterns,
    } = executionContext.get(context);
    const { parentDir } = fileContext.get(context);
    const isComponent = (new RegExp(pathPatterns.frontend['roq-ui'], 'g')).test(parentDir.absolutePath);

    return {
      ExportNamedDeclaration(node) {
        if (isComponent && node.declaration && node.declaration.type === 'VariableDeclaration') {
          const { lines } = context.getSourceCode();
          const { loc, name } = node.declaration.declarations[0].id;
          const [lineWithComponentDeclaration] = lines.filter((line) => line.includes(`export const ${name}: FunctionComponent`)
            || line.includes(`export const ${name}:FunctionComponent`));
          if (lineWithComponentDeclaration && lineWithComponentDeclaration.includes('&')) {
            context.report({
              loc,
              message: 'Use "extends" instead of "&"',
            });
          }
        }
      },
    };
  },
};
