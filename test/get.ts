import should from "should";
import { get } from "../src/get.js";

describe("get", function () {
  describe("from object", function () {
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
});
