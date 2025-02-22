import should from "should";
import { tree } from "../src/index.js";

describe("tree", function () {
  it("preserve types", function () {
    interface DocType {
      slug: string[];
      title: string;
    }
    const pages: DocType[] = [
      { slug: ["a"], title: "a" },
      { slug: ["b"], title: "b" },
      { slug: ["b", "c"], title: "c" },
    ];
    const doctree = tree(pages, {
      slug: "slug",
      relative: "slug",
    });
    // title should be undefined or string
    should(doctree[0]?.title === "a").be.true();
  });

  describe("option `slug`", function () {
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

  describe("children", function () {
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

  describe("holes in hierachy", function () {
    it("with root document", function () {
      tree(
        [
          {
            title: "Root document",
            slug: ["root"],
          },
          {
            title: "Parent 1 - child 1",
            slug: ["root", "parent_1", "child_1"],
          },
          {
            title: "Parent 1 - child 2",
            slug: ["root", "parent_1", "child_2"],
          },
          {
            title: "Parent 2 - child 1",
            slug: ["root", "parent_2", "child_1"],
          },
        ],
        { slug: "slug", relative: "slug_relative" },
      ).should.eql([
        {
          title: "Root document",
          slug: ["root"],
          slug_relative: ["root"],
          children: [
            {
              slug: ["root", "parent_1"],
              slug_relative: ["root", "parent_1"],
              children: [
                {
                  title: "Parent 1 - child 1",
                  slug: ["root", "parent_1", "child_1"],
                  slug_relative: ["root", "parent_1", "child_1"],
                  children: [],
                },
                {
                  title: "Parent 1 - child 2",
                  slug: ["root", "parent_1", "child_2"],
                  slug_relative: ["root", "parent_1", "child_2"],
                  children: [],
                },
              ],
            },
            {
              slug: ["root", "parent_2"],
              slug_relative: ["root", "parent_2"],
              children: [
                {
                  title: "Parent 2 - child 1",
                  slug: ["root", "parent_2", "child_1"],
                  slug_relative: ["root", "parent_2", "child_1"],
                  children: [],
                },
              ],
            },
          ],
        },
      ]);
    });

    it("without root document", function () {
      tree(
        [
          {
            title: "Child 1",
            slug: ["root", "parent", "child_1"],
          },
          {
            title: "Child 2",
            slug: ["root", "parent", "child_2"],
          },
          {
            title: "Parent 1 - child 1",
            slug: ["root", "parent", "parent_1", "child_1"],
          },
          {
            title: "Parent 1 - child 2",
            slug: ["root", "parent", "parent_1", "child_2"],
          },
        ],
        { slug: "slug", relative: "slug_relative" },
      ).should.eql([
        {
          title: "Child 1",
          slug: ["root", "parent", "child_1"],
          slug_relative: ["child_1"],
          children: [],
        },
        {
          title: "Child 2",
          slug: ["root", "parent", "child_2"],
          slug_relative: ["child_2"],
          children: [],
        },
        {
          slug: ["root", "parent", "parent_1"],
          slug_relative: ["parent_1"],
          children: [
            {
              title: "Parent 1 - child 1",
              slug: ["root", "parent", "parent_1", "child_1"],
              slug_relative: ["parent_1", "child_1"],
              children: [],
            },
            {
              title: "Parent 1 - child 2",
              slug: ["root", "parent", "parent_1", "child_2"],
              slug_relative: ["parent_1", "child_2"],
              children: [],
            },
          ],
        },
      ]);
    });
  });
});
