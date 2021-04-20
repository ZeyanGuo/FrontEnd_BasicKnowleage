# 非I/O的异步API

## setTimeout()

setTimeout不会调用I/O线程池，而是使用定时器观察者内部的红黑树。

## setInterval()

setInterval不会调用I/O线程池，而是使用定时器观察者内部的红黑树，其区别于setTimeout是会重复性的检测和执行。

## setTimeout() & setInterval()定时器的区别

定时器并不精确，如果一个任务执行时间长，那么可能会导致定时器任务执行延后。

## process.nextTick()

区别于定时器：setTimeout(fn, 0)
1. 事件循环自身特点，定时器的精确度不够
2. 定时器需要使用红黑树，创建定时器对象和迭代等操作，而setTimeout(fn, 0)的方式会造成性能浪费。
3. nextTick的方法相对较为轻量

nextTick方法会将毁掉函数放入队列中，在下一轮Tick时取出执行。定时器中采用红黑树的操作时间复杂度为O(lg(n))，nextTick()的时间复杂度为O(1)。相较之下，process.nextTick()更高效。

## setImmediate()

setImmediate()方法与process.nextTick()方法十分类似，都是将回调延迟执行。但是其依旧存在细微的差别：
1. nextTick与setImmediate区别在于nextTick的执行先于setImmediate
2. process.nextTick()属于idle观察者
3. setImmediate()属于check观察者
4. process.nextTick在每轮循环中会将数组中的回调函数全部执行完，而setImmediate()在每轮循环中执行链表中的一个回调函数。

idle观察者先于I/O观察者，I/O观察者先于check观察者。

在底层上process.nextTick()的回调函数保存在一个数组中，setImmediate()的结果则是保存在链表中。


## 观察者优先级

idle观察者 > I/O观察者 > check观察者

idle观察者：process.nextTick
I/O观察者：一般性的I/O回调，如网络、文件、数据库I/O等
check观察者：setImmediate、setTimout

