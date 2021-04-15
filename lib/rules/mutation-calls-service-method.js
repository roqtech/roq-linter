const { fileContext, executionContext } = require('../../helper');

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Mutations should call a method of service',
      category: 'Possible Errors',
      url: 'https://docs.roq.tech/mutation-calls-service-method',
    },
    messages: {
      missingServiceImport: 'Resolvers with mutations must import atleast one service',
      missingServiceMethodCall: 'Mutations should call a method of service',
    },
    schema: [],
  },
  create(context) {
    const {
      pathPatterns,
    } = executionContext.get(context);
    const { file, parentDir } = fileContext.get(context);
    const dirPath = parentDir.absolutePath;

    const isResolver = new RegExp(pathPatterns.backend.resolvers).test(dirPath);
    const isIndexFile = file.name === 'index.ts' || file.name === 'index.tsx';
    const methodServiceCallsMapping = {};
    const importedServices = [];
    const serviceTypedClassMembers = [];

    function getMethodName(node) {
      let methodDefinitionNode = node;
      while (methodDefinitionNode.type !== 'MethodDefinition') {
        methodDefinitionNode = methodDefinitionNode.parent;
      }
      return methodDefinitionNode.key.name;
    }
    function markMethodAsComplying(methodName) {
      if (Object.prototype.hasOwnProperty.call(methodServiceCallsMapping, methodName)) {
        methodServiceCallsMapping[methodName] += 1;
      } else {
        methodServiceCallsMapping[methodName] = 1;
      }
    }
    function callExpression(node) {
      const methodName = getMethodName(node);
      if (node.callee.type === 'MemberExpression' && !Object.prototype.hasOwnProperty.call(methodServiceCallsMapping, methodName)) {
        const declarationDetails = node.callee;
        if (
          (declarationDetails.object.object && declarationDetails.object.object.type === 'ThisExpression' && serviceTypedClassMembers.includes(declarationDetails.object.property.name))
          || (declarationDetails.object.type && declarationDetails.object.type === 'Identifier' && importedServices.includes(declarationDetails.object.name))
        ) {
          markMethodAsComplying(methodName);
        }
      }
    }
    function onFunctionExpressionExit(node) {
      const methodName = getMethodName(node);
      if (!Object.prototype.hasOwnProperty.call(methodServiceCallsMapping, methodName)) {
        context.report({
          node,
          messageId: 'missingServiceMethodCall',
        });
      }
    }
    if (isResolver && !isIndexFile) {
      return {
        Program(node) {
          const exportedValueDescription = node.body.filter((e) => e.type === 'ExportNamedDeclaration').map((e) => e.declaration);
          const mutations = exportedValueDescription[0].body.body.filter((e) => e.type === 'MethodDefinition' && e.decorators && e.decorators.some((el) => el.expression.callee.name === 'Mutation'));
          const constructorDetails = exportedValueDescription[0].body.body.filter((e) => e.type === 'MethodDefinition' && e.key.name === 'constructor');

          if (mutations.length !== 0) {
            // check two things
            /* 1) At least one service is imported
               2) The service is called in each mutation
             */
            node.body.forEach((e) => {
              if (e.type === 'ImportDeclaration' && e.source.value.includes('services')) {
                e.specifiers.forEach((el) => importedServices.push(el.local.name));
              }
            });
            if (importedServices.length === 0) {
              context.report({
                node,
                messageId: 'missingServiceImport',
              });
            } else {
              constructorDetails[0].value.params.forEach(
                (param) => {
                  const paramName = param.parameter.name;
                  const paramType = param.parameter.typeAnnotation.typeAnnotation.typeName.name;
                  if (importedServices.includes(paramType)) {
                    serviceTypedClassMembers.push(paramName);
                  }
                },
              );
            }
          }
        },
        'ExportNamedDeclaration MethodDefinition[decorators.0.expression.callee.name="Mutation"] FunctionExpression CallExpression': callExpression,
        'ExportNamedDeclaration MethodDefinition[decorators.0.expression.callee.name="Mutation"] FunctionExpression:exit': onFunctionExpressionExit,
      };
    }
    return {};
  },
};
