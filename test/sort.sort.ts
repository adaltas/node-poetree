import "should";
import { sort } from "../src/sort.js";

describe("sort option `sort`", function () {
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
