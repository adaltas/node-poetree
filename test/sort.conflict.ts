import should from "should";
import { sort } from "../src/index.js";

describe("sort option `conflig`", function () {
  it("detect collision with string", function () {
    should(() => {
      sort(
        [
          { slug: ["a", "c", "d"] },
          { slug: ["a", "b"] },
          { slug: [] },
          { slug: ["a", "b", "d"] },
          { slug: ["a", "b"] },
        ],
        { slug: "slug", conflict: true },
      );
    }).throw('POETREE_CONFLICT: found conflicting document path `["a","b"]`.');
  });

  it("detect collision with numbers", function () {
    should(() => {
      sort(
        [
          { slug: [2, 4, 4] },
          { slug: [2, 2] },
          { slug: [] },
          { slug: [2, 2, 2] },
          { slug: [2, 2] },
        ],
        { slug: "slug", conflict: true },
      );
    }).throw("POETREE_CONFLICT: found conflicting document path `[2,2]`.");
  });
});
