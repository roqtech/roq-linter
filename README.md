# roq-linter

So with roq-linter we want to make sure that our code adheres to our coding convention rulebook, the idea is to add automated checks by making a custom-eslint-plugin(roq-linter), to make sure the checks are in place. Obviously we don't aim to check logical workflows that require human involvement with technical expertise. But whatever can be caught before a PR goes under review, needs to be caught to reduce effort on the side of the reviewer and swaps of control between the PR owner/opener/raiser and the reviewer.

### How to configure this plugin to work with your roq project?
So, we expose three different configurations, specific to the type of resources (backend/frontend):

- Common Config (Contains general conventions that are useful for the entire project)
- Backend Config (Contains backend related conventions that are useful for project's directory that contains the code for backend)
- Frontend Config (Contains frontend related conventions that are useful for project's directory that contains the code frontend)

Step 1: Add the roq-linter plugin as a dependency to your project:

> npm install -D roq-linter

Step 2: Add required configurations to eslint configuration file(.eslintrc):

Configure the plugin:
>   plugins: ['roq-linter'],

Extend the desired config:
> extends: ['plugin:roq-linter/backendConfig','plugin:roq-linter/commonConfig'],

Add the settings for this plugin:

The settings expects the following details (the path separator to be used while defining these values should be nix-styled '/'):

- backendBasePath (default:'backend/src') => 'The base relative path (from project's root) of backend related code'

- frontendBasePath (default:'frontend/src') => 'The base relative path (from project's root) of frontend related code'

- backendTestsBasePath (default:'backend/tests') => 'The relative path (from project's root) of backend related tests'

- backendModules (default:["auth", "config", "event", "library", "platform", "user"]) => 'A list of relative paths (from backendBasePath) to backend modules'

```json
"settings": {
    "roq-linter":{
      "backendBasePath": "backend/src",
      "frontendBasePath": "frontend/src",
      "backendTestsBasePath": "backend/tests",
      "backendModules": ["auth", "config", "event", "library", "platform", "user", "nested/sample"]
    }
  }
```

Step 3: Some rules of this plugin need to be manually configured in your eslint configuration file(.eslintrc):

> ### no-invalid-dirname
> The configuration specifies the naming criteria for your directory names, what characters, what case, also do you want to allow numbers. The default configuration is to have lowercased alphanumeric strings with dots and hyphens. 

> ### no-use-deprecated-modules
> The configuration specifies the node modules that your project should not use. This rule helps in instances for modules that are popular amongst devs but have been deprecated. 
> ### no-use-global-module
> The configuration specifies the nestjs modules that are global and hence need not be imported by other modules. 

See our entire documentation here to know all the roq-conventions.

