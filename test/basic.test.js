/* eslint-env node, mocha */
"use strict";

var assert = require('chai').assert;
const lwim = require("../");

describe("Bitmap Basic", function () {
  describe("Creation", function () {
    it("creates a Buffer sized to bytes per pixel * columns * rows", function () {
      var image = new lwim.Bitmap(5, 10, 2);

      assert.instanceOf(image.data, Buffer);
      assert.lengthOf(image.data, 5 * 10 * 2);
    });

    it("all pixels are initially zero", function () {
      var image = new lwim.Bitmap(5, 10, 2);
      var data = image.data;
      for (var i = 0; i < data.length; i++) {
        assert.equal(data[i], 0);
      }
    });

    it("throws an exception when called with invalid bytes per pixel", function () {
      const create = function (bytesPerPixel) {
        return new lwim.Bitmap(1, 1, bytesPerPixel);
      };
      assert.throws(create.bind(null, "foo"));
      assert.throws(create.bind(null, 0));
      assert.throws(create.bind(null, 6));
      assert.throws(create.bind(null, 3));
    });
  });

  describe("SetPixel", function () {
    describe("with 1 byte per pixel", function () {
      it("sets the corresponding byte in the data array", function () {
        var image = new lwim.Bitmap(3, 3, 1);
        image.setPixel(0, 0, 255);
        assert.equal(image.data[0], 255);

        image.setPixel(1, 2, 100);
        assert.equal(image.data[7], 100);
      });
    });

    describe("with 2 bytes per pixel", function () {
      it("sets the corresponding bytes in the data array", function () {
        var image = new lwim.Bitmap(3, 3, 2);
        image.setPixel(0, 0, 65535);
        assert.equal(image.data[0], 255);
        assert.equal(image.data[1], 255);

        image.setPixel(1, 2, 65535);
        assert.equal(image.data[14], 255);
        assert.equal(image.data[15], 255);
      });

      describe("endianness", function () {
        it("writes the pixel data in high-low order when set to big endian", function () {
          var image = new lwim.Bitmap(3, 3, 2, lwim.Endianness.BIG);
          image.setPixel(0, 0, 258);
          assert.equal(image.data[0], 1);
          assert.equal(image.data[1], 2);
        });

        it("writes the pixel data in low-high order when set to little endian", function () {
          var image = new lwim.Bitmap(3, 3, 2, lwim.Endianness.LITTLE);
          image.setPixel(0, 0, 258);
          assert.equal(image.data[0], 2);
          assert.equal(image.data[1], 1);
        });
      });
    });
  });

  describe("Clear", function () {
    it("sets all pixel values to 0", function () {
      var image = new lwim.Bitmap(3, 3, 2, lwim.Endianness.LITTLE);
      for (var x = 0; x < 3; ++x) {
        for (var y = 0; y < 3; ++y) {
          image.setPixel(x, y, 65535);
        }
      }

      image.clear();

      var pixels = image.data;
      for (var i = 0; i < pixels.length; ++i) {
        assert.equal(pixels[i], 0);
      }
    });
  });

});
