# 组合式函数支持，以及`this`变更

## 总结

- 通过`setup`函数支持在类中声明组合式函数
	- `setup`函数将在类初始化阶段被执行
- `this`上只有`$props`, `$attrs`, `$slots`和`$emit`属性允许在类初始化阶段使用

示例：
```javascript

import { ref, reactive, onMounted } from 'vue'
import { Vue, setup } from 'vue-class-component'

function useCounter(){
	const count = ref(0)
	
	function increment(){
		count.value ++
	}
	
	onMounted(()=>{
		console.log('onMounted')
	})
	
	return {
		count,
		increment
	}
}

export default class Counter extends Vue{
	counter = setup(() => useCounter())
}
```

## setup函数

1. 必须使用`setup`函数包装组合式函数，因为组合式函数需要在类初始化阶段运行，不能立即执行，需要通过`setup`进行延时

2. setup会自动展开`ref`，并且展开只是浅展开

示例：
```javascript
/ The returned value is:
// { 
//    count: { value: 0 },
//    nested: {
//      anotherCount: { value: 1 }
//    }
// }
function useCount() {
  const count = ref(0)
  const anotherCount = ref(1)

  return {
    count,
    nested: {
      anotherCount
    }
  }
}

class Counter extends Vue {
  // counter will be:
  // { 
  //    count: 0, <-- unwrapped
  //    nested: {
  //      anotherCount: { value: 1 }
  //    }
  // }
  // The shallow ref (count) is unwrapped while the nested one (anotherCount) retains
  counter = setup(() => useCount())
}
```

## `this`内建属性

当`slot`方法触发时，只有以下的属性是可用的

- $props
 - 所有的`props`也会被代理到`this`属性上
- $emit
- $attrs
- $slots 

示例：
```
function useCounter(props, emit){
	function increment(){
		emit(`input`, props.count + 1)
	}
	
	return {
		increment
	}
}

export default class App extends Vue {
	counter = setup(()=>{
		return useCounter(this.$props, this.$emit)
	})
}
```

## 替代方案

其他的替代方案是使用`class`和`mixin`

示例：
```
import { ref } from 'vue';
import { setup } from 'vue-class-component'

const Super = setup((props, ctx) => {
	const count = ref(0)
	
	function increment(){
		count.value ++
	}
	
	return {
		count,
		increment
	}
})

export default class App extends Super{}
```

优点
- 可以直接使用`this`上的属性

缺点
- 需要冗余的类型定义