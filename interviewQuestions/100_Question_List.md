# React/Vue项目中为什么要在列表中使用Key，其作用是什么？
	Key在项目中的作用是唯一标识VNode，从而尽可能地实现children的复用。
	这里涉及vue/React的核心内容Diff算法：
	Diff算法现在有三种算法
	1. React使用的标准Diff
	2. Vue2.0使用的双端比较Diff
	3. Vue3.0参考inferno实现的Diff
	而只有具有key时才会调用Diff，如果没有Key，则会尽可能地复用children（就地复用）直接调用patchNode更新节点内容。
	
	就地复用的副作用：
	1. 不会产生过渡效果
	2. 节点有状态则会导致状态出错
	
# ['1', '2', '3'].map(parseInt) 输出是什么？为什么？
	输出是[1, NAN, NAN], 因为map函数的callback是：function(currentValue[, index[, array]]){}，
	parseInt的参数是：parseInt(string, radix)。参数一是被处理的值，参数二是解析时的基数。
	
	因此上述代码结果就是：
	parseInt('1', 0): 1
	parseInt('2', 1): NAN
	parseInt('3', 2): NAN
	
# 什么是防抖，什么是节流？有什么区别？如何实现？
	防抖：高频事件后n秒内只执行一次，如果能秒内高频事件再次触发，则重新计算时间。
	节流：高频事件触发，n秒内只执行一次
	
	实现：
	1. 防抖
	```javascript
	function debounce(event, time){
		let timer = null;
		
		return function(){
			clearTimeout(timer);
			timer = setTimeout(function(){
				event();
			}, time);
		}
	};
	```
	2. 节流
	```javascript
	function throttle(event, time){
		let timer = null;
		
		return function(){
			if(!timer){
				timer = setTimeout(function(){
					timer = null;
					event();
				},time)
			}
		}
	}
	```
	
# Set, Map, WeakMap, WeakSet的区别：
	Set与Map的区别：Set用于存储类数组数据，且Set中数据不能重复，Map用于存储Key-Value类型数据。
	WeakXXX与Set和Map的区别：WeakXXX存储的数据随时可能被清除掉，且WeakXXX没有遍历方法。
	
# 广度优先遍历和深度优先遍历，如何实现？
	广度优先遍历：在访问了v之后依次访问v的各个未曾访问过的邻接点，然后分别从这些邻接点出发依次访问它们的邻接点，并使得“先被访问的顶点的邻接点先于后被访问的顶点的邻接点被访问，直至图中所有已被访问的顶点的邻接点都被访问到。
	```
	function traverse(nodes){
		stack = [];
		
		for(let i = 0; i < nodes.length; i++){
			stack.push(nodes[i]);
		}
		for(let i = 0; i < nodes.length; i++){
			if(nodes[i].children){
				stack.concat(traverse(nodes[i].children));
			}
		};
		
		return stack;
	}
	```
	
	深度优先遍历：从某个节点出发，先访问该节点，然后从它的各个未被访问的邻接点出发深度优先搜索遍历图，直至所有与v节点相同的顶点都被访问到，若此时尚有其他顶点未被访问到，则另选一个未被访问的顶点作为起始点，重复上述过程。
	```
	let stack = []
	function traverse(node){
		if(!node) return;
		
		stack.push(node.value)
		for(let i = 0; i < node.children.length; node ++){
			traverse(nodes[i].children);
		}
	}
	```

# 深度优先和广度优先，实现拷贝函数？ //TODO

# ES5/ES6的继承除了写法外，还有什么区别？
	ES5继承指function，ES6继承指class
	1. class会提升，并且是块进入暂时性死区。
	2. class内部会启用严格模式
	3. class的所有方法都不可枚举
	4. class所有的方法没有原型，不能使用new实例化
	5. 必须使用new class
	6. class内部无法重写类名