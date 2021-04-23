const { fileContext, executionContext } = require('../../helper');

/* what we want to cover
1) exported enums, components, interfaces should have the file-name prefixed to their name (IN PascalCased)
2) exported enum and interface names should be suffixed with their type(enum or interface)
3) exported constants in slices or actions should have the file-name prefixed to their name (IN camelCased)
*/

function invalidDeclarationError(context, loc, messageId) {
  context.report({
    loc,
    messageId,
  });
}

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Exported enums, components, interfaces should have the file-name prefixed to their name.'
        + ' Enums and interfaces should be suffixed with their type',
      category: 'Stylistic Issues',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/QxZd-correct-export-name-components-layouts-actions',
    },
    messages: {
      invalidExportNamePrefix: 'Exported enums, components, interfaces should be prefixed with file name they are in (PascalCased)',
      invalidExportNamePrefixConstants: 'Exported constants should be prefixed with file name they are in (camelCased)',
      invalidExportNameSuffix: 'Exported enums and interfaces should be suffixed with their type. (Interface/Enum)',
    },
    schema: [],
  },
  create(context) {
    const {
      pathPatterns,
    } = executionContext.get(context);
    const reportingObj = {};
    const { file, parentDir } = fileContext.get(context);
    const { pascalCased, camelCased } = file.resourceName;
    const dirPath = parentDir.absolutePath;

    const isComponent = (new RegExp(pathPatterns.frontend['roq-ui'], 'g')).test(dirPath);
    const isLayout = (new RegExp(pathPatterns.frontend.layouts, 'g')).test(dirPath);
    const isSliceOrAction = (new RegExp(pathPatterns.frontend.slices, 'g')).test(dirPath)
      && (file.nameWithoutExt.endsWith('.slice') || file.nameWithoutExt.endsWith('.action'));
    const isIndexFile = file.name === 'index.ts' || file.name === 'index.tsx';

    const ruleExecutionRequired = (isComponent || isLayout || isSliceOrAction) && !isIndexFile;
    if (ruleExecutionRequired) {
      reportingObj.ExportNamedDeclaration = (node) => {
        if (node.declaration && (node.declaration.id || node.declaration.declarations[0].id)) {
          switch (node.declaration.type) {
            case 'TSEnumDeclaration': {
              const { name, loc } = node.declaration.id;

              const enumExportCorrectPrefix = name.startsWith(pascalCased);
              const enumExportCorrectSuffix = name.endsWith('Enum');

              if (!enumExportCorrectPrefix) {
                invalidDeclarationError(context, loc, 'invalidExportNamePrefix');
              }
              if (!enumExportCorrectSuffix) {
                invalidDeclarationError(context, loc, 'invalidExportNameSuffix');
              }
              break;
            }
            case 'TSInterfaceDeclaration': {
              const { name, loc } = node.declaration.id;

              const interfaceExportCorrectPrefix = name.startsWith(pascalCased);
              const interfaceExportCorrectSuffix = name.endsWith('Interface');

              if (!interfaceExportCorrectPrefix) {
                invalidDeclarationError(context, loc, 'invalidExportNamePrefix');
              }
              if (!interfaceExportCorrectSuffix) {
                invalidDeclarationError(context, loc, 'invalidExportNameSuffix');
              }
              break;
            }
            case 'VariableDeclaration': {
              if (
                node.declaration.declarations[0].init.type !== 'Literal'
                && node.declaration.declarations[0].init.type !== 'MemberExpression'
                && !node.declaration.declarations[0].init.returnType
              ) {
                const { name, loc } = node.declaration.declarations[0].id;

                const variableExportCorrectPrefix = name.startsWith(isSliceOrAction ? camelCased : pascalCased);
                if (!variableExportCorrectPrefix) {
                  invalidDeclarationError(context, loc, isSliceOrAction ? 'invalidExportNamePrefixConstants' : 'invalidExportNamePrefix');
                }
              } break;
            }
            default:
              break;
          }
        }
      };
    }
    return reportingObj;
  },
};
