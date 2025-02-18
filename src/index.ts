import { mutate } from "mixme";

const getIndexInTree = <T extends string, U extends string>(
  tree: PoetreeBranch<PoetreeDocument<T, U>, T, U>[],
  property: T,
  el: string | number,
) => {
  for (let i = 0; i < tree.length; i++) {
    const doc = tree[i];
    if (doc[property][doc[property].length - 1] === el) return i;
  }
};

type PoetreeDocument<T extends string, U extends string> = {
  [P in T]: (string | number)[];
} & {
  [Q in U]?: (string | number)[];
};

type PoetreeBranch<
  V extends PoetreeDocument<T, U>,
  T extends string,
  U extends string,
> = {
  children: PoetreeBranch<V, T, U>[];
} & {
  [key in T | U]: (string | number)[];
} & Partial<Omit<V, T | U>>;

/**
 * Organize document as a tree using slug and slug_relative attribute and
 * placing child documents inside a children attribute.
 */
const tree = function <
  V extends PoetreeDocument<T, U>,
  T extends string,
  U extends string = T,
>(
  documents: V[],
  options: {
    property: T;
    property_relative?: U;
  },
): PoetreeBranch<V, T, U>[] {
  const property = options.property;
  const relative = options.property_relative || property;
  const tree: PoetreeBranch<V, T, U>[] = [];
  let rootInit = false;
  let root: (string | number)[] = [];
  documents
    // Find shared trunk
    .map((document) => {
      if (!rootInit) {
        root = document[property].slice(0, document[property].length - 1);
        rootInit = true;
      }
      for (let i = 0; i < root.length; i++) {
        if (root[i] !== document[property][i]) {
          root = root.slice(0, i);
        }
      }
      return document;
    })
    // Strip slug from root
    .map((document) => {
      return {
        ...document,
        [relative]: document[property].slice(
          root.length,
          document[property].length,
        ),
      };
    })
    // Insert each document into the tree
    .map((document) => {
      let ltree = tree;
      for (let i = 0; i < document[relative].length; i++) {
        let treeIndex = getIndexInTree(ltree, property, document[relative][i]);
        // Document not yet inside the tree
        if (treeIndex === undefined) {
          treeIndex = ltree.length;
          const propertyValue: (string | number)[] = [
            ...root,
            ...document[relative].slice(0, i + 1),
          ];
          const propertyRelativeValue: (string | number)[] = document[
            relative
          ].slice(0, i + 1);
          const newBranch = {
            [property]: propertyValue,
            [relative]: propertyRelativeValue,
            children: [] as PoetreeBranch<V, T, U>[],
          } as PoetreeBranch<V, T, U>;
          ltree.push(newBranch); // as PoetreeBranch<V, T, U>
        }
        // Document
        if (i == document[relative].length - 1) {
          mutate(ltree[treeIndex], document);
        } else {
          // Parent
          ltree = ltree[treeIndex].children;
        }
      }
    });
  return tree;
};

export { tree };
