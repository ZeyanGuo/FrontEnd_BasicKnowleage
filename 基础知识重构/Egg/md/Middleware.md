# Middleware(中间件)

中间件写法与`Koa`中间件写法一摸一样，如下所示

```javascript
const isJSON = require('koa-is-json');
const zlib = require('zlib');

async function gzip(ctx, next){
  await next();

  let body = ctx.body;
  if(!body) return;
  if(isJSON(body)) body = JSON.stringify(body);

  const stream = zlib.createGzip();
  stream.end(body);
  ctx.body = stream;
  ctx.set(`Content-Encoding`, 'gzip');
}
```

## 配置

中间件一般被放置在`app/middleware`目录下，其`exports`一个普通的`function`，并且接受两个参数：

- options: 中间件的配置项，框架会将`app.config[$(middlewareName)]`传递进来
- app: 当前应用Application的实例

## 在应用中使用中间件

在完成了中间件开发后，只需要进行配置就可以使用中间件，且可以通过配置决定中间件加载顺序

中间件配置在`config.default.js`中进行
```javascript
module.exports ={
  middleware: ['gzip'],
  gzip: {
    threshold: 1024
  }
}
```

## 在框架可插件中使用中间件

在框架和插件中，无法通过配置方式进行匹配中间件，而是通过以下方式：

```javascript
module.exports = app => {
  app.config.coreMiddleware.unshift('report')
}

module.exports = () => {
  return async function(ctx, next){
    const startTime = Data.now();
    await next();

    reportTime(Date.now() - startTime);
  }
}
```

应用层定义的中间件(`app.config.appMiddleware`)和框架默认中间件(`app.config.coreMiddleware`)都会被加载器加载，并挂载到`app.middleware`上

## Router中使用中间件

以上的中间件配置是全局的，如果想只针对路由生效，可以直接在`app/router.js`中实例化和挂载

```javascript
module.exports = app => {
  const gzip = app.middleware.gzip({ threshold: 1024 });
  app.router.get('/needgzip', gzip, app.controller.handler);
}
```

## 框架默认中间件

> 框架和插件加载的中间件会在应用层配置的中间件之前，框架默认中间件不能被应用层中间件覆盖，如果应用层有自定义同名中间件，启动时会报错

## 使用KOA的中间件

以 koa-compress 为例，在 Koa 中使用时：

```javascript
const koa = require('koa');
const compress = require('koa-compress');

const app = koa();

const options = { threhold }
```

我们按照框架的规范来在应用中加载这个 Koa 的中间件：

```
// app/middleware/compress.js
// koa-compress 暴露的接口(`(options) => middleware`)和框架对中间件要求一致
module.exports = require('koa-compress');

// config/config.default.js
module.exports = {
  middleware: [ 'compress' ],
  compress: {
    threshold: 2048,
  },
};
```

如果使用到的 Koa 中间件不符合入参规范，则可以自行处理下：

```
// config/config.default.js
module.exports = {
  webpack: {
    compiler: {},
    others: {},
  },
};

// app/middleware/webpack.js
const webpackMiddleware = require('some-koa-middleware');

module.exports = (options, app) => {
  return webpackMiddleware(options.compiler, options.others);
}
```

## 通用配置

- enable: 控制中间件是否开启
- match：设置只有符合某些规则的请求才会经过这个中间件
- ignore：设置符合某些规则的请求不经过这个中间件

match 和 ignore 支持多种类型的配置方式

1. 字符串：当参数为字符串类型时，配置的是一个 url 的路径前缀，所有以配置的字符串作为前缀的 url 都会匹配上。 当然，你也可以直接使用字符串数组。
2. 正则：当参数为正则时，直接匹配满足正则验证的 url 的路径。
3. 函数：当参数为一个函数时，会将请求上下文传递给这个函数，最终取函数返回的结果（true/false）来判断是否匹配。

```javascript
module.exports = {
  gzip: {
    match(ctx) {
      // 只有 ios 设备才开启
      const reg = /iphone|ipad|ipod/i;
      return reg.test(ctx.get('user-agent'));
    },
  },
};
```