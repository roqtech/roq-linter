const path = require('path');

const escapedSep = path.sep === '/' ? '\/' : '\\\\';

const allowedNamingPattern = '[a-zA-Z0-9_-]+';

const moduleIdentifyingDirs = ['services', 'resolvers', 'models', 'middlewares', 'sources', 'consoles'];

const resourceIdentifiers = {
  backend: ['decorators', 'dtos', 'entities', 'enums', 'guards', 'interfaces', 'loaders', 'mappers', 'models', 'repositories', 'resolvers', 'services', 'strategies', 'scalars', 'schemas', 'config'],
  frontend: ['configuration', 'layouts', 'modules', 'pages', 'scripts', 'styles', 'views'],
  frontendCommon: ['components', 'errors', 'hooks', 'icons', 'interfaces', 'utils'],
  frontendModule: ['components', 'actions', 'hocs', 'hooks', 'selectors', 'utils', 'interfaces', 'enums', 'schemas', 'types'],
};

const possibleFileExtensions = ['.ts', '.tsx', '.js'];

module.exports = {
  sep: path.sep,
  escapedSep,
  allowedNamingPattern,
  resourceIdentifiers,
  moduleIdentifyingDirs,
  possibleFileExtensions,
};
