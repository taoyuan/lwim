"use strict";

var lwim = require("..");

// Create bitmap
var bitmap = new lwim.Bitmap(400, 300);

// Draw rectangle with border
bitmap.drawFilledRect(10, 10, 100, 50, 0x00, 0xff);
bitmap.drawEllipse(50, 100, 200, 100, 0xff, 0xff);

bitmap.save(__dirname + '/example.bmp');
