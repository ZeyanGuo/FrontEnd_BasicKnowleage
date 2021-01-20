"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = void 0;
var foo = 1;
exports.foo = foo;
console.log('b');
setTimeout(function () {
  exports.foo = foo = 2;
}, 500);