# Poetree - elegant tree functions

Poetree is a collection of utilities functions to work with trees.

It works in Node.js and the web environments. The package is OSS and licensed under the [MIT license](https://github.com/adaltas/node-poetree/blob/master/LICENSE.md).

```bash
npm i poetree
```

## Documentation

### Function `tree(documents, options)`

The `tree` function organize a flat array of documents into a document hierarchy.

- `options.property (string)`  
  The document property which stores the path used to organize the document hierarchy.

- `options.relative (string, default to property)`  
  Same as `property` but common path is discovered and strip-out from the relative path.

## Contributors

The project is sponsored by [Adaltas](https://www.adaltas.com) based in Paris, France. Adaltas offers support and consulting on distributed systems, big data and open source.
