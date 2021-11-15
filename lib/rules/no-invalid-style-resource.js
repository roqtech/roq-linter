const {
  sep,
} = require('../../constants');
const { fileContext, executionContext } = require('../../helper');

/* what we want to cover
1) filename should match the name of the parent directory.
2) exported function name should match the fileName when prefixed with "use" and suffixed with Styles
3) For Interfaces:
  a) Use interface over type
  b) the interface should match the fileName when suffixed with "Classes"
*/
module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Styles for components/partials should follow all the defined conventions',
      category: 'Stylistic Issues',
      url: '', // to do add link to documentation
    },
    messages: {
      invalidFileName: 'Styles filename should match the directory name. Expected {{expectedFileName}}',
      invalidExportedHookName: 'Exported constant name should match file name, prefixed with "use" and suffixed with "Styles". Expected {{resourceName}}',
      disallowedType: 'Use an Interface named {{resourceName}} instead of type',
      invalidInterfaceName: 'Interface name should match file name, suffixed with "Classes". Expected {{resourceName}}',
    },
    schema: [],
  },
  create(context) {
    const {
      resourceRegex,
    } = executionContext.get(context);
    const reportingObj = {};
    const { file, parentDir } = fileContext.get(context);
    const dirPath = parentDir.absolutePath;
    const topLevelParentNodes = ['Program', 'ExportNamedDeclaration'];

    const isComponent = resourceRegex.component.some((e) => e.test(dirPath));

    const isPartial = resourceRegex.partial.some((e) => e.test(dirPath));

    const isStylesFile = (isComponent || isPartial) && file.nameWithoutExt.endsWith('.styles');
    const ruleExecutionRequired = isStylesFile;
    const rawDirName = dirPath.split(sep).slice(-1)[0];
    const fileNameToMatch = file.resourceName.pascalCased;
    const expectedStylesHookName = `use${fileNameToMatch}Styles`;
    const expectedStylesInterfaceName = `${fileNameToMatch}Classes`;

    if (ruleExecutionRequired) {
      if (file.nameWithoutExt.split('.')[0] !== rawDirName) {
        reportingObj.Program = (node) => {
          context.report({
            node,
            messageId: 'invalidFileName',
            data: {
              expectedFileName: `${rawDirName}.styles.ts`,
            },
          });
        };
      }
      reportingObj.ExportNamedDeclaration = (node) => {
        if (node.declaration && node.declaration.type === 'VariableDeclaration' && node.declaration.kind === 'const' && node.declaration.declarations
          && node.declaration.declarations[0]
          && node.declaration.declarations[0].id.name !== expectedStylesHookName) {
          context.report({
            node,
            messageId: 'invalidExportedHookName',
            data: {
              resourceName: expectedStylesHookName,
            },
          });
        }
      };
      reportingObj.TSInterfaceDeclaration = (node) => {
        if (topLevelParentNodes.includes(node.parent.type)) {
          const interfaceName = node.id.name;
          if (interfaceName !== expectedStylesInterfaceName) {
            context.report({
              node,
              messageId: 'invalidInterfaceName',
              data: {
                resourceName: expectedStylesInterfaceName,
              },
            });
          }
        }
      };
      reportingObj.TSTypeAliasDeclaration = (node) => {
        if (topLevelParentNodes.includes(node.parent.type)) {
          context.report({
            node,
            messageId: 'disallowedType',
            data: {
              resourceName: expectedStylesInterfaceName,
            },
          });
        }
      };
    }
    return reportingObj;
  },
};
