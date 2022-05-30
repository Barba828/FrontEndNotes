挂载$mount

指把虚拟Dom（template）转化成真实Dom，并在界面中显示出来


### 新增Vue实例
```js
const { createApp } from Vue
createApp({}).mount("#app")
```
createApp
->createRenderer->baseCreateRenderer->createAppAPI->createApp->app->mount

#### createRenderer
(packages\runtime-core\src\renderer.ts)
返回createRender创建函数
#### baseCreateRenderer
返回渲染器实例
```js
  return {
    render,//baseCreateRenderer内声明的一个渲染函数，可以转换vNode虚拟节点，作为createApp参数
    hydrate,
    createApp: createAppAPI(render, hydrate)
  }
```
#### createAppAPI
(packages\runtime-core\src\apiCreateApp.ts)
返回createApp函数的函数
#### createApp
- const app：Vue实例对象，一个JS对象，封装了一些vue实例方法,，如mount，component，mixin（Vue3.0中包括了以前的一些静态方法，如Vue.use()）
- mount()：调用createAppAPI传入的render方法，将vNode渲染到根容器上（即"#app"的模板vNode）

### render函数
渲染函数：将传入vnode转换node，追加到container中
