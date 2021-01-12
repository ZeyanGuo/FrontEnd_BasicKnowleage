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
~~~javascript
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
~~~

# 深度优先和广度优先，实现拷贝函数？ //TODO

# ES5/ES6的继承除了写法外，还有什么区别？
```javascript
ES5继承指function，ES6继承指class
1. class会提升，并且是块进入暂时性死区。
2. class内部会启用严格模式
3. class的所有方法都不可枚举
4. class所有的方法没有原型，不能使用new实例化
5. 必须使用new class
6. class内部无法重写类名
```
# Async/Await如何通过同步的方式实现异步
从Interator，Generator的角度分析Async/Await，要记住Async/Await是Promise + Generator语法糖。

# JS异步解决方案发展历程以及优缺点：
最开始处理异步的方案是回调函数，回调函数如果遇见回调函数内部接着执行回调的情况，很容易出现回调地狱。
Promise，用于异步解决的方案，其存在三种状态Pending，Resolved，Rejected，当异步正常执行完成后，就会触发resolved，然后调用then中的函数，完成异步处理。如果执行异常，调用rejected就会执行catch方法。
Promise能够很好的处理回调地狱问题，但是如果前后异步请求存在依赖，那么难以避免的会造成多层异步嵌套。
Async/Await，其实Generator + Promise的语法糖，能够以await的方式移交执行线程，实现类似同步的方式执行异步方法

# Promise 构造函数是同步执行还是异步执行，那么 then 方法呢？
Promise方法内部是同步方式执行，then方法是以微任务方式异步执行。

# 如何实现一个new？
```javascript
function _new(fn, ...arg){
    const obj = Object.create(fn.prototype);
    const ret = fn.apply(obj, arg);
    return ret instanceof Object ? ret : obj;
}
// 创建一个空的javaScript对象
// 链接该对象到另一个对象
// 将步骤1新创建的对象作为this的上下文
// 如果该函数没有返回对象，则返回this
```

# 简单讲解一下http2的多路复用
多路复用是为了解决线头阻塞问题，即HTTP请求keep-alive复用TCP链接时，需要前一个请求响应后，后一个请求才能开始执行。而HTTP2采用二进制分帧替代传统文本传输，并且每一帧都有唯一标识来记录所属HTTP请求，从而实现HTTP2.0可以同时发送多个请求，避免线头阻塞问题

# 谈谈你对TCP三次握手和四次挥手的理解
TCP三次握手
1. 客户端向服务器发送SYN，请求TCP链接
2. 服务端回复客户端ACK，SYN，表示允许建立TCP链接
3. 客户端回复服务端ACK，TCP链接建立完成
目的：判断客户端和服务端都具备收发能力

四次挥手
1. A发送FIN给B，表示请求终止TCP，关闭报文发送
2. B发送ACK给A，并关闭报文接受
3. B发送FIN给A，表示已经发送完报文，并关闭报文发送
4. A发送ACK给B，表示同意，并关闭报文接收。
5. B收到ACK后完全关闭TCP，A等待2MSL后完全关闭TCP

# A、B机器正常连接后，B机器突然重启，问A此时处于TCP什么状态
如果在TCP超时范围之内，应该时established状态，如果触发某一条件超时，就根据当时的状态机确定TCP所处状态。

# 介绍下 npm 模块安装机制，为什么输入 npm install 就可以自动安装对应的模块？
安装机制：
1. 发出NPM install命令
2. 查询node_module目录之中是否已经存在指定模块
	- 若存在，不再重新安装
	- 若不存在
		- npm向registry查询模块压缩包的网址
		- 下载压缩包，存放在根目录下的.npm目录里
		- 解压压缩包到当前项目的node_module目录

实现原理：
1. 执行preinstall钩子 输入npm install后，首先执行preinstall钩子
2. 确定首层依赖模块 根据package.json中的dependencies和devdependencies确定依赖的npm包
3. 获取模块 通过首层依赖，递归遍历获取依赖树。
4. 模块扁平化  将依赖树中的依赖扁平化存储在node_module中，不同模块可能具有相同的模块依赖，如果出现相同依赖的情况，则判断该两个依赖包是否存在兼容版本，如果存在兼容版本则使用兼容版并放在node_module中。如果不存在兼容版本，则一个版本放置于node_module中，另一个版本保留在依赖树中。
5. 安装模块 更新node_modules中的模块，并触发模块生命周期(preinstall, install, postinstall)
6. 执行工程自身生命周期 执行工程自身的install, postinstall, prepublish, prepare的声明周期钩子

# 有以下 3 个判断数组的方法，请分别介绍它们之间的区别和优劣
 > Object.prototype.toString.call() 、 instanceof 以及 Array.isArray()
Object.prototype.toString -> 可以判断所有基础数据类型，常用于判断浏览器内置对象
instanceOf > 用于判断原型链的constructor是否是指定对象
Array.isArray > ES5提供的标准方法，用于判断是否是Array

区别：
1. Array.isArray() 与 instanceOf：Array.isArray更加强大，甚至可以判断iframe内部Array
2. Array.isArray() 与 Object.prototype.toString，后者兼容性更好

# 介绍一下回流与重绘，以及如何进行优化
回流：元素的几何属性发生变化，从而导致页面布局发生改变，进而引起浏览器重绘
重绘：元素的状态属性变化，不影响布局，只重绘当前元素

# 观察者模式与发布订阅者模式的区别？
观察者模式中主题和观察者是互相感知的，发布订阅模式是借助三方来实现调度的，发布者和订阅者之间互不感知

class EventCtrl{
	fire(event){
	
	}
	subscribe(event){
	
	}
	publish(event){
	
	}
	remove(){
	
	}
}

class Subscriber{
	subscribe(){
	
	}
}

class Publisher{
	publish(){
	
	}
}

# 聊聊 Redux 和 Vuex 的设计思想？
Redux与Vuex都是全局状态管理工具，Vuex更新状态过程：dispatch(action)[异步操作] -> commit(mutation)[更新state] -> State更新

# 关于 const 和 let 声明的变量不在 window 上，那到底在哪里？如何去获取？
const,let声明的变量处于块级作用域内，其自然可以在块级作用域内获取。

# cookie 和 token 都存放在 header 中，为什么不会劫持 token？
1、首先token不是防止XSS的，而是为了防止CSRF的；
2、CSRF攻击的原因是浏览器会自动带上cookie，而浏览器不会自动带上token

