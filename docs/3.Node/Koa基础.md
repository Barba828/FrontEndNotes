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

## 框架

koa2，跟koa1不同，koa1使用的是generator+co.js的执行方式，而koa2中使用了async/await


### koa源码结构

上图是koa2的源码目录结构lib文件夹下放着四个koa2的核心文件：application.js、context.js、request.js、response.js。

#### application.js

application.js是koa的入口文件，它向外导出了创建class实例的构造函数，它继承了events，这样就会赋予框架事件监听和事件触发的能力。application还暴露了一些常用的api，比如toJSON、listen、use等等。

listen的实现原理其实就是对http.createServer进行了一个封装，重点是这个函数中传入的callback，它里面包含了中间件的合并，上下文的处理，对res的特殊处理。

use是收集中间件，将多个中间件放入一个缓存队列中，然后通过koa-compose这个插件进行递归组合调用这一些列的中间件。

#### context.js

这部分就是koa的应用上下文ctx,其实就一个简单的对象暴露，里面的重点在delegate，这个就是代理，这个就是为了开发者方便而设计的，比如我们要访问ctx.repsponse.status但是我们通过delegate，可以直接访问ctx.status访问到它。

#### request.js、response.js

这两部分就是对原生的res、req的一些操作了，大量使用es6的get和set的一些语法，去取headers或者设置headers、还有设置body等等。