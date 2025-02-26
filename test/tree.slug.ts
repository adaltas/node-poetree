import "should";
import { tree } from "../src/tree.js";

describe("tree option `slug`", function () {
  it("slug as string[]", function () {
    tree(
      [
        { slug: ["a"], title: "a" },
        { slug: ["b"], title: "b" },
        { slug: ["b", "c"], title: "c" },
      ],
      { slug: "slug" },
    ).should.match([
      { title: "a", slug: ["a"], children: [] },
      {
        title: "b",
        slug: ["b"],
        children: [
          {
            title: "c",
            slug: ["b", "c"],
            children: [],
          },
        ],
      },
    ]);
  });

  it("slug as number[]", function () {
    const pages = [
      { slug: [1], title: "a" },
      { slug: [2], title: "b" },
      { slug: [2, 3], title: "c" },
    ];
    tree(pages, { slug: "slug" }).should.match([
      { title: "a", slug: [1], children: [] },
      {
        title: "b",
        slug: [2],
        children: [
          {
            title: "c",
            slug: [2, 3],
            children: [],
          },
        ],
      },
    ]);
  });

  it("with multiple parent directories", function () {
    const pages = [
      { slug: ["a"] },
      { slug: ["b"] },
      { slug: ["b", "a"] },
      { slug: ["b", "b"] },
      { slug: ["a", "a"] },
      { slug: ["a", "b"] },
    ];
    tree(pages, { slug: "slug" }).should.match([
      {
        slug: ["a"],
        children: [
          {
            slug: ["a", "a"],
            children: [],
          },
          {
            slug: ["a", "b"],
            children: [],
          },
        ],
      },
      {
        slug: ["b"],
        children: [
          {
            slug: ["b", "a"],
            children: [],
          },
          {
            slug: ["b", "b"],
            children: [],
          },
        ],
      },
    ]);
  });
});
