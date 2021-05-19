const path = require('path');

const escapedSep = path.sep === '/' ? '\/' : '\\\\';

const allowedNamingPattern = '[a-zA-Z0-9_-]+';

const moduleIdentifyingDirs = ['services', 'resolvers', 'models', 'middlewares', 'sources'];

const resourceIdentifiers = {
  backend: ['decorators', 'dtos', 'entities', 'enums', 'guards', 'interfaces', 'loaders', 'mappers', 'models', 'repositories', 'resolvers', 'services', 'strategies', 'scalars', 'schemas', 'config'],
  frontend: ['components', 'configuration', 'layouts', 'pages', 'shared', 'slices', 'styles', 'utils', 'views'],
  frontendCommon: ['interfaces', 'roq-hooks', 'roq-ui'],
};

module.exports = {
  sep: path.sep,
  escapedSep,
  allowedNamingPattern,
  resourceIdentifiers,
  frontendCommonList: resourceIdentifiers.frontendCommon,
  moduleIdentifyingDirs,
};
