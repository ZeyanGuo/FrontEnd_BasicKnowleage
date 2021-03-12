# Egg 学习入门笔记

Egg 基于 Koa 进行开发的。

知识点
1. Koa 洋葱模型
2. Koa moddleware的使用方式
   
官方回答：**“Koa是一个非常优秀的框架，然而对于企业级应用来说，它还是比较基础”**

## Egg相较于Koa的提升
1. 扩展性：通过定义`app/extend/{application, context, request, response}.js`快速扩展对象原型
2. 插件：插件的顶层封装，插件可以包含
   - extend: 扩展基础对象的上下文，提供各种工具类、属性。
   - middleware: 增加一个或多个中间件，提供请求的前置、后置处理逻辑。
   - config: 配置各个环境下插件自身的默认配置项

## Egg快速入门

重点：
1. `app/public`默认是静态资源路径，可通过`public/* -> app/public`进行访问
2. egg可以使用模板引擎，读取数据后渲染模板然后返回给用户。此处推荐使用[Nunjucks]()。view视图会被放置在`app/view`中
3. Egg所需要学习的内容主要有：
   - Router: 用于配置URL路由规则
   - Controller：用于解析用户的输入，处理后返回相应的结果
   - View：用于放置模板文件
   - Model：用于放置领域模型
   - Service：用于编写业务逻辑层
   - Extend：用于框架的扩展
   - Middleware：用于编写中间件
   - Config：用于编写配置文件
   - Test：用于单元测试
   - Framework：用于将多个Plugin或配置组装成框架
   - Schedule：用于放置定时任务
   - Plugin：用于配置需要加载的插件
   - Public：用于方式静态资源
   - app.js 和 agent.js用于自定义启动时的初始化工作

问题记录：
1. router是如何生效的，并没有配置router存在位置，是默认加载`app/controller`下的cookie？
2. Cookie安全字符串是什么？

## Egg渐进式开发

两种加载模式`patch`和`package`

- patch
- package

## Egg框架内置对象
基于Koa继承而来的4个对象（Application，Context，Request，Response）以及Egg框架扩展的一些对象（Controller，Service，Helper，Config，Logger）

### Application对象

全局应用对象，一个应用中只会实例化一个，继承自`Koa.Application`，在上面可以挂载一些全局的方法和对象

#### 事件

在框架运行时`Application`对象上会触发一些事件，开发者可以进行监听操作。
- server：该事件一个 `wprker` 进程只会触发一次，在HTTP服务完成启动后，会将HTTP server通过该事件暴露给开发者
- error：运行时有任何异常均会被`onerror`捕获
- request和response：收到请求和响应请求时会触发`request`和`response`

#### 获取方式

`Application`对象几乎可以在编写应用的任何一个地方获取到。

几乎所有被框架`Loader`加载的文件（Controller，Service，Schedule等），都可以export一个函数，这个函数会被Loader调用，并使用app作为参数。

- 在Controller上，使用`this.app`进行访问。
- 在Context上，使用`this.ctx.app`进行访问。
- 在Service上，使用`this.app`进行访问。

### Context对象

Context 是一个请求级别的对象，继承自`koa.Context`。在每一次收到用户请求时，框架会实例化一个Context对象，其封装了用户的请求信息，并提供了许多便捷的方法来获取请求参数或者设置响应信息。框架会将所有`Service`挂载到`Context`实例上，一些插件也会将一些其他的方法和对象挂载到它上面。

#### 获取方式

最常见的Context实例获取方式是在`Middleware`，`Controller`以及`Service`中。

- 在Controller上，使用`this.ctx`进行获取
- 在Middleware上，使用`this.ctx`进行获取
- 在Service上，`Context`将作为第一个参数传递到Service方法上，可以直接通过`ctx`参数获取`Context` 

## Request & Response

Request是一个**请求级别的对象**，继承自[Koa.Request](https://koajs.com/#request)，封装了NodeJs原生的Http Request对象，提供了一系列辅助方法获取HTTP请求常用参数。

Response是一个**请求级别的对象**，继承自[Koa.Response](https://koajs.com/#response)，封装了NodeJs原生的Http Response对象，提供了一系列辅助方法设置HTTP响应。

#### 获取方法

可以在Context的实例上获取到当前请求的Request(`ctx.request`)和Response(`ctx.response`)实例。

> 注意点：Koa会在Context上代理一部分Request和Response上的方法和属性，参见[Koa.Contet](https://koajs.com/#context)

## Controller

框架提供了一个Controller基类，并推荐所有的Controller都继承于该基类实现。这个Controller基类有下列属性：
- ctx - 当前请求的Context实例
- app - 应用的Application实例
- config - 应用的配置
- service - 应用所有的service
- logger - 为当前controller封装的logger对象

通过两种方式来引用Controller基类：
```javascript
//1. 第一种方式
const Controller = require('egg').Controller;
class UserController extends Controller {
  //implement
}
module.exports = UserController;

//2. 从 app 实例上获取
module.exports = app => {
  return class UserController extends app.Controller {
    //implement
  }
}
```

## Service

框架提供了一个`Service`基类，并推荐所有`Service`都继承于该基类实现

Service基类的属性和`Controller`基类属性一致，访问方式也类似
```javascript
const Service = require('egg').Service;

class UserService extends Service{
  // implement
}
module.exports = UserService;

module.exports = app => {
  return class UserService extends app.Service {

  }
}
```

## Helper

Helder用来提供一些使用的Utility函数。

### 获取方式

通过Context的实例上获取到当前请求的Helper(`ctx.helper`)实例

### 自定义helper方法

通过框架扩展的形式来自定义helper方法

```
module.exports ={
  formatUser(user){
    return only(user, ['name', 'phone'])
  }
}
```

## Config

遵循配置与代码分离的原则，将一些需要硬编码的业务配置都放到配置文件中，同时配置文件支持各个不同的运行环境使用不同的配置。


### 获取方式
可以通过`app.config`从Application实例上获取到config对象，也可以在Controller，Service，Helper的实例上通过`this.config`获取到config对象。

## Logger

框架内置了功能强大的日志功能，可以非常方便的打印各种级别的日志到对应的日志文件中，每一个Logger对象都提供了4个级别的方法

- `logger.debug()`
- `logger.info()`
- `logger.warn()`
- `logger.error()`

在框架中提供了多个Logger对象，以下介绍各个Logger对象

- App Logger：通过`app.logger`获取 - 做一些应用级别的日志记录，如记录启动阶段的一些数据信息，记录一些业务上与请求无关的信息，都可以通过App Logger来完成
- App CoreLogger：通过`app.coreLogger`获取 - 一般开发应用时不应该通过CoreLogger打印日志，而框架和插件则需要通过它来打印应用级别日志。用于区别框架和应用的日志信息
- Context Logger：通过`ctx.logger`获取 - 答应的日志前面会带上一些请求相关的信息，通过这些信息可以从日志快速定位请求，并串联一次请求中的所有日志
- Context CoreLogger：通过`ctx.coreLogger`获取，同理依旧是区别框架和基础日志
- Controller Logger & Service Logger：在Controller或Service的`this.logger`上获取到它们，它们的本质就是一个Context Logger，不过在打印日志时候会额外的加上文件路径，方便定位日志的打印位置。

## Subscription

订阅模式，使用Subscription基类来规范化这个模式

通过以下方式引用Subscription基类

```
const Subscription = requrie('egg').Subscription;

class Schedule extends Subscription{
  async subscribe(){
    
  }
}
```