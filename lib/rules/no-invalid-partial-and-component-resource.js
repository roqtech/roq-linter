const { sep } = require('../../constants');
const { fileContext, executionContext } = require('../../helper');

/* what we want to cover
1) Components and Partials should export a single function component.
*/
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Components and Partials should export a single function component',
      category: 'Best Practices',
      url: '', // to do add link to documentation
    },
    messages: {
      invalidFileName: 'Filename should match the directory name. Expected {{expectedFileName}}',
      missingOrExtraNamedExport: 'Exactly one function should be defined and exported and it should be the react component',
      disallowedClassExport: 'Use function component over class component',
      invalidPropsInterfaceSuffix: 'Component Props Type should have a suffix "Props"',
      disallowedTypePropsTypeDef: 'Component Props TypeDef should be interface instead of type',
      missingPropsTypeDefInFile: 'Component Props should have been defined in the same component file or should be imported from mui lib',
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

    const interfaceAndTypeDeclarationNodes = ['TSInterfaceDeclaration', 'TSTypeAliasDeclaration'];
    const importNames = {
      forwardRef: 'forwardRef', memo: 'memo', FunctionComponent: 'FunctionComponent', ReactElement: 'ReactElement',
    };
    const possiblePropsAvailableInFile = {};
    const muiPackageImportAliases = [];

    function checkForPropsValidity(propsTypeDefiningParam) {
      if (propsTypeDefiningParam) {
        const propName = propsTypeDefiningParam.typeName.name;
        const availablePropsName = Object.keys(possiblePropsAvailableInFile);
        const propNameMatchesAvailablePropName = availablePropsName.includes(propName);
        if (propNameMatchesAvailablePropName) {
          if (Object.prototype.hasOwnProperty.call(possiblePropsAvailableInFile[propName], 'isTsType') && possiblePropsAvailableInFile[propName].isTsType === true) {
            context.report({
              loc: possiblePropsAvailableInFile[propName].loc,
              messageId: 'disallowedTypePropsTypeDef',
            });
            return;
          }
          if (!propName.endsWith('Props')) { // Assumption: This case can not occur for props coming from mui
            context.report({
              loc: possiblePropsAvailableInFile[propName].loc,
              messageId: 'invalidPropsInterfaceSuffix',
            });
          }
        } else if (!muiPackageImportAliases.some((alias) => propName.startsWith(`${alias}.`) && propName.endsWith('Props'))) {
          context.report({
            loc: propsTypeDefiningParam.typeName.loc,
            messageId: 'missingPropsTypeDefInFile',
          });
        }
      }
    }

    const isComponent = resourceRegex.component.some((e) => e.test(dirPath)) && file.nameWithoutExt.endsWith('.component');
    const isPartial = resourceRegex.partial.some((e) => e.test(dirPath)) && file.nameWithoutExt.endsWith('.partial');
    const rawDirName = dirPath.split(sep).slice(-1)[0];

    const ruleExecutionRequired = (isComponent || isPartial);
    if (ruleExecutionRequired) {
      reportingObj.Program = (node) => {
        node.body.forEach((element) => {
          if (element.type === 'ImportDeclaration') {
            if (element.source.value === 'react') {
              for (const key in importNames) {
                if (importNames[key]) {
                  const importDetails = element.specifiers
                    .filter((spec) => spec.imported && (spec.imported.name === importNames[key] || (key === 'FunctionComponent' && spec.imported.name === 'FC')));
                  const defaultOrAllMemberImports = element.specifiers.filter((spec) => spec.type === 'ImportDefaultSpecifier' || spec.type === 'ImportNamespaceSpecifier'); // When importing the DefaultExport or all exported members from react
                  if (importDetails.length > 0) {
                    importNames[key] = importDetails[0].local.name;
                  } else if (defaultOrAllMemberImports.length > 0) {
                    importNames[key] = `${defaultOrAllMemberImports[0].local.name}.${key}`;
                  }
                }
              }
            } else if (element.source.value.startsWith('@mui')) { // we can have multiple imports from various mui components.
              const muiImportedPropsDetails = element.specifiers
                .filter((spec) => spec.imported && spec.imported.name.endsWith('Props'));
              const defaultOrAllMemberImports = element.specifiers.filter((spec) => spec.type === 'ImportDefaultSpecifier' || spec.type === 'ImportNamespaceSpecifier'); // When importing the DefaultExport or all exported members from @mui
              if (muiImportedPropsDetails.length > 0) {
                const { name, loc } = muiImportedPropsDetails[0].local;
                possiblePropsAvailableInFile[name] = { loc };
              } else if (defaultOrAllMemberImports.length > 0) {
                muiPackageImportAliases.push(defaultOrAllMemberImports[0].local.name);
              }
            }
          }
          if (element.parent.type === 'Program' && interfaceAndTypeDeclarationNodes.includes(element.type)) {
            possiblePropsAvailableInFile[element.id.name] = { loc: element.loc, isTsType: element.type === 'TSTypeAliasDeclaration' };
          }
          if (element.type === 'ExportNamedDeclaration' && interfaceAndTypeDeclarationNodes.includes(element.declaration.type)) {
            possiblePropsAvailableInFile[element.declaration.id.name] = { loc: element.declaration.loc, isTsType: element.declaration.type === 'TSTypeAliasDeclaration' };
          }
        });

        const exportedNamedFunction = node.body.filter((e) => e.type === 'ExportNamedDeclaration' && e.exportKind === 'value' && e.declaration.type === 'VariableDeclaration').map((e) => e.declaration).filter((dec) => (dec.declarations && dec.declarations[0] && dec.declarations[0].init && (dec.declarations[0].init.type === 'ArrowFunctionExpression' || dec.declarations[0].init.type === 'CallExpression')));
        const exportedNamedFunctionDetails = [].concat(...exportedNamedFunction.map((de) => de.declarations));
        if (exportedNamedFunction.length !== 1) {
          context.report({
            node,
            messageId: 'missingOrExtraNamedExport',
          });
        } else if (exportedNamedFunctionDetails[0].init) {
          if (exportedNamedFunctionDetails[0].init.type === 'CallExpression') {
            const { name, type } = exportedNamedFunctionDetails[0].init.callee;
            if (type === 'Identifier' && name === importNames.forwardRef && exportedNamedFunctionDetails[0].init.typeParameters && exportedNamedFunctionDetails[0].init.typeParameters.params) { // If forwardRef has typeParameters
              /* eslint-disable-next-line no-unused-vars */
              const [_, propsTypeDefiningParam] = exportedNamedFunctionDetails[0].init.typeParameters.params;
              checkForPropsValidity(propsTypeDefiningParam);
            } else if (type === 'Identifier' && name === importNames.memo && exportedNamedFunctionDetails[0].init.arguments && exportedNamedFunctionDetails[0].init.arguments[0] && exportedNamedFunctionDetails[0].init.arguments[0].params[0] && exportedNamedFunctionDetails[0].init.arguments[0].params[0].typeAnnotation) { // If "memo" has typeParameters
              const propsTypeDefiningParam = exportedNamedFunctionDetails[0].init.arguments[0]
                .params[0].typeAnnotation.typeAnnotation;
              checkForPropsValidity(propsTypeDefiningParam);
            }
          } else if (exportedNamedFunctionDetails[0].id && exportedNamedFunctionDetails[0].id.typeAnnotation
            && exportedNamedFunctionDetails[0].id.typeAnnotation.typeAnnotation
            && exportedNamedFunctionDetails[0].id.typeAnnotation.typeAnnotation.typeName
            && (exportedNamedFunctionDetails[0].id.typeAnnotation.typeAnnotation.typeName.name
            === importNames.FunctionComponent || (exportedNamedFunctionDetails[0].id.typeAnnotation.typeAnnotation.typeName.type === 'TSQualifiedName' && `${exportedNamedFunctionDetails[0].id.typeAnnotation.typeAnnotation.typeName.left.name}.${exportedNamedFunctionDetails[0].id.typeAnnotation.typeAnnotation.typeName.right.name}` === importNames.FunctionComponent))
            && exportedNamedFunctionDetails[0].id.typeAnnotation.typeAnnotation.typeParameters) { // FunctionComponent
            const [propsTypeDefiningParam] = exportedNamedFunctionDetails[0].id.typeAnnotation.typeAnnotation
              .typeParameters.params;
            checkForPropsValidity(propsTypeDefiningParam);
          } else if (exportedNamedFunctionDetails[0].init.type === 'ArrowFunctionExpression' && exportedNamedFunctionDetails[0].init.returnType && exportedNamedFunctionDetails[0].init.returnType.typeAnnotation
          && (exportedNamedFunctionDetails[0].init.returnType.typeAnnotation.typeName.name === importNames.ReactElement || (exportedNamedFunctionDetails[0].init.returnType.typeAnnotation.typeName.type === 'TSQualifiedName' && `${exportedNamedFunctionDetails[0].init.returnType.typeAnnotation.typeName.left.name}.${exportedNamedFunctionDetails[0].init.returnType.typeAnnotation.typeName.right.name}` === importNames.ReactElement))
          && exportedNamedFunctionDetails[0].init.params && exportedNamedFunctionDetails[0].init.params[0]
          && exportedNamedFunctionDetails[0].init.params[0].typeAnnotation
          ) { // ReactElement
            const propsTypeDefiningParam = exportedNamedFunctionDetails[0].init.params[0].typeAnnotation.typeAnnotation;
            checkForPropsValidity(propsTypeDefiningParam);
          }
        }
        if (file.nameWithoutExt.split('.')[0] !== rawDirName) {
          context.report({
            node,
            messageId: 'invalidFileName',
            data: {
              expectedFileName: `${rawDirName}${isComponent ? '.component' : 'partial'}.tsx`,
            },
          });
        }
      };
      reportingObj['ExportNamedDeclaration ClassDeclaration'] = (node) => {
        context.report({
          node,
          messageId: 'disallowedClassExport',
        });
      };
    }
    return reportingObj;
  },
};
