## 如何理解前端模块化

前端模块化就是复杂的文件编程一个一个独立的模块，比如 js 文件等等，分成独立的模块有利于重用（复用性）和维护（版本迭代），这样会引来模块之间相互依赖的问题，所以有了 commonJS 规范，AMD，CMD 规范等等，以及用于 js 打包（编译等处理）的工具 webpack

## 循环引用

两种解决方案:

[阮一峰解释](http://www.ruanyifeng.com/blog/2015/11/circular-dependency.html)

### CommonJS 模块

- 使用 require 语句导入模块，module.exports 导出模块，输出的是`值的拷贝，按需引入，同步执行`
- 对于基本数据类型，属于复制，对于复杂数据类型，属于浅拷贝
- 如何解决循环加载的原理：`循环加载时，属于加载时执行。`即脚本代码在 require 的时候，就会全部执行，然后`在内存中生成该模块的一个说明对象`。当再次执行 require 命令，下次会直接读取缓存。一旦出现某个模块被`"循环加载"`，`就只输出已经执行的部分，还未执行的部分不会输出（解决原理）`

```js
{
    id: '',  //模块名，唯一
    exports: {  //模块输出的各个接口 使用当的时候，会来这里取值
        ...
    },
    loaded: true,  //模块的脚本是否执行完毕
    ...
}
```

执行案例

```js
//a.js
exports.done = false;
var b = require("./b.js");
console.log("在 a.js 之中，b.done = %j", b.done);
exports.done = true;
console.log("a.js 执行完毕");

//b.js
exports.done = false;
var a = require("./a.js");
console.log("在 b.js 之中，a.done = %j", a.done);
exports.done = true;
console.log("b.js 执行完毕");
```

执行结果

```js
var a = require('./a.js');
var b = require('./b.js');
console.log('在 main.js 之中, a.done=%j, b.done=%j', a.done, b.done);

// $ node main.js结果
在 b.js 之中，a.done = false
b.js 执行完毕
在 a.js 之中，b.done = true
a.js 执行完毕
在 main.js 之中, a.done=true, b.done=true
```

上面的代码证明了两件事。一是，在`b.js`之中，`a.js`没有执行完毕，只执行了第一行。二是，`main.js`执行到第二行时，不会再次执行`b.js`，而是输出缓存的`b.js`的执行结果，即它的第四行。

### ES6 模块

- `import`语句导入模块，`export`语句导出模块，是异步的
- ES6 模块原理：不论是基本数据类型还是复杂数据类型。当模块遇到 import 命令时，就会生成一个`只读引用`，脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值，所以只需要保证在使用时能够取得到值即可，ES6 根本不会关心是否发生了"循环加载"。`循环加载时，ES6模块是动态引用。只要两个模块之间存在某个引用，代码就能够执行（解决原理）`

```js
// a.js
import { bar } from "./b.js";
export function foo() {
  bar();
  console.log("执行完毕");
}
foo();

// b.js
import { foo } from "./a.js";
export function bar() {
  if (Math.random() > 0.5) {
    foo();
  }
}
```

按照 CommonJS 规范，上面的代码是没法执行的。`a`先加载`b`，然后`b`又加载`a`，这时`a`还没有任何执行结果，所以输出结果为`null`，即对于`b.js`来说，变量`foo`的值等于`null`，后面的`foo()`就会报错。

## webpack 应用

- webpack-merge
  合并 webpack 配置

```js
const commonConfig = require("./webpack.config.base");
const { merge } = require("webpack-merge");

const devConfig = {
  mode: "development",
};

module.exports = merge(commonConfig, devConfig);
```

- webpack-dev-server
  开发环境服务

```js
const devConfig = {
  mode: "development",
  devServer: {
    port: 8080, // 服务器端口号
    compress: true, // 启用gzip压缩
    proxy: {}, // 代理本地请求
    ...
  },
};
```

```sh
webpack-dev-server --config ./webpack.config.dev.js
```

- style-loader
  使 webpack 支持打包样式文件

```js
	module: {
		rules: [
			{
				test: /\.css$/,
				use: [
          'style-loader', // css -> style标签  || MiniCssExtractPlugin.loader, // css -> 独立打包.css文件
          'css-loader',  // 处理.css文件以及其依赖关系
          'postcss-loader', // 处理样式兼容性问题（使用autoprefixer插件）
          ],
			},
			{
				test: /\.sass$/,
				use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
			},
		],
	},
```

- MiniCssExtractPlugin
  将 css 打包成独立的文件

```js
	module: {
		rules: [
			{
				test: /\.css$/,
				loader: [
          MiniCssExtractPlugin.loader, // css -> 独立打包.css文件
          'css-loader',  // 处理.css文件以及其依赖关系
          'postcss-loader', // 处理样式兼容性问题，加载前缀（使用autoprefixer插件）
          ],
			},
		],
	},
  plugins: [
		new MiniCssExtractPlugin({
			filename: 'css/[name].[contentHash:6].lnz.css', // [文件名][6位hash].lnz.css 文件名
		}),
	],
```

- fileloader

```js
rules: [
  {
    test: /\.(png|jpg)$/,
    loader: ["file-loader"], // 直接使用文件加载，build后的文件直接放到dist目录下，请求相应路径即可
  },
];
```

```js
rules: [
  {
    test: /\.(png|jpg)$/,
    use: {
      loader: "url-loader", // 限制大小，小于指定大小的图片会转成base64，减少请求，（大图则继续请求路径获取，提高首次渲染速度）
      options: {
        limit: 5 * 1024, // 5kb 小于该值的图片转成base64
        outputPath: "images/", // 图片输出路径 大于5k打包到该路径下
      },
    },
  },
];
```

- 代码分割
  多入口时，可以抽离公共代码打包共用的.js 文件，比如：公共模块、node_modules 第三方模块

```js
optimization: {
  // 代码分割
  splitChunks: {
    // all      全部代码分割
    // async    异步代码分割
    // initial  同步代码分割
    chunks: "all",
    cacheGroups: {
      // 抽离第三方代码 -> vender.[hash:6].js
      vender: {
        name: "vender",
        test: /[\\/]node_modules[\\/]/,
        priority: 10, // 优先级越高，越应该被该group处理
      },
      // 抽离公共代码 -> common.[hash:6].js
      common: {
        name: "common",
        chunks: "initial",
        minSize: 1, // 引入的js文件大于1kb才会被抽离
        minChunks: 2, // 引入的js文件大于2次才会被抽离
      },
    },
  }
}
```

## webpack build 代码

development 模式下 build 代码解析

```js
(() => {
  // 1.最外层 webpackBootstrap 自执行函数

  // 2.__webpack_modules__ 以{ key ,value }形式存储所有模块
  var __webpack_modules__ = {}

  // 3.__webpack_module_cache__ 缓存读取过的模块
  var __webpack_module_cache__ = {}

  // 4.__webpack_require__ 模拟require方法，读取模块函数
  // 读取模块时，会先从缓存中读取，如果缓存中没有，则会执行该函数，并将读取的模块内容存入缓存
  function __webpack_require__(moduleId)

  // 5.__webpack_exports__ 执行入口
  var __webpack_exports__ = __webpack_require__("./src/index.js") // 加载entry模块，entry里的require的模块会继续被__webpack_require__方法递归调用（有缓存取缓存，没缓存继续从__webpack_modules__里获取，直至加载完所有需要的模块）
})()
```

注

```js
// 2.1
// key: 模块的绝对路径
// value: 模块的内容获取函数
var __webpack_modules__ = {
  key: string,
  value: (
    __unused_webpack_module, // 模块
    __webpack_exports__, // 模块导出，即__webpack_require__真正返回的内容，也是__webpack_module_cache__缓存的内容
    __webpack_require__ // require函数，继续递归调用获取该模块require的模块
  ) => {},
};

// 4.1__webpack_require__ 方法函数
__webpack_require__.d; // 定义导出的模块获取方法 getter function
__webpack_require__.o; // 判断存在某属性 hasOwnProperty shorthand
__webpack_require__.r; // 定义导出的模块
```

打包简单原理：

1. 通过**webpack_require**模拟 require 方法，并且递归调用将所有模块加载到当前打包文件内
2. 通过缓存机制加快 require 读取速度，key-value 的形式简单达到去重目的
