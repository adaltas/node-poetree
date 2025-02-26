import "should";
import { sort } from "../src/sort.js";

describe("sort option `slug`", function () {
  it("slug as string[]", function () {
    sort(
      [
        { slug: ["path", "b_dir", "article_3"] },
        { slug: ["path", "a_dir", "article_5"] },
        { slug: ["path", "a_dir", "article_4"] },
        { slug: ["path", "a_dir"] },
        { slug: [] },
        { slug: ["path", "a_dir", "article_2"] },
      ],
      { slug: "slug" },
    )
      .map((document) => ({
        slug: document.slug,
      }))
      .should.eql([
        { slug: [] },
        { slug: ["path", "a_dir"] },
        { slug: ["path", "a_dir", "article_2"] },
        { slug: ["path", "a_dir", "article_4"] },
        { slug: ["path", "a_dir", "article_5"] },
        { slug: ["path", "b_dir", "article_3"] },
      ]);
  });

  it("slug as number[]", function () {
    sort(
      [
        { slug: [2, 4, 4] },
        { slug: [2, 2, 8] },
        { slug: [2, 2, 6] },
        { slug: [2, 2] },
        { slug: [] },
        { slug: [2, 2, 2] },
      ],
      { slug: "slug" },
    )
      .map((document) => ({
        slug: document.slug,
      }))
      .should.eql([
        { slug: [] },
        { slug: [2, 2] },
        { slug: [2, 2, 2] },
        { slug: [2, 2, 6] },
        { slug: [2, 2, 8] },
        { slug: [2, 4, 4] },
      ]);
  });

  it("slug as (string|number)[]", function () {
    sort(
      [
        { slug: ["a", 4, 4] },
        { slug: [2, "a", 8] },
        { slug: ["a", 2, 6] },
        { slug: ["a", "c", 6] },
        { slug: [2, "b"] },
        { slug: [] },
        { slug: [2, "b", 2] },
      ],
      { slug: "slug" },
    ).should.eql([
      { slug: [] },
      { slug: [2, "a", 8] },
      { slug: [2, "b"] },
      { slug: [2, "b", 2] },
      { slug: ["a", 2, 6] },
      { slug: ["a", 4, 4] },
      { slug: ["a", "c", 6] },
    ]);
  });
});
