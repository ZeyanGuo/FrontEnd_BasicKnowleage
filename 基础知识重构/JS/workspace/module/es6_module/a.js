console.log('a');
import { foo } from './b';

console.log(foo);

setTimeout(()=>{
  console.log(foo);
  import("./b").then(({ foo })=>{
    console.log(foo)
  })
}, 1000)