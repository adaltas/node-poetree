import should from "should";
import { sort } from "../src/index.js";

describe("utils.sort", function () {
  describe("option `slug`", function () {
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

  describe("option `sort`", function () {
    it("present in leaf document", function () {
      sort(
        [
          { slug: ["a", 2, 4], sort: 2 },
          { slug: ["a", 2, 2], sort: 3 },
          { slug: [2, "a", 8] },
          { slug: [2, "b", 6], sort: 1 },
          { slug: ["a", 2, 6], sort: 1 },
          { slug: [2, "b", 2], sort: 2 },
          { slug: [2, "b", 4], sort: 3 },
          { slug: [2, "b"] },
        ],
        { slug: "slug", sort: "sort" },
      ).should.eql([
        { slug: [2, "a", 8] },
        { slug: [2, "b"] },
        { slug: [2, "b", 6], sort: 1 },
        { slug: [2, "b", 2], sort: 2 },
        { slug: [2, "b", 4], sort: 3 },
        { slug: ["a", 2, 6], sort: 1 },
        { slug: ["a", 2, 4], sort: 2 },
        { slug: ["a", 2, 2], sort: 3 },
      ]);
    });

    it("present in intermediate documents", function () {
      sort(
        [
          { slug: ["a", "c", "d"] },
          { slug: ["a", "c"], sort: "a" },
          { slug: ["a", "d", "d"] },
          { slug: ["a", "d"], sort: 1 },
          { slug: ["a", "b", "d"] },
          { slug: ["a", "b"], sort: 3 },
        ],
        { slug: "slug", sort: "sort" },
      ).should.eql([
        { slug: ["a", "d"], sort: 1 },
        { slug: ["a", "d", "d"] },
        { slug: ["a", "b"], sort: 3 },
        { slug: ["a", "b", "d"] },
        { slug: ["a", "c"], sort: "a" },
        { slug: ["a", "c", "d"] },
      ]);
    });

    it("present in root documents", function () {
      sort(
        [
          { slug: ["b", "d"] },
          { slug: ["b"], sort: "a" },
          { slug: ["c", "d"] },
          { slug: ["c"], sort: 1 },
          { slug: ["a", "d"] },
          { slug: ["a"], sort: 3 },
        ],
        { slug: "slug", sort: "sort" },
      ).should.eql([
        { slug: ["c"], sort: 1 },
        { slug: ["c", "d"] },
        { slug: ["a"], sort: 3 },
        { slug: ["a", "d"] },
        { slug: ["b"], sort: "a" },
        { slug: ["b", "d"] },
      ]);
    });

    it("defined as an array", function () {
      sort(
        [
          { slug: ["b", "d"] },
          { slug: ["b"], data: { sort: "a" } },
          { slug: ["c", "d"] },
          { slug: ["c"], data: { sort: 1 } },
          { slug: ["a", "d"] },
          { slug: ["a"], data: { sort: 3 } },
        ],
        { slug: "slug", sort: ["data", "sort"] },
      ).should.eql([
        { slug: ["c"], data: { sort: 1 } },
        { slug: ["c", "d"] },
        { slug: ["a"], data: { sort: 3 } },
        { slug: ["a", "d"] },
        { slug: ["b"], data: { sort: "a" } },
        { slug: ["b", "d"] },
      ]);
    });
  });

  describe("option `conflict`", function () {
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
      }).throw(
        'POETREE_CONFLICT: found conflicting document path `["a","b"]`.',
      );
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
});
