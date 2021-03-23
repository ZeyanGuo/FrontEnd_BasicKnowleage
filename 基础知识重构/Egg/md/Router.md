# 路由（Router）

框架约定`app/router.js`文件用于统一所有路由规则。**统一的目的是为了后续方便查看和管理Router**

# 简单的Router

```javascript
// app/router.js中定义的简单路由
module.exports = app => {
  const { router, controller } = app;
  router.get('/usr/:id', controller.user.info);
}

// app/controller中定义的controller方法
class UserController extends Controller{
  //当使用user/:id时，会调用controller的info方法
  async info(){
    const { ctx } = this;
    ctx.body = {
      name: `hello ${ctx.params.id}`
    }
  }
}
```

# 完整的路由定义
Router除了上述简单的定义之外，还具备以下其他参数

```javascript
router.verb('path-match', app.controller.action);
router.verb('router-name', 'path-match', app.controller.action);
router.verb('path-match', middleware1, ..., middlewareN, app.controller.action);
router.verb('router-name', 'path-match', middleware1, ..., middlewareN, app.controller.action);
```

- verb - 用户触发动作，支持get、post等所有HTTP方法
  |方法属性|HTTP方法|
  |---|---|
  |router.head|HEAD|
  |router.get|GET|
  |router.post|POST|
  |...|...|
- router-name: router的别名，可通过`Helper`提供的辅助函数`pathFor`和`urlFor`来生成URL
- path-match: 路由URL路径
- middleware 1-N: 在路由中可以配置多个middleware
- controller: 指定路由映射到的具体`controller`上，`controller`有两种写法
  - `app.controller.user.fetch` - 指定一个具体的`controller`
  - `user.fetch` - 可以简写为字符串形式

# 注意事项
> - 在Router定义上，可以支持多个`Middleware`串联
> - Controller必须定义在`app/controller`目录中
> - 一个文件里面也可以包含多个Controller定义，在定义路由的时候，可以通过`${fileName}.${functionName}`的方式指定对应的Controller
> - Controller支持子目录，在定义路由的时候，可以通过`${directoryName}.${fileName}.${functionName}`的方式制定对应的Controller

# RESTful风格的URL定义

egg提供了`app.router.resources('routerName', 'patchMatch', controller)`通过`RESETful`的方式来定义符合RESTful的`CRUD`路由结构

详情请参考[官方文档](https://eggjs.org/zh-cn/basics/router.html)

# Router正则表达式

```javascript
// app/router.js
module.exports = app => {
  app.router.get(/^\/package\/([\w-.]+\/[\w-.]+)$/, app.controller.package.detail);
};

// app/controller/package.js
exports.detail = async ctx => {
  // 如果请求 URL 被正则匹配， 可以按照捕获分组的顺序，从 ctx.params 中获取。
  // 按照下面的用户请求，`ctx.params[0]` 的 内容就是 `egg/1.0.0`
  ctx.body = `package:${ctx.params[0]}`;
};
```

# 重定向

- 内部重定向
```javascript
module.exports = app => {
  app.router.get('index', '/home/index', app.controller.home.index);
  app.router.redirect('/', '/home/index', 302);
};
```
- 外部重定向
```javascript
exports.index = async ctx => {
  const type = ctx.query.type;
  const q = ctx.query.q || 'nodejs';

  if (type === 'bing') {
    ctx.redirect(`http://cn.bing.com/search?q=${q}`);
  } else {
    ctx.redirect(`https://www.google.co.kr/search?q=${q}`);
  }
};
```

# 路由拆分
路由可以以如下的方式进行拆分
```javascript
// app/router.js
module.exports = app => {
  require('./router/news')(app);
  require('./router/admin')(app);
};

// app/router/news.js
module.exports = app => {
  app.router.get('/news/list', app.controller.news.list);
  app.router.get('/news/detail', app.controller.news.detail);
};

// app/router/admin.js
module.exports = app => {
  app.router.get('/admin/user', app.controller.admin.user);
  app.router.get('/admin/log', app.controller.admin.log);
};
```