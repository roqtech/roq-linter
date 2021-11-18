const { fileContext, executionContext } = require('../../helper');

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Exports should follow conventions',
      category: 'Stylistic Issues',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/ye4L-exports-should-follow-conventions',
    },
    schema: [], // no options
  },
  create(context) {
    const {
      pathPatterns,
    } = executionContext.get(context);
    return {
      ExportNamedDeclaration(node) {
        // Styles Interfaces have a suffix "Classes"
        const hasTypeExport = node.specifiers.some((el) => (el.exported.name.endsWith('Interface') || el.exported.name.endsWith('Classes')));
        if (hasTypeExport) {
          if (node.exportKind !== 'type') {
            context.report({
              loc: node.loc,
              message: 'Interfaces should be exported like "export type {...} from ..."',
            });
          }
        }
      },
      ExportDefaultDeclaration(node) {
        const { file, parentDir } = fileContext.get(context);
        const dirPath = parentDir.absolutePath;
        const isIgnored = [new RegExp(pathPatterns.frontend.pages, 'g')].some((e) => e.test(dirPath)) || file.nameWithoutExt.endsWith('.slice');
        if (!isIgnored) {
          context.report({
            loc: node.loc,
            message: 'Default exports are not allowed anywhere other than frontend slices and pages',
          });
        }
      },
      ExportAllDeclaration(node) {
        context.report({
          loc: node.loc,
          message: 'Wildcard exports are not allowed',
        });
      },
    };
  },
};
