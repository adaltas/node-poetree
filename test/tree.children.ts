import { tree } from "../src/index.js";

describe("tree option `children`", function () {
  it("custom value", function () {
    tree(
      [
        { slug: ["a"], title: "a" },
        { slug: ["b"], title: "b" },
        { slug: ["b", "c"], title: "c" },
      ],
      { slug: "slug", children: "documents" },
    ).should.match([
      { title: "a", slug: ["a"], documents: [] },
      {
        title: "b",
        slug: ["b"],
        documents: [
          {
            title: "c",
            slug: ["b", "c"],
            documents: [],
          },
        ],
      },
    ]);
  });
});
