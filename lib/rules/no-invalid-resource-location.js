const { sep } = require('../../constants');
const { fileContext, executionContext } = require('../../helper');

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'A few resources like components and partials, should have their own separate directory and each file in this directory (except index) must match the name of this directory',
      category: 'Best Practices',
      url: '', // to do add link to documentation
    },
    schema: [],
  },
  create(context) {
    const {
      resourceRegex,
    } = executionContext.get(context);
    const { file, parentDir } = fileContext.get(context);
    const dirPath = parentDir.absolutePath;
    const rawDirName = dirPath.split(sep).slice(-1)[0];
    const fileHasComponentSuffix = file.nameWithoutExt.endsWith('.component');
    const fileHasPartialSuffix = file.nameWithoutExt.endsWith('.partial');
    const isComponent = resourceRegex.component.some((e) => e.test(dirPath));
    const isPartial = resourceRegex.partial.some((e) => e.test(dirPath));

    return {
      Program(node) {
        if (fileHasComponentSuffix && !isComponent) {
          context.report({
            node,
            message: 'All components and their related styles should be placed in their own directory (.../components/{component-name}/{component-name}.component.tsx)',
          });
        } else if (fileHasPartialSuffix && !isPartial) {
          context.report({
            node,
            message: 'All partials and their related styles should be placed in their own directory (.../partials/{partial-name}/{partial-name}.partial.tsx)',
          });
        } else if ((fileHasPartialSuffix || fileHasComponentSuffix) && file.nameWithoutExt.split('.')[0] !== rawDirName) {
          context.report({
            node,
            message: 'The file-name and the parent directory name should match',
          });
        }
      },
    };
  },
};
