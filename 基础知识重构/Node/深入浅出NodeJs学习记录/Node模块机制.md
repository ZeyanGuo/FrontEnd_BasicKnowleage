# Node模块机制

Node的模块分为四个：文件模块、核心模块、内建模块、C/C++扩展模块

文件模块：通常由第三方开发者编写，包括普通 JavaScript模块 和 C/C++扩展模块
核心模块：通常为Node系统中已存在的模块，包括 JavaScript模块 和 C/C++内建模块

# NPM

对于未发布到NPM上的包，可以通过将包下载到本地后进行本地安装，具体参数如下：
```
npm install <tarball file>
npm install <tarball url>
npm install <folder>
```

# 异步I/O

I/O的两种方式：阻塞与非阻塞。在调用阻塞I/O时，应用程序需要等待I/O完成才返回结果。

对于非阻塞I/O，由于无法确定系统内核任务是否已经执行完成，所以需要通过轮询（重复判断是否完成）的方式来确定是否执行完成。

- read：通过重复调用来检查I/O的状态
- select：在read的基础上，通过文件描述符上的事件状态来进行判断
- poll：采用链表的方式避免数组长度的限制，避免不需要的检查
- epoll: Linux下I/O事件通知机制