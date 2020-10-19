# Koa学习笔记

### 参考

[Koa中文网](https://www.koajs.com.cn/)
[廖雪峰Koa](https://www.liaoxuefeng.com/wiki/1022910821149312/1099752344192192)

## 使用
安装
```shell
npm i koa
```
引入
```
//导入Koa对象
const Koa = require("koa");
//实例化Koa对象
const app = new Koa();
```

### app.use
 * 1.调用app.use()的顺序决定了中间件的顺序
 * 2.使用await next()调用下一个中间件
 * 3.没有调用await next()则结束后续中间件的执行
 * 4.返回this，即可使用链式顺序app.use().use()...
```js
 app.use(async (ctx, next) => {
  await next(); //调用下一个async函数，即先运行处理链下一个中间件
});
```

### router
```
//导入router函数
const koaRouter = require("koa-router");
//可直接写作：const router = require("koa-router")();
const router = koaRouter();
```
使用
- 可以get，post等方法
- get方法加`:props`传递参数
```js
router.get('/story/:name',async(ctx,next)=>{
    let name = ctx.params.name;
    ctx.response.body = `Hello ${name}`;
})

router.get('/',async(ctx,next)=>{
    ctx.response.body = `Hello Sbition`;
})
```

### listem
监听端口`app.listen(3000)`，只是语法糖：
```js
const http = require('http')
http.createServer(app.callback()).listen(3000);
```
因此也可以单独监听https
```js
const https = require('https')
https.createServer(app.callback()).listen(3000);
```

 
