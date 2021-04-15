# Directory names should abide by a common namimg style (no-invalid-dirname)

As a best practice we want that across a project we follow a common directory naming convention/strategy. 

## Rule Details

This rule expects that directory names should abide by a consistent namimg style (default: lowercased alphanumeric strings with dots hyphens and underscores):

## Options

This rule takes one argument, which is an object. The object option has the following properties:

### casing

The `casing` option has four settings:

* `lowerCased` (default) enforces directory names are lowercased.
* `upperCased` enforces directory names are upperCased.
* `camelCased` enforces directory names are camelCased.
* `pascalCased` enforces directory names are pascalCased.

### allowedSeparator

The `allowedSeparator` option has four settings (this is only for dots, hyphens and underscores we don't expect any other special characters in directory names):

* `dot` (default) enforces directory names can only include dots (and not hyphens or underscores) as special characters.
* `hyphen` enforces directory names can only include hyphens (and not dots or underscores) as special characters.
* `underscore` enforces directory names can only include underscores (and not dots or hyphens) as special characters.
* `any` enforces directory names can include either dots, hyphens or underscores as special characters.
* `none` enforces directory names which can include neither of dots, hyphens and underscores as special characters.

### noNumerics

The `noNumerics` option expects a boolean value:

* false (default) enforces directory names cannot include numbers.
* true enforces directory names can include numbers.

Examples of **incorrect** directory name for the `{ "casing": "lowerCased", "allowedSeparator": 'dot', "noNumerics":false  }` option:

```js
/*eslint no-invalid-dirname: "error"*/
decorators-v1
decorators.V1.0.0
```

Examples of **correct** directory name for the `{ "casing": "lowerCased", "allowedSeparator": 'dot', "noNumerics":false  }` option:

```js
/*eslint no-invalid-dirname: "error"*/
decorators
decorators.v1.0.0
```
