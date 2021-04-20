# Node开发难点

## 异步处理

Node在处理异常上的约定：

**将异常作为回调函数的第一个实参传回，如果为空值，则表明异步调用没有异常抛出**

在自定义异步方法时，也有遵守以下规则：

1. 必须执行调用者传入的毁掉函数；
2. 正确传递回异常供调用者判断；

## 函数嵌套过深

## 阻塞代码

## 多线程编程

## 异步转同步


# 解决方案

1. 利用事件队列解决雪崩问题

雪崩问题是由于缓存失效，大量服务转向后端数据库，而数据库无法承受如此大的查询请求，从而导致崩溃的问题。

此处是可以通过事件队列来处理雪崩问题。
```javascript
var proxy = new events.EventEmmiter();
var status = "ready";

var select = function(callback){
  proxy.once("selected", callback); // 通过once绑定回调函数
  if(status === "ready"){
    status = "pending"; //保证SQL只会执行一次
    db.select("SQL", function(results){
      proxy.emit("selected", results); 
      status = "ready";
    })
  }
}
```

2. 多异步之间的协作方案

3. Promise/Deferred模式

