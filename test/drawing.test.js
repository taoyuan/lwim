/* eslint-env node, mocha */
"use strict";

var assert = require('chai').assert;
var sinon = require('sinon');
var lwim = require("../");
var image = new lwim.Bitmap(20, 20, 1);
var FOREGROUND = 10;
var BACKGROUND = 100;

describe("Bitmap Drawing", function () {

  beforeEach(function () {
    image.clear();
    sinon.stub(image, "setPixel");
  });

  afterEach(function () {
    image.setPixel.restore();
  });

  describe("a filled rectangle", function () {
    beforeEach(function () {
      image.drawFilledRect(1, 1, 3, 3, FOREGROUND, BACKGROUND);
    });

    it("sets the rectangle border to the border value", function () {
      assert.ok(image.setPixel.calledWith(1, 1, FOREGROUND));
      assert.ok(image.setPixel.calledWith(2, 1, FOREGROUND));
      assert.ok(image.setPixel.calledWith(3, 1, FOREGROUND));
      assert.ok(image.setPixel.calledWith(1, 2, FOREGROUND));
      assert.ok(image.setPixel.calledWith(3, 2, FOREGROUND));
      assert.ok(image.setPixel.calledWith(1, 3, FOREGROUND));
      assert.ok(image.setPixel.calledWith(2, 3, FOREGROUND));
      assert.ok(image.setPixel.calledWith(3, 3, FOREGROUND));
    });

    it("fills the rectangle with the fill value", function () {
      assert.ok(image.setPixel.calledWith(2, 2, BACKGROUND));
    });
  });

  describe("a gradient rectangle", function () {

    describe("when the number of gradient steps in the rectangle matches its width", function () {
      beforeEach(function () {
        image.drawGradientRect(1, 5, 10, 1, 1, 10);
      });

      it("the first pixel has the start value", function () {
        assert.ok(image.setPixel.calledWith(1, 5, 1));
      });

      it("the last pixel has the end value", function () {
        assert.ok(image.setPixel.calledWith(10, 5, 10));
      });

      it("each intermediate pixel's value is one higher than the last one", function () {
        assert.ok(image.setPixel.calledWith(2, 5, 2));
        assert.ok(image.setPixel.calledWith(3, 5, 3));
        assert.ok(image.setPixel.calledWith(4, 5, 4));
        assert.ok(image.setPixel.calledWith(5, 5, 5));
        assert.ok(image.setPixel.calledWith(6, 5, 6));
        assert.ok(image.setPixel.calledWith(7, 5, 7));
        assert.ok(image.setPixel.calledWith(8, 5, 8));
        assert.ok(image.setPixel.calledWith(9, 5, 9));

      });
    });

    describe("when the number of gradient steps is smaller than its width", function () {
      beforeEach(function () {
        image.drawGradientRect(1, 5, 10, 1, 1, 5);
      });

      it("the first pixel has the start value", function () {
        assert.ok(image.setPixel.calledWith(1, 5, 1));
      });

      it("the last pixel has the end value", function () {
        assert.ok(image.setPixel.calledWith(10, 5, 5));
      });

      it("the intermediate gradient steps are distributed over the intermediate pixels", function () {
        assert.ok(image.setPixel.calledWith(2, 5, 1));
        assert.ok(image.setPixel.calledWith(3, 5, 2));
        assert.ok(image.setPixel.calledWith(4, 5, 2));
        assert.ok(image.setPixel.calledWith(5, 5, 3));
        assert.ok(image.setPixel.calledWith(6, 5, 3));
        assert.ok(image.setPixel.calledWith(7, 5, 4));
        assert.ok(image.setPixel.calledWith(8, 5, 4));
        assert.ok(image.setPixel.calledWith(9, 5, 5));

      });
    });

    describe("when the number of gradient steps is larger than its width", function () {
      beforeEach(function () {
        image.drawGradientRect(1, 5, 10, 1, 1, 15);
      });

      it("the first pixel has the start value", function () {
        assert.ok(image.setPixel.calledWith(1, 5, 1));
      });

      it("the last pixel has the end value", function () {
        assert.ok(image.setPixel.calledWith(10, 5, 15));
      });

      it("some gradient steps are skipped", function () {
        assert.ok(image.setPixel.calledWith(2, 5, 2));
        assert.ok(image.setPixel.calledWith(3, 5, 4));
        assert.ok(image.setPixel.calledWith(4, 5, 5));
        assert.ok(image.setPixel.calledWith(5, 5, 7));
        assert.ok(image.setPixel.calledWith(6, 5, 8));
        assert.ok(image.setPixel.calledWith(7, 5, 10));
        assert.ok(image.setPixel.calledWith(8, 5, 11));
        assert.ok(image.setPixel.calledWith(9, 5, 13));
      });
    });
  });
});
