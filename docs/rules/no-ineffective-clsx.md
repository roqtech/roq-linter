# Disallow ineffective arguments to clsx library call (no-ineffective-clsx)

It is considered a best practice to avoid adding non useful parameters to clsx call. 

> [Clsx](https://www.npmjs.com/package/clsx) is a utility for constructing className strings conditionally.

As this utility/module is used with css classes, this rule is a frontend specific one.

## Rule Details

This rule is aimed at reporting arguments to clsx calls which have no-effect (i.e. they do not make any impact in determining the output class) for example ''(Empty String) and {}(Empty Object).

Examples of **incorrect** code for this rule:

```js
/*eslint no-ineffective-clsx: "warn"*/
// Sample code contained by any tsx file 
import clsx from 'clsx';
year = clsx('text-body dark:text-offWhite', {});
```

```js
/*eslint no-ineffective-clsx: "warn"*/
// Sample code contained by any tsx file 
import clsx from 'clsx';
let year = clsx('', 'text-body dark:text-offWhite');
```

Examples of **correct** code for this rule:

```js
/*eslint no-ineffective-clsx: "warn"*/
// Sample code contained by any tsx file 
import clsx from 'clsx';
let year = clsx('text-body dark:text-offWhite');
```
