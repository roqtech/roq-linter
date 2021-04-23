const { fileContext, executionContext } = require('../../helper');

module.exports = {
  meta: {
    type: 'layout',
    docs: {
      description: 'The name of class should be same as file, in PascalCase.',
      category: 'Stylistic Issues',
      url: 'https://app.archbee.io/public/EpeZApNOPw_vb0lzacxnR/O7gM-name-of-class-and-function-rule',
    },
    schema: [], // no options
  },
  create(context) {
    const {
      pathPatterns,
    } = executionContext.get(context);
    const { file, parentDir } = fileContext.get(context);
    const dirPath = parentDir.absolutePath;

    function reportClass(node, filename) {
      context.report({
        node,
        message: 'The name of class should be same as file, in PascalCase without \'.\' and \'-\'. Class name {{identifier}}, file name {{filename}}.',
        data: {
          identifier: node.id.name,
          filename,
        },
      });
    }

    function reportFunction(node, filename, isMapperFunc) {
      if (isMapperFunc) {
        context.report({
          node,
          message: 'The name of mapper functions should be same as file, in pascalCase without \'.\' and \'-\', prefixed with map and suffixed with ToModel. Function name {{identifier}}, file name {{filename}}.',
          data: {
            identifier: node.id.name,
            filename,
          },
        });
      } else {
        context.report({
          node,
          message: 'The name of functions should be same as file, in camelCase without \'.\' and \'-\'. Function name {{identifier}}, file name {{filename}}.',
          data: {
            identifier: node.id.name,
            filename,
          },
        });
      }
    }

    function getFirstLetterLowerCase(str) {
      return str[0].toLowerCase() + str.substring(1);
    }

    function getFirstLetterUpperCase(str) {
      return str[0].toUpperCase() + str.substring(1);
    }

    function convertName(str) {
      let li = 0;
      let partsCount = 0;
      let namePart = '';
      const result = { camelCased: '', pascalCased: '' };
      while (li < str.length) {
        if (str[li] === '.' || str[li] === '-') {
          result.camelCased += partsCount === 0 ? getFirstLetterLowerCase(namePart) : getFirstLetterUpperCase(namePart);
          result.pascalCased += getFirstLetterUpperCase(namePart);
          namePart = '';
          partsCount += 1;
        } else {
          namePart += str[li];
        }
        li += 1;
      }

      if (namePart.length > 0) {
        result.camelCased += partsCount === 0 ? getFirstLetterLowerCase(namePart) : getFirstLetterUpperCase(namePart);
        result.pascalCased += getFirstLetterUpperCase(namePart);
      }

      return result;
    }

    function checkForClassname(node) {
      if (!file.extension.includes('ts')) {
        return;
      }

      const casedName = convertName(file.nameWithoutExt);

      if (casedName.pascalCased !== node.id.name) {
        reportClass(node, file.nameWithoutExt);
      }
    }

    function checkForFunctionName(node) {
      if (!file.extension.includes('ts')) {
        return;
      }
      const isMapperToModel = new RegExp(`${pathPatterns.backend.mappers}$`).test(dirPath);
      const isIndexFile = file.name === 'index.ts';
      let isMapper = false;
      let { camelCased: expectedName } = convertName(file.nameWithoutExt);
      if (isMapperToModel && !isIndexFile) {
        expectedName = `map${file.resourceName.pascalCased}ToModel`;
        isMapper = true;
      }
      if (expectedName !== node.id.name) {
        reportFunction(node, file.nameWithoutExt, isMapper);
      }
    }

    return {
      ClassDeclaration: checkForClassname,
      'ExportNamedDeclaration FunctionDeclaration': checkForFunctionName,
      'ExportDefaultDeclaration FunctionDeclaration': checkForFunctionName,
    };
  },
};
