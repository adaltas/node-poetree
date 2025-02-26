import "should";
import { sort } from "../src/sort.js";

describe("sort option `pre`", function () {
  it("compare different slugs", function () {
    sort(
      [
        { lang: "fr", slug: ["a", "b"] },
        { lang: "en", slug: ["a", "c"] },
      ],
      {
        slug: "slug",
        pre: (a, b) => (a.lang === b.lang ? 0 : a.lang < b.lang ? -1 : 1),
      },
    ).should.eql([
      { lang: "en", slug: ["a", "c"] },
      { lang: "fr", slug: ["a", "b"] },
    ]);
  });

  it("compare same slug", function () {
    sort(
      [
        { lang: "fr", slug: ["a", "b"] },
        { lang: "en", slug: ["a", "b"] },
      ],
      {
        slug: "slug",
        pre: (a, b) => (a.lang === b.lang ? 0 : a.lang < b.lang ? -1 : 1),
      },
    ).should.eql([
      { lang: "en", slug: ["a", "b"] },
      { lang: "fr", slug: ["a", "b"] },
    ]);
  });
});
