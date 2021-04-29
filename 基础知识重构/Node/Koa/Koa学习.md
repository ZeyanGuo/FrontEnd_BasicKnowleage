# Koa 学习

Koa会以洋葱模型的方式进行级联，请求到达之后会执行`async`语法中`next`之上的内容，然后会执行`next`之后的内容。参考如下示例

```javascript
app.use(async (ctx, next)=>{ // 洋葱第一层
    await next();
    const rt = ctx.response.get('X-Response-Time');
    console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});

app.use(async (ctx, next)=>{ // 洋葱第二层
    const start = Date.now(); //先执行
    await next();
    const time = Date.now() - start; //回调后执行
    console.log(`time - ${time}`);
});

app.use(async (ctx, next) => { // 洋葱第三层
    ctx.body = "Hello World";
});

app.listen(3000) // 监听3000端口
```

以上`async`语法的内容都是中间件，而koa支持两种中间件声明方式

- async 函数
- 普通函数

async方法
```javascript
app.use(async (ctx, next)=>{
    const start = Date.now();
    await next();
    const time = Date.now() - start;
    console.log(`time - ${time}`);
})
```

普通方法
```javascript
app.use(async (ctx, next)=>{
    const start = Date.now();
    next().then(()=>{
        const time = Date.now() - start;
        console.log(`time - ${time}`);
    })
})
```

## 

## Koa配置

app上的属性，目前支持如下：
 - app.env：默认是NODE_ENV或`development`
 - app.keys：签名的cookie密钥数据
 - app.proxy：当真正代理的字段将被信任时
 - app.proxyInHeader：代理ip消息头，
 - app.maxIpCount：代理ip消息头最大ips

## koa对象支持的方法

1. app.listen()：用于监听指定端口下的信息，创建并返回HTTP服务器
代码结构如下：
```javascript
const Koa = require('koa');
const app = new Koa();
app.listen(3000);
```

