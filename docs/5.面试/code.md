# Code

[js 实现的算法、数据结构...](https://www.30secondsofcode.org/js/p/1)

## 防抖 Debounce

- 原理：在事件被触发 n 秒后，再去执行回调函数。如果 n 秒内该事件被重新触发，则重新计时。结果就是将频繁触发的事件合并为一次，且在最后执行。
- 例如：电梯 5 秒后会关门开始运作，如果有人进来，等待 5 秒，5 秒之内又有人进来，5 秒等待重新计时...直至超过 5 秒，电梯才开始运作。
- 使用场景：input 输入数据时请求服务器等。

```js
function debounce(func, wait) {
  let timer = null; // 闭包保存标记
  return function () {
    if (timer) {
      // 重复调用，清除定时器
      clearTimeout(timer);
      timer = null;
    }

    timer = setTimeout(() => {
      func.apply(this, arguments);
      timer = null;
    }, wait);
  };
}
```

## 节流 Throttle

- 原理：规定一个时间 n，n 秒内，将触发的事件合并为一次并执行。
- 例如：电梯等第一个人进来之后，5 秒后准时运作，不等待，若 5 秒内还有人进来，也不重置。
- 使用场景：resize，touchmove 移动 DOM，上拉列表加载数据等。

```js
function throttle(func, wait) {
  let timer = null; // 闭包保存标记
  return function () {
    if (timer) {
      // 重复调用，无效
      return;
    }

    timer = setTimeout(() => {
      func.apply(this, arguments);
      timer = null;
    }, wait);
  };
}
```

# 异步编程

JavaScript 是一种同步的、阻塞的、单线程的语言，一次只能执行一个任务。但浏览器定义了非同步的 Web APIs，将回调函数插入到事件循环，实现异步任务的非阻塞执行。常见的异步方案有异步回调、定时器、发布/订阅模式、Promise、生成器 Generator、async/await 以及 Web Worker。

## 1. 异步回调 ​

异步回调函数作为参数传递给在后台执行的其他函数。当后台运行的代码结束，就调用回调函数，通知工作已经完成。具体示例如下：

```js
btn.addEventListener("click", callback);
```

异步回调是编写和处理 JavaScript 异步逻辑的最常用方式，也是最基础的异步模式。但是随着 JavaScript 的发展，异步回调的问题也不容忽视：

- 回调表达异步流程的方式是非线性的，非顺序的，理解成本较高。
- 回调会受到控制反转的影响。因为回调的控制权在第三方（如 Ajax），由第三方来调用回调函数，无法确定调用是否符合预期。
- 多层嵌套回调会产生回调地狱（callback hell）。

```js
// callback hell
btn.addEventListener("click", () => {
  callback1(() => {
    callback2(() => {
      // ...
    });
  });
});
```

## 2. 定时器：setTimeout/setInterval/requestAnimationFrame​

这三个都可以用异步方式运行代码。主要特征如下：

- setTimeout：经过任意时间后运行函数，递归 setTimeout 在 JavaScript 线程不阻塞的情况下可保证执行间隔相同。
- setInterval：允许重复执行一个函数，并设置时间间隔，不能保证执行间隔相同。
- requestAnimationFrame：以当前浏览器/系统的最佳帧速率重复且高效地运行函数的方法。一般用于处理动画效果。

setInterval 会按设定的时间间隔固定调用，其中 setInterval 里面的代码的执行时间也包含在内，所以实际间隔小于设定的时间间隔。而递归 setTimeout 是调用时才开始算时间，可以保证多次递归调用时的间隔相同。

如果当前 JavaScript 线程阻塞，轮到的 setInterval 无法执行，那么本次任务就会被丢弃。而 setTimeout 被阻塞后不会被丢弃，等到空闲时会继续执行，但无法保证执行间隔。

## 3. 发布/订阅模式（publish-subscribe pattern）​

发布/订阅模式是一种对象间一对多的依赖关系，当一个对象的状态发生改变时，所有依赖于它的对象都将得到状态改变的通知。

上面异步回调的例子也是一个发布/订阅模式（publish-subscribe pattern）的实现。订阅 btn 的 click 事件，当 btn 被点击时向订阅者发送这个消息，执行对应的操作。

## 4. Promise​

Promise 提供了完成和拒绝两个状态来标识异步操作结果，通过 then 和 catch 可以分别对着两个状态进行跟踪处理。和事件监听的主要差别在于：

一个 Promise 只能成功或失败一次，一旦状态改变，就无法从成功切换到失败，反之亦然。
如果 Promise 成功或失败，那么即使在事件发生之后添加成功/失败回调，也将调用正确的回调。
Promise 使用顺序的方式来表达异步，将回调的控制权转交给了可以信任的 Promise.resolve()，同时也能够使用链式流的方式避免回调地狱的产生，解决了异步回调的问题。但 Promise 也有缺陷：

- 顺序错误处理：如果不设置回调函数，Promise 链中的错误很容易被忽略。
- 单决议：Promise 只能被决议一次（完成或拒绝），不能很好地支持多次触发的事件及数据流（支持的标准正在制定中）。
- 无法获取状态：处于 Pending 状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。
- 无法取消：一旦创建了 Promise 并注册了完成/拒绝函数，不能取消执行。

## 5. 生成器 Generator​

Generator 函数是 ES6 提供的一种异步编程解决方案，语法与传统函数完全不同，最大的特点就是可以控制函数的执行。简单示例如下：

```js
function* helloHzfeGenerator() {
  yield "hello";
  return "ending";
}

var hello = helloHzfeGenerator();
hello.next(); // { value: 'hello', done: false }
hello.next(); // { value: 'ending', done: true }
hello.next(); // { value: undefined, done: true }
```

生成器 Generator 并不像普通函数那样总是运行到结束，可以在运行当中通过 yield 来暂停并完全保持其状态，再通过 next 恢复运行。yield/next 不只是控制机制，也是一种双向消息传递机制。yield 表达式本质上是暂停下来等待某个值，next 调用会向被暂停的 yield 表达式传回一个值（或者是隐式的 undefined）。

生成器 Generator 保持了顺序、同步、阻塞的代码模式，同样解决了异步回调的问题。

## 6. async/await​

async/await 属于 ECMAScript 2017 JavaScript 版的一部分，使异步代码更易于编写和阅读。通过使用它们，异步代码看起来更像是同步代码。具有如下特点：

- async/await 不能用于普通的回调函数。
- async/await 与 Promise 一样，是非阻塞的。
- async/await 使得异步代码看起来像同步代码。

async/await 也存在问题：await 关键字会阻塞其后的代码，直到 Promise 完成，就像执行同步操作一样。它可以允许其他任务在此期间继续运行，但自己的代码会被阻塞。解决方案是将 Promise 对象存储在变量中来同时开始，然后等待它们全部执行完毕。如果内部的 await 等待的异步任务之间没有依赖关系，且需要获取这些异步操作的结果，可以使用 Promise.allSettled() 同时执行这些任务并获得结果。

async/await​ 可以当作 generator + promise 的语法糖

```js
function getApi(params) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("source" + params);
    });
  });
}

// generator + promise
function* getAllApi(stage0) {
  console.log(stage0);
  let stage1 = yield getApi("startParams");
  console.log("stage1", stage1);
  let stage2 = yield getApi(stage1);
  console.log("stage2", stage2);
  let stage3 = yield getApi(stage2);
  console.log("stage3", stage3);
  return "all Done!!";
}
// 自动运行
function run(generator, v) {
  let { value, done } = generator.next(v);
  if (!done) {
    value.then((res) => {
      run(generator, res);
    });
  } else {
    console.log(value);
  }
}
run(getAllApi("start"));

// async/await
async function getAllApi2() {
  let stage1 = await getApi("startParams");
  console.log("stage1", stage1);
  let stage2 = await getApi(stage1);
  console.log("stage2", stage2);
  let stage3 = await getApi(stage2);
  console.log("stage3", stage3);
  return "all Done!!";
}
```

## 7. Web Worker​

Web Worker 为 JavaScript 创造了多线程环境，允许主线程创建 Worker 线程，将一些任务分配给 Worker 线程运行，处理完后可以通过 postMessage 将结果传递给主线程。优点在于可以在一个单独的线程中执行费时的处理任务，从而允许主线程中的任务（通常是 UI）运行不被阻塞/放慢。

使用 Web Worker 时有以下三点需要注意的地方：

- 在 Worker 内部无法访问主线程的任何资源，包括全局变量，页面的 DOM 或者其他资源，因为这是一个完全独立的线程。
- Worker 和主线程间的数据传递通过消息机制进行。使用 postMessage 方法发送消息；使用 onmessage 事件处理函数来响应消息。
- Worker 可以创建新的 Worker，新的 Worker 和父页面同源。Worker 在使用 XMLHttpRequest 进行网络 I/O 时，XMLHttpRequest 的 responseXML 和 channel 属性会返回 null。

Web Worker 主要应用场景：

- 处理密集型数学计算
- 大数据集排序
- 数据处理（压缩，音频分析，图像处理等）
- 高流量网络通信

# 尾递归优化

## 尾调用

```js
// 尾调用
function f(x) {
  return g(x);
}
// 下面两个不是尾调用
function f(x) {
  let y = g(x);
  return y;
}
function f(x) {
  return g(x) + 1;
}
```

函数调用会在内存形成一个"调用记录"，又称"调用帧"（call frame），保存调用位置和内部变量等信息。如果在函数 A 的内部调用函数 B，那么在 A 的调用记录上方，还会形成一个 B 的调用记录。等到 B 运行结束，将结果返回到 A，B 的调用记录才会消失。如果函数 B 内部还调用函数 C，那就还有一个 C 的调用记录栈，以此类推。所有的调用记录，就形成一个"调用栈"（call stack）。

尾调用由于是函数的最后一步操作，所以不需要保留外层函数的调用记录，因为调用位置、内部变量等信息都不会再用到了，只要直接用内层函数的调用记录，取代外层函数的调用记录就可以了。

```js
function f() {
  let m = 1;
  let n = 2;
  return g(m + n);
}
f();

// 等同于
function f() {
  return g(3);
}
f();

// 等同于
g(3);
```

上面代码中，如果函数 g 不是尾调用，函数 f 就需要保存内部变量 m 和 n 的值、g 的调用位置等信息。但由于调用 g 之后，函数 f 就结束了，所以执行到最后一步，完全可以删除 f() 的调用记录，只保留 g(3) 的调用记录。

这就叫做"尾调用优化"（Tail call optimization），即只保留内层函数的调用记录。如果所有函数都是尾调用，那么完全可以做到每次执行时，调用记录只有一项，这将大大节省内存。这就是"尾调用优化"的意义。

## 尾递归优化

函数调用自身，称为递归。如果尾调用自身，就称为尾递归。

递归非常耗费内存，因为需要同时保存成千上百个调用记录，很容易发生"栈溢出"错误（stack overflow）。但对于尾递归来说，由于只存在一个调用记录，所以永远不会发生"栈溢出"错误。

```js
// 阶乘函数
function factorial(n) {
  if (n === 1) return 1;
  return n * factorial(n - 1);
}

factorial(5); // 120

// 阶乘函数尾递归优化
function factorial(n, total = 1) {
  if (n === 1) return total;
  return factorial(n - 1, n * total);
}
```

"尾调用优化"对递归操作意义重大，所以一些函数式编程语言将其写入了语言规格。ES6 也是如此，第一次明确规定，所有 ECMAScript 的实现，都必须部署"尾调用优化"。这就是说，在 ES6 中，只要使用尾递归，就不会发生栈溢出，相对节省内存。

尾递归优化的改写往往只需要将内部变量改写成函数参数
