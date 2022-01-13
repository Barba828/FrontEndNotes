## 如何理解前端模块化 

前端模块化就是复杂的文件编程一个一个独立的模块，比如js文件等等，分成独立的模块有利于重用（复用性）和维护（版本迭代），这样会引来模块之间相互依赖的问题，所以有了commonJS规范，AMD，CMD规范等等，以及用于js打包（编译等处理）的工具webpack

## 循环引用

两种解决方案:

[阮一峰解释](http://www.ruanyifeng.com/blog/2015/11/circular-dependency.html)

### CommonJS模块

- 使用require语句导入模块，module.exports导出模块，输出的是`值的拷贝，按需引入，同步执行`
- 对于基本数据类型，属于复制，对于复杂数据类型，属于浅拷贝
- 如何解决循环加载的原理：`循环加载时，属于加载时执行。`即脚本代码在require的时候，就会全部执行，然后`在内存中生成该模块的一个说明对象`。当再次执行require命令，下次会直接读取缓存。一旦出现某个模块被`"循环加载"`，`就只输出已经执行的部分，还未执行的部分不会输出（解决原理）`

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
var b = require('./b.js');
console.log('在 a.js 之中，b.done = %j', b.done);
exports.done = true;
console.log('a.js 执行完毕');

//b.js
exports.done = false;
var a = require('./a.js');
console.log('在 b.js 之中，a.done = %j', a.done);
exports.done = true;
console.log('b.js 执行完毕');
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

### ES6模块

- `import`语句导入模块，`export`语句导出模块，是异步的
- ES6模块原理：不论是基本数据类型还是复杂数据类型。当模块遇到import命令时，就会生成一个`只读引用`，脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值，所以只需要保证在使用时能够取得到值即可，ES6根本不会关心是否发生了"循环加载"。`循环加载时，ES6模块是动态引用。只要两个模块之间存在某个引用，代码就能够执行（解决原理）`

```js
// a.js
import {bar} from './b.js';
export function foo() {
  bar();  
  console.log('执行完毕');
}
foo();

// b.js
import {foo} from './a.js';
export function bar() {  
  if (Math.random() > 0.5) {
    foo();
  }
}
```

按照CommonJS规范，上面的代码是没法执行的。`a`先加载`b`，然后`b`又加载`a`，这时`a`还没有任何执行结果，所以输出结果为`null`，即对于`b.js`来说，变量`foo`的值等于`null`，后面的`foo()`就会报错。






