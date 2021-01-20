let foo = 1;

setTimeout(() => {
  foo = 2;
  module.exports = {
    foo: foo
  }
}, 500);

module.exports = { // 由于CommonJs是值拷贝，在exports之后，foo的值与上述变化已经不相关了。
  foo: foo
}

// module.exports = { // 如果想要跨module获取foo的变化，则可以考虑将foo改造成函数
//   foo: () => {
//     return foo;
//   }
// }