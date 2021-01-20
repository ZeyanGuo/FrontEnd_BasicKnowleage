var b = require('./b');

console.log(b.foo);

setTimeout(() => {
  console.log(b.foo);
  console.log(require('./b').foo);
}, 1000);