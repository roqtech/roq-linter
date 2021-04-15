const path = require('path');

const escapedSep = path.sep === '/' ? '\/' : '\\\\';

const allowedNamingPattern = '[a-zA-Z0-9_-]+';

const resourceIdentifiers = {
  backend: ['decorators', 'dtos', 'entities', 'enums', 'guards', 'interfaces', 'loaders', 'mappers', 'models', 'repositories', 'resolvers', 'services', 'strategies', 'scalars', 'schemas'],
  backendModules: ['auth', 'config', 'event', 'library', 'platform', 'user'],
  frontend: ['components', 'configuration', 'layouts', 'pages', 'shared', 'slices', 'styles', 'utils', 'views'],
  frontendCommon: ['interfaces', 'roq-hooks', 'roq-ui'],
};

module.exports = {
  sep: path.sep,
  escapedSep,
  allowedNamingPattern,
  resourceIdentifiers,
  frontendCommonList: resourceIdentifiers.frontendCommon,
};
