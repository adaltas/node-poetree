# Poetree - elegant tree functions

Poetree is a collection of utilities functions to work with trees.

It works in Node.js and the web environments. The package is OSS and licensed under the [MIT license](https://github.com/adaltas/node-poetree/blob/master/LICENSE.md).

```bash
npm i poetree
```

## Documentation

### Function `tree(documents, options)`

The `tree` function organizes a flat array of documents into an ordered document hierarchy.

- `documents (object[], required)`  
  A flatten list of documents to organized into a tree.

- `options.conflict (boolean, optional)`  
  Throw an error if the same slug is found accross multiple documents.

- `options.children (string, required)`  
  The document property which stores the child documents when documents are organized as a tree. The value should not conflict with an existing document property.

- `options.relative (string, default to property)`  
  Same as `property` but common path is discovered and strip-out from the relative path.

- `options.slug (string, required)`  
  The document property which stores the unique path used to identify a document in the tree.

- `options.sort (string, optional)`  
  An optional document property which stores an attribute used for sorting instead of using the slug last element by default.

### Function `sort(documents, options)`

The `sort` function orders a flatten list of documents by slugs and an optional sort property.

- `documents (object[], required)`  
  A flatten list of documents to sort.

- `options.conflict (boolean, optional)`  
  Throw an error if the same slug is found accross multiple documents.

- `options.slug (string, required)`  
  The document property which stores the unique path used to identify a document in the tree.

- `options.sort (string, optional)`  
  An optional document property which stores an attribute used for sorting instead of using the slug last element by default.

## Contributors

The project is sponsored by [Adaltas](https://www.adaltas.com) based in Paris, France. Adaltas offers support and consulting on distributed systems, big data and open source.
