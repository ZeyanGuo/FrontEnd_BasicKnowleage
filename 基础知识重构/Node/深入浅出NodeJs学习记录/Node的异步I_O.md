# Node的异步I/O

## 事件循环

首先，Node自身的执行模型——事件循环，每次Tick判断是否有事件需要执行

## 观察者

Node设备通过事件循环的方式来观察线程池中是否存在已经执行完成的I/O，如果已经执行完成则获取对应请求对象，然后执行对应的回调函数

## 请求对象

请求对象是JavaScript文件模块与底层C/C++核心/内建模块的中间件，其存储了JavaScript请求的以下信息：
1. 将要执行的方法的引用
2. 所需执行方法的参数
3. 执行的标志

## I/O线程池

I/O线程池用于管理核心/内建模块的线程执行调度。（其是最底层的线程信息）

## 总结

Node的非阻塞I/O给其带来了巨大优势，从此单线程的Node无需等待I/O执行完成，而可以通过事件循环的方式将但现场与非阻塞I/O关联起来，从而实现高性能的并发处理。