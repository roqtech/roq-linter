const { fileContext } = require('../../helper');

module.exports = {
  meta: {
    type: 'warn',
    docs: {
      description: 'Don\'t import nestJs global modules',
      category: 'Possible Errors',
      url: 'https://docs.roq.tech/no-use-global-modules.js',
    },
    schema: [
      {
        type: 'array',
        items: {
          type: 'string',
        },
      },
    ],
  },
  create(context) {
    const { file, parentDir } = fileContext.get(context);
    const isModule = file.name.endsWith(`${parentDir.type.hyphenSeparated}.module.ts`);
    const globalModuleList = context.options[0] || [];

    return {
      ImportSpecifier(node) {
        if (isModule) {
          if (globalModuleList.find((moduleName) => moduleName === node.imported.name)) {
            context.report({
              loc: node.loc,
              node,
              message: "Don\'t use nestJs global module",
            });
          }
        }
      },
      'ClassDeclaration[decorators]': (node) => {
        let missingGlobalModule = '';
        let problemLoc = null;
        const moduleDefinition = node.decorators.filter((e) => e.expression.callee.name === 'Module');
        const isGlobal = node.decorators.some((e) => e.expression.callee.name === 'Global');
        if (moduleDefinition.length > 0 && isGlobal) {
          if (node.id.name && !globalModuleList.includes(node.id.name)) {
            missingGlobalModule = node.id.name;
            problemLoc = node.loc;
          }
        } else if (moduleDefinition.length > 0 && file.name === 'app.module.ts') { // root module
          if (moduleDefinition[0].expression.arguments[0] && moduleDefinition[0].expression.arguments[0].type === 'ObjectExpression') {
            const imports = moduleDefinition[0].expression.arguments[0].properties.filter((e) => e.type === 'Property' && e.key.name === 'imports' && e.value.type === 'ArrayExpression');
            imports[0].value.elements.filter((elem) => elem.type === 'CallExpression' && elem.arguments[0] && elem.arguments[0].properties).forEach((imp) => {
              if (imp.arguments[0].properties.filter((e) => e.key.name === 'isGlobal' && e.value.value === true).length > 0 && !globalModuleList.includes(imp.callee.object.name)) {
                missingGlobalModule = imp.callee.object.name;
                problemLoc = imp.loc;
              }
            });
          }
        }

        if (problemLoc) {
          context.report({
            loc: problemLoc,
            message: 'Please specify "{{moduleName}}" as a global module while specifying configuration for this rule in .eslintrc file',
            data: {
              moduleName: missingGlobalModule,
            },
          });
        }
      },
    };
  },
};
