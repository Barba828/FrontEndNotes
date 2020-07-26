- 完善TodoList组件设计
- - 完善回调方法；
  - 传递参数&双向绑定；
  - 传入事件&回调事件；
  - 插槽&具名插槽；
## 组件
### Props 属性
vue组件实例中最常用的property
```js
Vue.component('my-component', {
  props: {
    // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
    propA: Number,
    // 多个可能的类型
    propB: [String, Number],
    // 必填的字符串
    propC: {
      type: String,
      required: true
    },
    // 带有默认值的数字
    propD: {
      type: Number,
      default: 100
    },
    // 带有默认值的对象
    propE: {
      type: Object,
      // 对象或数组默认值必须从一个工厂函数获取
      default: function () {
        return { message: 'hello' }
      }
    },
    // 自定义验证函数
    propF: {
      validator: function (value) {
        // 这个值必须匹配下列字符串中的一个
        return ['success', 'warning', 'danger'].indexOf(value) !== -1
      }
    }
  }
})
```
#### 组件内修改Prop
- 传入data
- 使用计算属性
- 注：注意在 JavaScript 中对象和数组是通过引用传入的，所以对于一个数组或对象类型的 prop 来说，在子组件中改变变更这个对象或数组本身将会影响到父组件的状态。

#### 无Props的attribute
- 组件可以接受任意的 attribute，而这些 attribute 会被添加到这个组件的根元素上
- 因此Vue template模板语法内只允许存在一个根元素
```vue
<template>
  <div ...attribute></div>
</template>
```
- 如果你不希望组件的根元素继承 attribute，你可以在组件的选项中设置 inheritAttrs: false
- class和style不在inheritAttrs: false生效范围内
```js
Vue.component('my-component', {
  inheritAttrs: false,
  // ...
})
```
#### $attrs
- 组件依然可以接受任意的v-bind attribute，只是不会添加到根元素上
- 该任意的attribute会绑定到 $attrs 位置
- 用于props未知，但已知其生效元素节点
- inheritAttrs: false 可以和 $attrs配合使用
```js
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on:input="$emit('input', $event.target.value)"
      >
    </label>
  `
})
```

### Event 事件

#### 自定义事件

##### vm.$emit( eventName, […args] )
触发事件
自定义事件，常用于组件传值子传父，即回调事件传参
注 ...args 参数除了常用的数值或者对象，还能作为callback回调函数再次父组件向子组件回调参数，例如：

```js
// 子组件回调refresh事件，参数为callback(state)函数
this.$emit('refresh', state => {
    if (state) {
    	this.setState(REFRESHED);	//执行子组件刷新完成方法
    }
});

// 父组件执行refresh事件，刷新完成后回调
myRefresh(callback) {
    axios.get('http://****.json')
		.then( response => {
			callback(true);		//向子组件回调刷新事件完成
        })
},
```

##### vm.$on( event, callback )
监听事件
监听当前实例上的自定义事件，事件可以由 vm.$emit 触发，回调函数会接收所有传入事件触发函数的额外参数。
$on监听函数需要声明在$emit函数之前（例如在`mount()`钩子函数时就声明），否则监听不到

```js
// 这里的msg即为test函数的参数'hi'
vm.$on('test',  msg => {
  console.log(msg)
})

vm.$emit('test', 'hi')
```

#### v-model双向绑定
原理，实际上还是父子单向数据流
- 父组件通过props向子组件传递数据
- 子组件通过$emit回调方法向父组件回调数据
v-model实际上为语法糖，对props参数和$emit方法进行绑定，即 prop + event 实现双向数据流
props传入
event传出
```
model: {
    prop: 'value',
    event: 'change'
}
```

#### $listeners
- 组件依然可以接受任意的attribute，只是不会添加到根元素上
- 与attrs相似...
```js
//这里直接使用 $listeners有什么问题
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on="$listeners"
      >
    </label>
  `
})
```

实际上需要自己定义事件返回，或者保证v-model正常，应该重新修改$listeners对象

```js
Vue.component('base-input', {
  inheritAttrs: false,
  props: ['label', 'value'],
  computed: {
    inputListeners: function () {
      var vm = this
      // `Object.assign` 将所有的对象合并为一个新对象
      return Object.assign({},
        // 我们从父级添加所有的监听器
        this.$listeners,
        // 然后我们添加自定义监听器，
        // 或覆写一些监听器的行为
        {
          // 这里确保组件配合 `v-model` 的工作
          input: function (event) {
            vm.$emit('input', event.target.value)
          }
        }
      )
    }
  },
  template: `
    <label>
      {{ label }}
      <input
        v-bind="$attrs"
        v-bind:value="value"
        v-on="inputListeners"
      >
    </label>
  `
})
```



#### $attrs 和 $listeners 异同

- 都是在组件传递的非明确定义的attribute；
- attrs传递的是v-bind绑定的props； 
- listeners传递的是v-on绑定的event；
- 使用原因都是根元素不支持该prop/event；
- 可直接在子元素某层传入，且attrs和listeners都是作为对象{}传入；
```
// $attrs对象
{
  type:"checkbox",
  required: true,
  placeholder: 'Enter your username'
}
// $listeners对象
{
  focus: function (event) { /* ... */ }
  input: function (value) { /* ... */ },
}
```

### Slot 插槽
子组件定义插槽
```html
<template>
    <a v-bind:href="url" class="nav-link">
      <slot></slot>
    </a>
</template>
```
父组件使用插槽
```html
<my-compoent ...attribute>
	Slot插槽
</my-compoent>
```
- 插槽内可以包含任何模板代码，包括 HTML，以及其他组件
- 父级模板里的所有内容都是在父级作用域中编译的；子模板里的所有内容都是在子作用域中编译的；即上述插槽无法访问到my-compoent的作用域
#### 后备插槽
```html
<a v-bind:href="url" class="nav-link">
   <slot>
   	 <p>点击进入vue学习</p>
   </slot>
</a>
```
- slot不传入任何内容时才会启用后备插槽

#### 具名插槽
例如定义一个卡片布局
子组件定义插槽
```html
<div class="container">
  <header>
    <slot name="header"></slot>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <slot name="footer"></slot>
  </footer>
</div>
```
父组件使用插槽
```html
<base-layout>
  <template v-slot:header>
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template v-slot:footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```
- 注 2.6已废弃语法 slot="name"，建议使用模板语句 v-slot:name
#### 作用域插槽
子组件
```html
  <slot :name="myName" :age="myAge">
  </slot>
```
父组件
```html
<template v-slot:default="slotProps">
	{{slotProps.name}}
</template>
```
- 用于从子组件取值传递到父组件调用，即也算一种另类的父子组件传值
- slotProps名称可随意定义
- 当只有默认插槽时，v-slot:default="slotProps"可简写为v-slot="slotProps"

##### 作用域解构赋值
- es6语法，需要环境支持
```html
//myUser={name,age,gender}
<slot :user="myUser"></slot>
```
父组件

```html
<template v-slot:default="{user}">
	{{user.name}}
</template>
```

#### 动态插槽名
- dynamicSlotName可由父组件控制
```html
<base-layout>
  <template v-slot:[dynamicSlotName]>
    ...
  </template>
</base-layout>
```

#### 插槽缩写
- `v-slot=` 替换为 `#`
- 仅在模板语法里有效，即在template和组件标签上有效
```html
<base-layout>
  <template #header>
    <h1>Here might be a page title</h1>
  </template>

  <p>A paragraph for the main content.</p>
  <p>And another one.</p>

  <template #footer>
    <p>Here's some contact info</p>
  </template>
</base-layout>
```
### 动态组件
- <keep-alive> 包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们
- <keep-alive> 是一个抽象组件：它自身不会渲染一个 DOM 元素，也不会出现在组件的父组件链中
- 当组件在 <keep-alive> 内被切换，它的 activated 和 deactivated 这两个生命周期钩子函数将会被对应执行。
```html
<!-- 基本 -->
<keep-alive>
  <component :is="view"></component>
</keep-alive>

<!-- 多个条件判断的子组件 -->
<keep-alive>
  <comp-a v-if="a > 1"></comp-a>
  <comp-b v-else></comp-b>
</keep-alive>
```
### 异步组件
Vue 允许你以一个工厂函数的方式定义你的组件，这个工厂函数会异步解析你的组件定义。Vue 只有在这个组件需要被渲染的时候才会触发该工厂函数，且会把结果缓存起来供未来重渲染。
```js
Vue.component('async-example', function (resolve, reject) {
  setTimeout(function () {
    // 向 `resolve` 回调传递组件定义
    resolve({
      template: '<div>I am async!</div>'
    })
  }, 1000)
})
```


## Mixins 混入

混入 (mixins)定义了一部分可复用的方法或者计算属性。混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被混入该组件本身的选项。
```js
//VUE对象使用mixins
let vm = new Vue({
    el: '#el',
    mixins: [myMixin],
    props: {
    },
});
```
```js
// 定义一个混入对象
let myMixin = {
  created: function () {
    this.startmixin()
  },
  methods: {
    startmixin: function () {
      document.write('This is myMixin')
    }
  }
}
export default myMixin
```
#### 选项合并
- 同名钩子函数将会被合并，因此都将被调用
- 混入对象的钩子将在组件自身钩子之前调用
- 值为对象的选项，例如 methods、components 和 directives，将被合并为同一个对象
- 两个对象键名冲突时，取组件对象的键值对
- 数据对象在内部会进行浅合并 (一层属性深度)，在和组件的数据发生冲突时以组件数据优先

#### 全局混入
会影响每个单独创建的 Vue 实例 (包括第三方组件)
```js
// 为自定义的选项 'myOption' 注入一个处理器。
Vue.mixin({
  created: function () {
  	console.log("global mixin:created")
  }
})
```

- mixins 混入，复用逻辑，属性
- vuex 状态管理，复用内容，状态

## VueX
### 安装
需要有node环境，node带的包管理工具（npm）进行安装
```shell
npm install vuex -save
or
yarn add vuex
```

### 定义全局Vuex
- state 存放状态
- mutations state成员操作
- getters 加工state成员给外界
- actions 异步操作
- modules 模块化状态管理
```js
const store = new Vuex.store({
	//存放状态
    state:{		
        name:'helloVueX'
    },
    //状态成员操作
    mutations:{		
        edit (state, myName) {
          	state.name = myName
        }
    },
    //异步成员操作
    actions:{
        aEdit(context,payload){
            return new Promise((resolve,reject)=>{
                setTimeout(()=>{
                    context.commit('edit',payload)
                    resolve()
                },2000)
            })
        }
    }
    //处理数据获取方法
    getters:{
        nameInfo(state){
            return "姓名:"+state.name
        },
    }
})
```
```js
//state 取值
this.$store.state.name

//mutations 执行
this.$store.commit('edit',15)

//getters 取值
this.$store.getters.nameInfo

//action 异步执行
this.$store.dispatch('aEdit',{age:15})
```
#### 全局Vuex状态值增删
```js
Vue.set(state,"age",15)
Vue.delete(state,'age')
```

## Axios

#### 安装
```shell
npm install axios --save
or
yarn add axios
```
#### 请求接口
```js
axios.request(config)
axios.get(url[, config])
axios.delete(url[, config])
axios.head(url[, config])
axios.post(url[, data[, config]])
axios.put(url[, data[, config]])
axios.patch(url[, data[, config]])

// 直接在 URL 上添加参数 ID=12345
axios.get('/user?ID=12345')
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
 
// 也可以通过 params 设置参数：
axios.get('/user', {
    params: {
      ID: 12345
    }
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
  
// Post请求直接设置参数
axios.post('/user', {
    firstName: 'Fred',        // 参数 firstName
    lastName: 'Flintstone'    // 参数 lastName
  })
  .then(function (response) {
    console.log(response);
  })
  .catch(function (error) {
    console.log(error);
  });
```
#### 案例
```js
  mounted () {
    axios
      .get('https://api.coindesk.com/v1/bpi/currentprice.json')
      .then(response => {
        this.info = response.data.bpi
        console.log(this.info)
      })
      .catch(error => {
        console.log(error)
        this.errored = true
      })
      .finally(() => (this.loading = false))
  }
```