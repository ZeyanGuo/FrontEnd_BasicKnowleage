export let foo = 1;
console.log('b')
setTimeout(() => {
  foo = 2;
}, 500);