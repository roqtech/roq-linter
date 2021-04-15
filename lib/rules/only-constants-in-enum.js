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
      nonConstantMembersFound: 'Only constants, no properties or methods are expected',
      onlyEnumDeclarationAllowed: 'Only enum declaration and registration is allowed in this file.',
      unexpectedMethodCall: 'Only "registerEnumType" method call is allowed',
      unexpectedImportStatement: 'Only "registerEnumType" import from @nestjs/graphql allowed',
      missingOrExtraNecessaryComponents: 'This file should have exactly one "registerEnumType" (@nestjs/graphql) method call for the defined enum',
    },
    docs: {
      description: 'These files should only contain enums and EnumMembers must only be defined using constants',
      category: 'Best Practices',
      url: 'https://docs.roq.tech/only-constants-in-enum',
    },
    schema: [], // no options
  },
  create(context) {
    const {
      pathPatterns,
    } = executionContext.get(context);
    const { parentDir, file } = fileContext.get(context);
    const dirPath = parentDir.absolutePath;
    const isEnum = (new RegExp(`${pathPatterns.backend.enums}$`)).test(dirPath);
    const isIndexFile = file.name === 'index.ts';
    let enumRegistrationMethodName = 'registerEnumType';

    /* // What are we planning to do.
    // 1) Each file should not contain anything apart from an enumdeclarartion and its nestjs registration method call.
    // 2) All enum members must be defined using constants.
    */
    if (isEnum && !isIndexFile) {
      return {
        Program(node) {
          const totalElementsInBody = node.body.length;
          let requiredItemsCount = 0;
          for (let ind = 0; ind < totalElementsInBody; ind += 1) {
            const element = node.body[ind];
            if (element.type === 'ImportDeclaration') {
              if (element.source.value === '@nestjs/graphql' && element.specifiers.length === 1 && element.specifiers[0].imported.name === 'registerEnumType') {
                enumRegistrationMethodName = element.specifiers[0].local.name;
                requiredItemsCount += 1;
              } else {
                reportProblem(context, (element.loc || node.loc), 'unexpectedImportStatement');
              }
            } else if (element.type === 'ExpressionStatement') {
              if (element.expression.type === 'CallExpression'
                && element.expression.callee && element.expression.callee.type === 'ArrowFunctionExpression'
                && element.expression.callee.body && element.expression.callee.body.type === 'BlockStatement'
                && element.expression.callee.body.body && element.expression.callee.body.body[0] && element.expression.callee.body.body[0].type === 'ExpressionStatement'
                && element.expression.callee.body.body[0].expression && element.expression.callee.body.body[0].expression.type === 'CallExpression'
                && element.expression.callee.body.body[0].expression.callee && element.expression.callee.body.body[0].expression.callee.type === 'Identifier'
                && element.expression.callee.body.body[0].expression
                  .callee.name === enumRegistrationMethodName) { // for anonymous IIFE calls
                requiredItemsCount += 1;
              } else if (element.expression.type === 'CallExpression'
              && element.expression.callee && element.expression.callee.type === 'Identifier' && element.expression.callee.name === enumRegistrationMethodName) {
                requiredItemsCount += 1;
              } else {
                reportProblem(context, (element.loc || node.loc), 'unexpectedMethodCall');
              }
            } else if (!element.declaration || (element.declaration && element.declaration.type !== 'TSEnumDeclaration')) {
              reportProblem(context, element.declaration ? element.declaration.loc : (element.loc || node.loc), 'onlyEnumDeclarationAllowed');
            }
          }
          if (requiredItemsCount !== 2) {
            reportProblem(context, node.loc, 'missingOrExtraNecessaryComponents');
          }
        },
        ExportNamedDeclaration(node) {
          if (node.declaration.type === 'TSEnumDeclaration') {
            for (let ind = 0; ind < node.declaration.members.length; ind += 1) {
              const member = node.declaration.members[ind];
              if (member.type === 'TSEnumMember' && member.initializer.type !== 'Literal') {
                reportProblem(context, member.loc || node.loc, 'nonConstantMembersFound');
              }
            }
          }
        },
      };
    }
    return {};
  },
};
