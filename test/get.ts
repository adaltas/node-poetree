import should from "should";
import { get } from "../src/get.js";

describe("get", function () {
  describe("from array", function () {
    it("root index on empty array", function () {
      const testval = get([], [0, 0]);
      should(testval).eql(undefined);
    });

    it("root index does not exist", function () {
      const test_x = get([[[2]]], [1]);
      should(test_x).be.Undefined();
    });

    it("child index does not exists", function () {
      const test_x = get([[[2]]], [0, 1]);
      should(test_x).be.Undefined();
    });

    it("slug is empty", function () {
      const testobj = get([[[2]]], []);
      testobj[0][0][0].should.eql(2);
    });

    it("slug match intermediate", function () {
      const test_a = get([[[2]]], [0]);
      test_a[0].should.eql([2]);
    });

    it("slug match leaf", function () {
      const test_a_b_c = get([[[2]]], [0, 0, 0]);
      test_a_b_c.should.eql(2);
    });
  });

  describe("from object", function () {
    it("root property on empty object", function () {
      const testval = get({}, ["data", "sort"]);
      should(testval).eql(undefined);
    });

    it("root property does not exist", function () {
      const test_x = get(
        {
          a: {
            b: {
              c: 2,
            },
          },
        },
        ["y"],
      );
      should(test_x).be.Undefined();
    });

    it("child property does not exists", function () {
      const test_a_x = get(
        {
          a: {
            b: {
              c: 2,
            },
          },
        },
        ["a", "y"],
      );
      should(test_a_x).be.Undefined();
    });

    it("slug is empty", function () {
      const testobj = get(
        {
          a: {
            b: {
              c: 2,
            },
          },
        },
        [],
      );
      testobj.a.b.c.should.eql(2);
    });

    it("slug match intermediate", function () {
      const test_a = get(
        {
          a: {
            b: {
              c: 2,
            },
          },
        },
        ["a"],
      );
      test_a.b.should.eql({ c: 2 });
    });

    it("slug match leaf", function () {
      const test_a_b_c = get(
        {
          a: {
            b: {
              c: 2,
            },
          },
        },
        ["a", "b", "c"],
      );
      test_a_b_c.should.eql(2);
    });
  });

  describe("any", function () {
    it("match scallar", function () {
      const testval = get(8, []);
      testval.should.eql(8);
    });
  });

  describe("defaultValue", function () {
    it("unmatch index", function () {
      const testval = get([[[2]]], [0, 1], "ok");
      testval.should.eql("ok");
    });

    it("unmatch key", function () {
      const test_a_x = get(
        {
          a: {
            b: {
              c: 2,
            },
          },
        },
        ["a", "x"],
        "ok",
      );
      test_a_x.should.eql("ok");
    });

    it("root index does not exists", function () {
      const testval = get([], [0, 0], "d");
      testval.should.eql("d");
    });

    it("root property does not exists", function () {
      const testval = get({}, ["data", "sort"], "d");
      testval.should.eql("d");
    });
  });
});
