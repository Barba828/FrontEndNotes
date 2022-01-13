## 数字

### 格式化数字

1. parseFloat 解析一个字符串，并返回一个浮点数
2. toFixed 把数字转换为字符串，结果的小数点后有指定位数的数字
3. Math.round 把一个数字舍入为最接近的整数
4. toPrecision 把数字格式化为指定的长度

```js
// parseFloat(),解析一个字符串，并返回一个浮点数。
// toFixed把数字转换为字符，结果的小数点后有指定位数的数字,按四舍五入取值
var num = new Number(15.7857);
var a = num.toFixed(); //16 无参数，表示小数点后面位数为0位，然后四舍五入
var b = num.toFixed(1); //15.8
var c = num.toFixed(3); //15.786
var d = num.toFixed(10); //多出的补0

//toPrecision()把数字格式化为指定长度
var f = num.toPrecision(); //15.7857，无参数，返回原数字
var g = num.toPrecision(1); //2e+1，参数小于整数部分位数，返回科学计数
var h = num.toPrecision(3); //15.8，也是有四舍五入
var i = num.toPrecision(10); //15.78570000，长度不够补0
```

### 随机数

```js
Math.ceil(Math.random() * 10); // 获取从 1 到 10 的随机整数，取 0 的概率极小。

Math.round(Math.random()); // 可均衡获取 0 到 1 的随机整数。

Math.floor(Math.random() * 10); // 可均衡获取 0 到 9 的随机整数。

Math.round(Math.random() * 10); // 基本均衡获取 0 到 10 的随机整数，其中获取最小值 0 和最大值 10 的几率少一半。
```

### 取整

1.取整

```
// 丢弃小数部分,保留整数部分
parseInt(5/2)　　// 2
```

2.向上取整

```
// 向上取整,有小数就整数部分加1
Math.ceil(5/2)　　// 3
```

3.向下取整

```
// 向下取整,丢弃小数部分
Math.floor(5/2)　　// 2
```

4 四舍五入

```
// 四舍五入
Math.round(5/2)　　// 3
```

### 取余

```
// 取余
6%4　　// 2
```

### 计算当前月份有多少天

```js
// 第一种方式
function getCountDays() {
  var curDate = new Date();
  // 获取当前月份
  var curMonth = curDate.getMonth();
  // 实际月份比curMonth大1，下面将月份设置为下一个月
  curDate.setMonth(curMonth + 1);
  // 将日期设置为0，表示自动计算为上个月（这里指的是当前月份）的最后一天
  curDate.setDate(0);
  // 返回当前月份的天数
  return curDate.getDate();
}
getCountDays();

// 第二种方式
// 计算当前月份有多少天
function getCountDays() {
  var curDate = new Date();
  // 获取当前月份
  var curMonth = curDate.getMonth();
  // 将日期设置为32，表示自动计算为下个月的第几天（这取决于当前月份有多少天）
  curDate.setDate(32);
  // 返回当前月份的天数
  return 32 - curDate.getDate();
}
getCountDays();

// 计算指定月份 天数
function GetDays(year, month) {
  var d = new Date(year, month, 0);
  return d.getDate();
}
```

## Promise

### promise 构造函数

规范没有指明如何书写构造函数，那就参考 ES6 的构造方式：

```js
const promise = new Promise(function(resolve, reject) {
  // ... some code
  if (/* 异步操作成功 */){
    resolve(value);
  } else {
    reject(error);
  }
});
```

### 手动实现

- 一个 promise 可能有三种状态：等待（pending）、已完成（fulfilled）、已拒绝（rejected）
- 一个 promise 的状态只可能从“等待”转到“完成”态或者“拒绝”态，不能逆向转换，同时“完成”态和“拒绝”态不能相互转换
- promise 必须实现 then 方法（可以说，then 就是 promise 的核心），而且 then 必须返回一个 promise，同一个 promise 的 then 可以调用多次，并且回调的执行顺序跟它们被定义时的顺序一致
- then 方法接受两个参数，第一个参数是成功时的回调，在 promise 由“等待”态转换到“完成”态时调用，另一个是失败时的回调，在 promise 由“等待”态转换到“拒绝”态时调用。同时，then 可以接受另一个 promise 传入，也接受一个“类 then”的对象或方法，即 thenable 对象。

#### 基本功能

##### 基本功能

```js
// 首先定义三种状态为三个常量
const PENDING = 'pending'
const FULFILLED = 'fulfilled'
const REJECTED = 'rejected'

// 定义一个promise类
class Promise {
  // 该构造函数接收一个执行器(函数executor)，executor需要在实例化的时候立即执行。
  constructor(executor) {
    this.status = PENDING // 默认状态为待定
    this.value = undefined // 成功的返回值
    this.reason = undefined // 失败的原因

    let resolve = (val) => {
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = val
      }
    }

    let reject = (error) => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = error
      }
    }

    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    // 状态为fulfilled，执行onFulfilled，传入成功的值
    if (this.state === 'fulfilled') {
      onFulfilled(this.value);
    };
    // 状态为rejected，执行onRejected，传入失败的原因
    if (this.state === 'rejected') {
      onRejected(this.reason);
    };
  }
```

##### 加入异步

```js
//上述promise如果异步将无法执行
const promise = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(1);
  });
});

promise.then((value) => {
  console.log(value); // ''，没有输出任何结果
});
```

用两个数组(onResolveCallbacks,onRejectCallbacks)来收集回调，当执行到下一个 tick 的时候(事件循环机制)，依次触发收集的回调函数(发布订阅)。

```js
class Promise {
  // 该构造函数接收一个执行器(函数executor)，executor需要在实例化的时候立即执行。
  constructor(executor) {
    this.status = PENDING // 默认状态为待定
    this.value = undefined // 成功的返回值
    this.reason = undefined // 失败的原因

    this.onResolveCallbacks = [] // 成功的回调函数集合
    this.onRejectCallbacks = [] // 失败的回调函数集合

    let resolve = (val) => {
      if (this.status === PENDING) {
        this.status = FULFILLED
        this.value = val
        this.onResolvedCallbacks.forEach(fn=>fn());
      }
    }
    let reject = (error) => {
      if (this.status === PENDING) {
        this.status = REJECTED
        this.reason = error
        this.onRejectedCallbacks.forEach(fn=>fn());
      }
    }
    try {
      executor(resolve, reject)
    } catch (error) {
      reject(error)
    }
  }

  then(onFulfilled, onRejected) {
    // 状态为fulfilled，执行onFulfilled，传入成功的值
    if (this.state === 'fulfilled') {
      onFulfilled(this.value);
    };
    // 状态为rejected，执行onRejected，传入失败的原因
    if (this.state === 'rejected') {
      onRejected(this.reason);
    };
    if (this.status === PENDING) {
        /*
        * 异步并且多次调用的情况（还未解决链式调用情况）
        * p = new Promise((resolve, reject) => {
        *    setTimeout(() =>{
        *      resolve(1)
        *    })
        * })
        * p.then()
        * p.then()
        */
        this.onResolveCallbacks.push(() => {
          onFulfilled(this.value)
        })

        this.onRejectCallbacks.push(() => {
          onRejected(this.reason)
        })
      }
  }
```

##### 解决链式调用

- 似乎 promise 允许这样使用，promise.then().then().then()
- 所以规定 then 函数返回的仍然是一个 promise，我们称为 newPromise
- 规定 then 的两个参数如果不是函数则需要将其转为函数形式
- 第一个 then 返回的值中叫做 x，我们用函数 resolvePromise 来判断 x

```js
then(onFulfilled, onRejected) {
		//规定then的两个参数如果不是函数则需要将其转为函数形式
    onFulfilled = typeof onFulfilled == 'function' ? onFulfilled : value => value
    onRejected = typeof onRejected == 'function' ? onRejected : err => { throw err }

    let newPromise = new Promise((resolve, reject) => {
      if (this.status === FULFILLED) {
        setTimeout(() => {
          try {
            //第一个then返回的值中叫做x，我们用函数resolvePromise来判断x
            let x = onFulfilled(this.value)
            resolvePromise(newPromise, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }

      if (this.status === REJECTED) {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason)
            resolvePromise(newPromise, x, resolve, reject)
          } catch (error) {
            reject(error)
          }
        }, 0)
      }

      if (this.status === PENDING) {
        this.onResolveCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onFulfilled(this.value)
              resolvePromise(newPromise, x, resolve, reject)

            } catch (error) {
              reject(error)
            }
          }, 0)
        })

        this.onRejectCallbacks.push(() => {
          setTimeout(() => {
            try {
              let x = onRejected(this.reason)
              resolvePromise(newPromise, x, resolve, reject)
            } catch (error) {
              reject(error)
            }
          }, 0)
        })
      }
    })

    return newPromise
  }
```

##### 函数 resolvePromise 的实现

- 如果 newPromise 和 x 指向同一个对象(会造成死循环),则抛出类型错误
- 如果 x 不是一个函数或者对象，则以 x 为值执行 promise，`resolve(x)`
- 如果 x 是一个函数或者对象，将 x.then 赋予新的变量 then。`let then=x.then`
- 将 x 作为 this，执行 then。
- 如果 resolvePromise 以值 y 为参数被调用，则运行 [[Resolve]](promise, y)，此时递归执行，解决多次调用 then 的情况
- 如果 rejectPromise 以拒绝原因 r 为参数被调用，则以拒绝原因 r 拒绝 promise
- 下面就将这些规范应用到下面的代码中

```js
function resolvePromise(newPromise, x, resolve, reject) {
  // 如果newPromise和x指向同一个对象(会造成死循环),则抛出类型错误
  if (newPromise === x) {
    return reject(new TypeError("A promise cannot be resolved with itself")); // 禁止循环引用
  }

  let called;
  if ((typeof x === "object" && x != null) || typeof x === "function") {
    try {
      let then = x.then;
      if (typeof then === "function") {
        // 将x作为this，执行then。
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(newPromise, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        resolve(x);
      }
    } catch (error) {
      if (called) return;
      called = true;
      reject(error);
    }
  } else {
    resolve(x);
  }
}
```

#### 测试

```js
new MyPromise((resolve, reject) => {
  Math.random() > 0.5 ? resolve("yes") : reject("no");
}).then(
  //resolve
  (res) => {
    console.log(res);
  },
  //reject
  (err) => {
    console.log(err);
  }
);
```

#### [符合 Promise/A+要求](https://juejin.cn/post/6844903763178684430)

[完整代码](https://github.com/webfansplz/article/tree/master/ajPromise)

```js
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class AjPromise {
  constructor(fn) {
    this.state = PENDING;
    this.value = null;
    this.reason = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    const resolve = (value) => {
      if (value instanceof Promise) {
        return value.then(resolve, reject);
      }
      setTimeout(() => {
        if (this.state === PENDING) {
          this.state = FULFILLED;
          this.value = value;
          this.onFulfilledCallbacks.map((cb) => {
            cb = cb(this.value);
          });
        }
      });
    };
    const reject = (reason) => {
      setTimeout(() => {
        if (this.state === PENDING) {
          this.state = REJECTED;
          this.reason = reason;
          this.onRejectedCallbacks.map((cb) => {
            cb = cb(this.reason);
          });
        }
      });
    };
    try {
      fn(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  then(onFulfilled, onRejected) {
    let newPromise;

    onFulfilled =
      typeof onFulfilled === "function" ? onFulfilled : (value) => value;
    onRejected =
      typeof onRejected === "function"
        ? onRejected
        : (reason) => {
            throw reason;
          };
    if (this.state === FULFILLED) {
      return (newPromise = new AjPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            let x = onFulfilled(this.value);
            resolvePromise(newPromise, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }));
    }
    if (this.state === REJECTED) {
      return (newPromise = new AjPromise((resolve, reject) => {
        setTimeout(() => {
          try {
            let x = onRejected(this.reason);
            resolvePromise(newPromise, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }));
    }
    if (this.state === PENDING) {
      return (newPromise = new AjPromise((resolve, reject) => {
        this.onFulfilledCallbacks.push((value) => {
          try {
            let x = onFulfilled(value);
            resolvePromise(newPromise, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
        this.onRejectedCallbacks.push((reason) => {
          try {
            let x = onRejected(reason);
            resolvePromise(newPromise, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
      }));
    }
  }
}
function resolvePromise(promise2, x, resolve, reject) {
  if (x === promise2) {
    reject(new TypeError("循环引用"));
  }
  if (x instanceof AjPromise) {
    if (x.state === PENDING) {
      x.then(
        (y) => {
          resolvePromise(promise2, y, resolve, reject);
        },
        (reason) => {
          reject(reason);
        }
      );
    } else {
      x.then(resolve, reject);
    }
  } else if (x && (typeof x === "function" || typeof x === "object")) {
    let called = false;
    try {
      let then = x.then;
      if (typeof then === "function") {
        then.call(
          x,
          (y) => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          (r) => {
            if (called) return;
            called = true;
            reject(r);
          }
        );
      } else {
        resolve(x);
      }
    } catch (e) {
      if (called) return;
      called = true;
      reject(e);
    }
  } else {
    resolve(x);
  }
}

AjPromise.deferred = function () {
  let defer = {};
  defer.promise = new AjPromise((resolve, reject) => {
    defer.resolve = resolve;
    defer.reject = reject;
  });
  return defer;
};

module.exports = AjPromise;
```

### Promise.all

伪代码实现

```js
Promise.myAll = function (...args) {
  const result = [];
  let isFail = false;
  let errInfo;
  let j = args.length;
  for (let i = 0; i < args.length; i++) {
    // 如果有错误就停止循环
    if (isFail) {
      return Promise.reject(errInfo);
    }
    // 挨个运行promise
    args[i]
      .then((res) => {
        // 处理结果
        result.push(res);
        j--;
        if (j === 0) {
          return Promise.resolve(result);
        }
      })
      .catch((err) => {
        // 设置停止循环的标志，存储错误信息
        isFail = true;
        errInfo = err;
      });
  }
};
```

### errFisrt 写法

```js
//error-first Promise写法
myPromise = (promise) =>
  promise.then((data) => [null, data]).catch((err) => [err]);

//使用
const [err, data] = myPromise(fn);
```



## Generator

[Generator 函数——阮一峰](http://www.ruanyifeng.com/blog/2015/04/generator.html)

### 协程

传统的编程语言，早有异步编程的解决方案（其实是多任务的解决方案）。其中有一种叫做["协程"](https://en.wikipedia.org/wiki/Coroutine)（coroutine），意思是多个线程互相协作，完成异步任务。

协程有点像函数，又有点像线程。它的运行流程大致如下。

> 第一步，协程A开始执行。
>
> 第二步，协程A执行到一半，进入暂停，执行权转移到协程B。
>
> 第三步，（一段时间后）协程B交还执行权。
>
> 第四步，协程A恢复执行。

上面流程的协程A，就是异步任务，因为它分成两段（或多段）执行。

举例来说，读取文件的协程写法如下。

> ```javascript
> function asnycJob() {
>   // ...其他代码
>   var f = yield readFile(fileA);
>   // ...其他代码
> }
> ```

上面代码的函数 asyncJob 是一个协程，它的奥妙就在其中的 yield 命令。它表示执行到此处，执行权将交给其他协程。也就是说，yield命令是异步两个阶段的分界线。

协程遇到 yield 命令就暂停，等到执行权返回，再从暂停的地方继续往后执行。它的最大优点，就是代码的写法非常像同步操作，如果去除yield命令，简直一模一样。

### 使用

Generator 函数是协程在 ES6 的实现，最大特点就是可以交出函数的执行权（即暂停执行）。

> ```javascript
> function* gen(x){
>   var y = yield x + 2;
>   return y;
> }
> ```

上面代码就是一个 Generator 函数。它不同于普通函数，是可以暂停执行的，所以函数名之前要加星号，以示区别。

整个 Generator 函数就是一个封装的异步任务，或者说是异步任务的容器。异步操作需要暂停的地方，都用 yield 语句注明。Generator 函数的执行方法如下。

> ```javascript
> var g = gen(1);
> g.next() // { value: 3, done: false }
> g.next() // { value: undefined, done: true }
> 
> for (let value of gen(1)) {
>   // 可获取遍历value
> }
> ```

上面代码中，调用 Generator 函数，会返回一个内部指针（即[遍历器](http://es6.ruanyifeng.com/#docs/iterator) ）g 。这是 Generator 函数不同于普通函数的另一个地方，即执行它不会返回结果，返回的是指针对象。调用指针 g 的 next 方法，会移动内部指针（即执行异步任务的第一段），指向第一个遇到的 yield 语句，上例是执行到 x + 2 为止。

换言之，next 方法的作用是分阶段执行 Generator 函数。每次调用 next 方法，会返回一个对象，表示当前阶段的信息（ value 属性和 done 属性）。value 属性是 yield 语句后面表达式的值，表示当前阶段的值；done 属性是一个布尔值，表示 Generator 函数是否执行完毕，即是否还有下一个阶段。



### 数据交换和错误处理

Generator 函数可以暂停执行和恢复执行，这是它能封装异步任务的根本原因。除此之外，它还有两个特性，使它可以作为异步编程的完整解决方案：函数体内外的数据交换和错误处理机制。

next 方法返回值的 value 属性，是 Generator 函数向外输出数据；next 方法还可以接受参数，这是向 Generator 函数体内输入数据。

> ```javascript
> function* gen(x){
>   var y = yield x + 2;
>   return y;
> }
> 
> var g = gen(1);
> g.next() // { value: 3, done: false }
> g.next(2) // { value: 2, done: true }
> ```

上面代码中，第一个 next 方法的 value 属性，返回表达式 x + 2 的值（3）。第二个 next 方法带有参数2，这个参数可以传入 Generator 函数，作为上个阶段异步任务的返回结果，被函数体内的变量 y 接收。因此，这一步的 value 属性，返回的就是2（变量 y 的值）。

Generator 函数内部还可以部署错误处理代码，捕获函数体外抛出的错误。

> ```javascript
> function* gen(x){
>   try {
>     var y = yield x + 2;
>   } catch (e){ 
>     console.log(e);
>   }
>   return y;
> }
> 
> var g = gen(1);
> g.next();
> g.throw（'出错了'）;
> // 出错了
> ```

上面代码的最后一行，Generator 函数体外，使用指针对象的 throw 方法抛出的错误，可以被函数体内的 try ... catch 代码块捕获。这意味着，出错的代码与处理错误的代码，实现了时间和空间上的分离，这对于异步编程无疑是很重要的。

### 异步任务

在generator中使用了Promise

> ```javascript
> var fetch = require('node-fetch');
> 
> function* gen(){
>   var url = 'https://api.github.com/users/github';
>   var result = yield fetch(url);
>   console.log(result.bio);
> }
> ```

上面代码中，Generator 函数封装了一个异步操作，该操作先读取一个远程接口，然后从 JSON 格式的数据解析信息。就像前面说过的，这段代码非常像同步操作，除了加上了 yield 命令。

执行这段代码的方法如下。

> ```javascript
> var g = gen();
> var result = g.next();
> 
> result.value.then(function(data){
>   return data.json();
> }).then(function(data){
>   g.next(data);
> });
> ```

上面代码中，首先执行 Generator 函数，获取遍历器对象，然后使用 next 方法（第二行），执行异步任务的第一阶段。由于 [Fetch 模块](https://github.com/bitinn/node-fetch)返回的是一个 Promise 对象，因此要用 then 方法调用下一个next 方法。

### await

借助Promise简单实现async await的效果

```js
//promise异步任务1
function doTask1() {
  return new Promise((resolve) =>
    setTimeout(() => resolve("resolved-Task1"), 1000)
  );
}
//promise异步任务2
function doTask2() {
  return new Promise((resolve) =>
    setTimeout(() => resolve("resolved-Task2"), 2000)
  );
}

//核心函数，递归
function runner(generator) {
  const g = generator();
  function run(arg) {
    console.log("arg", arg); // 2,5
    let result = g.next(arg); // 3,6
    if (!result.done) {
      Promise.resolve(result.value).then(run);
    }
  }
  run(); // 1
}

//测试异步generator语句
function* test() {
  console.log("start test");
  const result1 = yield doTask1(); // 3
  console.log("generator1", result1);
  const result2 = yield doTask2(); // 6
  console.log("generator2", result2);
}

//async await的方式调用generator语句
runner(test);
```



## [事件委托](https://www.cnblogs.com/liugang-vip/p/5616484.html)

### 概述

那什么叫事件委托呢？它还有一个名字叫事件代理，JavaScript 高级程序设计上讲：事件委托就是利用事件冒泡，只指定一个事件处理程序，就可以管理某一类型的所有事件。那这是什么意思呢？网上的各位大牛们讲事件委托基本上都用了同一个例子，就是取快递来解释这个现象，我仔细揣摩了一下，这个例子还真是恰当，我就不去想别的例子来解释了，借花献佛，我摘过来，大家认真领会一下事件委托到底是一个什么原理：

有三个同事预计会在周一收到快递。为签收快递，有两种办法：一是三个人在公司门口等快递；二是委托给前台 MM 代为签收。现实当中，我们大都采用委托的方案（公司也不会容忍那么多员工站在门口就为了等快递）。前台 MM 收到快递后，她会判断收件人是谁，然后按照收件人的要求签收，甚至代为付款。这种方案还有一个优势，那就是即使公司里来了新员工（不管多少），前台 MM 也会在收到寄给新员工的快递后核实并代为签收。

这里其实还有 2 层意思的：

第一，现在委托前台的同事是可以代为签收的，即程序中的现有的 dom 节点是有事件的；

第二，新员工也是可以被前台 MM 代为签收的，即程序中新添加的 dom 节点也是有事件的。

为什么要用事件委托：

一般来说，dom 需要有事件处理程序，我们都会直接给它设事件处理程序就好了，那如果是很多的 dom 需要添加事件处理呢？比如我们有 100 个 li，每个 li 都有相同的 click 点击事件，可能我们会用 for 循环的方法，来遍历所有的 li，然后给它们添加事件，那这么做会存在什么影响呢？

在 JavaScript 中，添加到页面上的事件处理程序数量将直接关系到页面的整体运行性能，因为需要不断的与 dom 节点进行交互，访问 dom 的次数越多，引起浏览器重绘与重排的次数也就越多，就会延长整个页面的交互就绪时间，这就是为什么性能优化的主要思想之一就是减少 DOM 操作的原因；如果要用事件委托，就会将所有的操作放到 js 程序里面，与 dom 的操作就只需要交互一次，这样就能大大的减少与 dom 的交互次数，提高性能；

每个函数都是一个对象，是对象就会占用内存，对象越多，内存占用率就越大，自然性能就越差了（内存不够用，是硬伤，哈哈），比如上面的 100 个 li，就要占用 100 个内存空间，如果是 1000 个，10000 个呢，那只能说呵呵了，如果用事件委托，那么我们就可以只对它的父级（如果只有一个父级）这一个对象进行操作，这样我们就需要一个内存空间就够了，是不是省了很多，自然性能就会更好。

### 原理

事件委托是利用事件的冒泡原理来实现的，何为事件冒泡呢？就是事件从最深的节点开始，然后逐步向上传播事件，举个例子：页面上有这么一个节点树，div>ul>li>a;比如给最里面的 a 加一个 click 点击事件，那么这个事件就会一层一层的往外执行，执行顺序 a>li>ul>div，有这样一个机制，那么我们给最外面的 div 加点击事件，那么里面的 ul，li，a 做点击事件的时候，都会冒泡到最外层的 div 上，所以都会触发，这就是事件委托，委托它们父级代为执行事件`event`。

而通过`event.target`也能获取到深层触发该事件的节点，而不用为每一个节点添加 Dom 事件。

### 实现

在介绍事件委托的方法之前，我们先来看一段一般方法的例子：

子节点实现相同的功能：

```html
<ul id="ul1">
  <li>111</li>
  <li>222</li>
  <li>333</li>
  <li>444</li>
</ul>
```

实现功能是点击 li，弹出 123：

```js
window.onload = function () {
  var oUl = document.getElementById("ul1");
  var aLi = oUl.getElementsByTagName("li");
  for (var i = 0; i < aLi.length; i++) {
    aLi[i].onclick = function () {
      alert(123);
    };
  }
};
```

上面的代码的意思很简单，相信很多人都是这么实现的，我们看看有多少次的 dom 操作，首先要找到 ul，然后遍历 li，然后点击 li 的时候，又要找一次目标的 li 的位置，才能执行最后的操作，每次点击都要找一次 li；

那么我们用事件委托的方式做又会怎么样呢？

```js
window.onload = function () {
  var oUl = document.getElementById("ul1");
  oUl.onclick = function () {
    alert(123);
  };
};
```

这里用父级 ul 做事件处理，当 li 被点击时，由于冒泡原理，事件就会冒泡到 ul 上，因为 ul 上有点击事件，所以事件就会触发，当然，这里当点击 ul 的时候，也是会触发的，那么问题就来了，如果我想让事件代理的效果跟直接给节点的事件效果一样怎么办，比如说只有点击 li 才会触发，不怕，我们有绝招：

Event 对象提供了一个属性叫 target，可以返回事件的目标节点，我们成为事件源，也就是说，target 就可以表示为当前的事件操作的 dom，但是不是真正操作 dom，当然，这个是有兼容性的，标准浏览器用 ev.target，IE 浏览器用 event.srcElement，此时只是获取了当前节点的位置，并不知道是什么节点名称，这里我们用 nodeName 来获取具体是什么标签名，这个返回的是一个大写的，我们需要转成小写再做比较（习惯问题）：

````js
window.onload = function(){
　　var oUl = document.getElementById("ul1");
　　oUl.onclick = function(ev){
　　　　var ev = ev || window.event;
　　　　var target = ev.target || ev.srcElement;
　　　　if(target.nodeName.toLowerCase() == 'li'){
　 　　　　　　 alert(123);
　　　　　　　  alert(target.innerHTML);
　　　　}
　　}
}
这样改下就只有点击li会触发事件了，且每次只执行一次dom操作，如果li数量很多的话，将大大减少dom的操作，优化的性能可想而知！

上面的例子是说li操作的是同样的效果，要是每个li被点击的效果都不一样，那么用事件委托还有用吗？

​```html
<div id="box">
  <input type="button" id="add" value="添加" />
  <input type="button" id="remove" value="删除" />
  <input type="button" id="move" value="移动" />
  <input type="button" id="select" value="选择" />
</div>
````

```js
window.onload = function () {
  var Add = document.getElementById("add");
  var Remove = document.getElementById("remove");
  var Move = document.getElementById("move");
  var Select = document.getElementById("select");

  Add.onclick = function () {
    alert("添加");
  };
  Remove.onclick = function () {
    alert("删除");
  };
  Move.onclick = function () {
    alert("移动");
  };
  Select.onclick = function () {
    alert("选择");
  };
};
```

上面实现的效果我就不多说了，很简单，4 个按钮，点击每一个做不同的操作，那么至少需要 4 次 dom 操作，如果用事件委托，能进行优化吗？

```js
window.onload = function () {
  var oBox = document.getElementById("box");
  oBox.onclick = function (ev) {
    var ev = ev || window.event;
    var target = ev.target || ev.srcElement;
    if (target.nodeName.toLocaleLowerCase() == "input") {
      switch (target.id) {
        case "add":
          alert("添加");
          break;
        case "remove":
          alert("删除");
          break;
        case "move":
          alert("移动");
          break;
        case "select":
          alert("选择");
          break;
      }
    }
  };
};
```

    用事件委托就可以只用一次dom操作就能完成所有的效果，比上面的性能肯定是要好一些的

现在讲的都是 document 加载完成的现有 dom 节点下的操作，那么如果是新增的节点，新增的节点会有事件吗？也就是说，一个新员工来了，他能收到快递吗？

看一下正常的添加节点的方法：

```html
<input type="button" name="" id="btn" value="添加" />
<ul id="ul1">
  <li>111</li>
  <li>222</li>
  <li>333</li>
  <li>444</li>
</ul>
```

现在是移入 li，li 变红，移出 li，li 变白，这么一个效果，然后点击按钮，可以向 ul 中添加一个 li 子节点

```js
window.onload = function () {
  var oBtn = document.getElementById("btn");
  var oUl = document.getElementById("ul1");
  var aLi = oUl.getElementsByTagName("li");
  var num = 4;

  //鼠标移入变红，移出变白
  for (var i = 0; i < aLi.length; i++) {
    aLi[i].onmouseover = function () {
      this.style.background = "red";
    };
    aLi[i].onmouseout = function () {
      this.style.background = "#fff";
    };
  }
  //添加新节点
  oBtn.onclick = function () {
    num++;
    var oLi = document.createElement("li");
    oLi.innerHTML = 111 * num;
    oUl.appendChild(oLi);
  };
};
```

这是一般的做法，但是你会发现，新增的 li 是没有事件的，说明添加子节点的时候，事件没有一起添加进去，这不是我们想要的结果，那怎么做呢？一般的解决方案会是这样，将 for 循环用一个函数包起来，命名为 mHover，如下：

```js
window.onload = function () {
  var oBtn = document.getElementById("btn");
  var oUl = document.getElementById("ul1");
  var aLi = oUl.getElementsByTagName("li");
  var num = 4;

  function mHover() {
    //鼠标移入变红，移出变白
    for (var i = 0; i < aLi.length; i++) {
      aLi[i].onmouseover = function () {
        this.style.background = "red";
      };
      aLi[i].onmouseout = function () {
        this.style.background = "#fff";
      };
    }
  }
  mHover();
  //添加新节点
  oBtn.onclick = function () {
    num++;
    var oLi = document.createElement("li");
    oLi.innerHTML = 111 * num;
    oUl.appendChild(oLi);
    mHover();
  };
};
```

虽然功能实现了，看着还挺好，但实际上无疑是又增加了一个 dom 操作，在优化性能方面是不可取的，那么有事件委托的方式，能做到优化吗？

```js
window.onload = function () {
  var oBtn = document.getElementById("btn");
  var oUl = document.getElementById("ul1");
  var aLi = oUl.getElementsByTagName("li");
  var num = 4;

  //事件委托，添加的子元素也有事件
  oUl.onmouseover = function (ev) {
    var ev = ev || window.event;
    var target = ev.target || ev.srcElement;
    if (target.nodeName.toLowerCase() == "li") {
      target.style.background = "red";
    }
  };
  oUl.onmouseout = function (ev) {
    var ev = ev || window.event;
    var target = ev.target || ev.srcElement;
    if (target.nodeName.toLowerCase() == "li") {
      target.style.background = "#fff";
    }
  };

  //添加新节点
  oBtn.onclick = function () {
    num++;
    var oLi = document.createElement("li");
    oLi.innerHTML = 111 * num;
    oUl.appendChild(oLi);
  };
};
```

看，上面是用事件委托的方式，新添加的子元素是带有事件效果的，我们可以发现，当用事件委托的时候，根本就不需要去遍历元素的子节点，只需要给父级元素添加事件就好了，其他的都是在 js 里面的执行，这样可以大大的减少 dom 操作，这才是事件委托的精髓所在。

### 例

如上列表，有 4 个 li，里面的内容各不相同，点击 li，event 对象肯定是当前点击的对象，怎么指定到 li 上，下面我直接给解决方案：

```js
var oUl = document.getElementById("test");
oUl.addEventListener("click", function (ev) {
  var target = ev.target;
  while (target !== oUl) {
    if (target.tagName.toLowerCase() == "li") {
      console.log("li click~");
      break;
    }
    target = target.parentNode;
  }
});
```

    核心代码是while循环部分，实际上就是一个递归调用，你也可以写成一个函数，用递归的方法来调用，同时用到冒泡的原理，从里往外冒泡，知道currentTarget为止，当当前的target是li的时候，就可以执行对应的事件了，然后终止循环，恩，没毛病！

### 总结

那什么样的事件可以用事件委托，什么样的事件不可以用呢？

适合用事件委托的事件：click，mousedown，mouseup，keydown，keyup，keypress。

值得注意的是，mouseover 和 mouseout 虽然也有事件冒泡，但是处理它们的时候需要特别的注意，因为需要经常计算它们的位置，处理起来不太容易。

不适合的就有很多了，举个例子，mousemove，每次都要计算它的位置，非常不好把控，在不如说 focus，blur 之类的，本身就没用冒泡的特性，自然就不能用事件委托了。

好了，今天就到这里，下次我想介绍一下事件绑定，欢迎大家关注和阅读，以上纯属个人见解，如有不对的地方，万望指正，不胜感谢！

## 原型链

### js 原型遵循 5 个规则

1、所有的引用类型（数组、对象、函数），都具有对象特性，即可自由扩展属性（除了“null”以外）；

2、所有的引用类型（数组、对象、函数），都有一个`__proto__`（隐式原型）属性，属性值是一个普通的对象；

3、所有的函数，都有一个 prototype（显式原型）属性，属性值也是一个普通对象；

4、所有的引用类型（数组、对象、函数），`__proto__`属性值指向（完全相等）它的构造函数的“prototype”属性值；

5、当试图得到一个对象的某个属性时，如果这个对象本身没有这个属性，那么会去**proto**（即它的构造函数的 prototype 中）寻找。

**理解：**

prototype 指向一块内存，这个内存里面有共用属性

**proto** 指向同一块内存

prototype 和 **proto** 的不同点在于

prototype 是构造函数的属性，而 **proto** 是对象的属性

难点在于……构造函数也是对象！

如果没有 prototype，那么共用属性就没有立足之地

如果没有 **proto**，那么一个对象就不知道自己的共用属性有哪些。

有一个类如下：

```js
function Person(name) {
  this.name = name;
}
let p = new Person("Tom");
```

1. `p.__proto__`等于什么？

**答案：**
Person.prototype

2. `Person.__proto__`等于什么？

**答案：**
Function.prototype

**解析：**

1，2 两问其实问的是同一个问题，都是考察原型链相关的知识，我们只需要记住一句话就可以迎刃而解。实例的**proto**属性（原型）等于其构造函数的 prototype 属性。实例 p 的构造函数为 Person，而 Person 的构造函数为 Function

### new

核心功能即：绑定对象`__proto__`到对象类`prototype`上

> 1.  创建一个新对象，同时继承对象类的原型，即 Person.prototype；
>
> 2.  执行对象类的构造函数，同时该实例的属性和方法被 this 所引用，即 this 指向新构造的实例；
>
> 3.  如果构造函数 return 了一个新的“对象”，那么这个对象就会取代整个 new 出来的结果。如果构造函数没有 return 对象，那么就会返回步骤 1 所创建的对象，即隐式返回 this。（一般情况下构造函数不会返回任何值，不过在一些特殊情况下，如果用户想覆盖这个值，可以选择返回一个普通的对象来覆盖。）

代码实现

```js
// let p = new Person('Barba');
let p = (function (name) {
  let obj = {};
  obj.__proto__ = Person.prototype;
  obj.name = name;
  // ...其他赋值语句
  return obj;
})("Barba");
```

### instanceof

x 会一直沿着隐式原型链**proto**向上查找直到`x.__proto__.__proto__......===y.prototype`为止，如果找到则返回 true，也就是 x 为 y 的一个实例。否则返回 false，x 不是 y 的实例

```js
while (x.__proto__ !== null) {
  if (x.__proto__ === y.prototype) {
    return true;
    break;
  }
  x.__proto__ = x.__proto__.proto__;
}
if (x.__proto__ == null) {
  return false;
}
```

## this

### this 指向

案例

```js
var obj = {
  foo: function () {
    console.log(this);
  },
  foo2: function () {
    return (function () {
      console.log(this);
    })();
  },
};

var bar = obj.foo;
obj.foo(); // 打印出的 this 是 obj
bar(); // 打印出的 this 是 global(window)
obj.foo2(); //打印出的 this 是 global(window)
```

JS（ES5）里面有三种函数调用形式：

```js
// 直接调用
func(p1, p2);
// 对象方法
obj.child.method(p1, p2);
// call/apply方法
func.call(context, p1, p2); // 同func.call(context, p1, p2)
```

实际上，前两种调用方式只是语法糖的调用方式，等价为

```js
func(p1, p2); // 等价于
func.call(undefined, p1, p2);

obj.child.method(p1, p2); // 等价于
obj.child.method.call(obj.child, p1, p2);
```

> 如果你传的 context 是 null 或 undefined，那么 window 对象就是默认的 context（严格模式下默认 context 是 undefined）

```js
var obj = {
  foo: function () {
    console.log(this);
  },
};

var bar = obj.foo;
obj.foo();
obj.foo.call(obj); //等价

bar();
bar.call(); //等价
```

#### 数组对象 this

`arr[0]() `理解为`arr.0()`

```js
function fn() {
  console.log(this);
}
var arr = [fn, fn2];
arr[0](); // this打印为 arr 对象，等价于 arr.0.call(arr)
```

#### 箭头函数 this

箭头函数内部并不存在 this，函数内的 this 就是函数外部的 context，相当于 bind 上下文 this 的函数

#### 事件监听 this

```js
btn.addEventListener("click", function handler(event) {
  console.log(this); // 请问这里的 this 是什么
});
```

需要找到调用 handler

```js
// 当事件被触发时
handler.call(event.currentTarget, event);
```

this 表示触发该事件的 target 节点

##### 使用箭头函数时

this 仅表示该处上下文 context，比如有可能是 window、Vue 对象...

```js
btn.addEventListener("click", (event) => {
  console.log(this);
});
//等价于
btn.addEventListener(
  "click",
  function () {
    console.log(this);
  }.bind(this)
);
```

## 任务队列

因 JS 为单线程，所以需要一个任务队列规划调度任务。

### 任务类型

#### 为什么需要宏任务/微任务

为了单线程的插队

一个 Event Loop，Microtask 是在 Macrotask 之后调用，Microtask 会在下一个 Event Loop 之前执行调用完，并且其中会将 Microtask 执行当中新注册的 Microtask 一并调用执行完，然后才开始下一次 Event loop，所以如果有新的 Macrotask 就需要一直等待，等到上一个 Event loop 当中 Microtask 被清空为止。由此可见， 我们可以在下一次 Event loop 之前进行插队。如果不区分 Microtask 和 Macrotask，那就无法在下一次 Event loop 之前进行插队，其中新注册的任务得等到下一个 Macrotask 完成之后才能进行，这中间可能你需要的状态就无法在下一个 Macrotask 中得到同步。状态的同步对于视图来说至关重要，这也就牵扯到了为什么 javascript 是单线程的原因所在。

#### 宏任务

宏任务本质:参与了事件循环的任务

- 同步代码
- I/O
- UI rendering
- settimeout/setinterval/setimmediate
- requestAnimationFrame

#### 微任务

微任务本质：直接在 Javascript 引擎中的执行的，没有参与事件循环的任务

- process.nextTick
- Promise
- MutationObserver

### 规则

执行一个宏任务(先执行同步代码)-->执行所有微任务-->UI render-->执行下一个宏任务-->执行所有微任务-->UI render-->...

> 根据 HTML Standard，一轮事件循环执行结束之后，下轮事件循环执行之前开始进行 UI render。即：macro-task 任务执行完毕，接着执行完所有的 micro-task 任务后，此时本轮循环结束，开始执行 UI render。UI render 完毕之后接着下一轮循环。但是 UI render 不一定会执行，因为需要考虑 ui 渲染消耗的性能已经有没有 ui 变动

#### 优先级

微任务：nextTick>Promise>MutationObserver.

宏任务：大部分浏览器会把 DOM 事件回调优先处理 因为要提升用户体验 给用户反馈，其次是 network IO 操作的回调，再然后是 UIrender。（具有浏览器差异）

#### 注

```js
setTimeout(function () {
  console.log("执行了");
}, 3000);
```

3 秒后，setTimeout 里的函数被会推入 event queue，而 event queue(事件队列)里的任务，只有在主线程空闲时才会执行。
**所以只有满足 (1)3 秒后 (2)主线程空闲,同时满足时,才会 3 秒后执行该函数**

#### 例

```js
console.log("script start");

setTimeout(function () {
  console.log("setTimeout");
}, 0);

Promise.resolve()
  .then(function () {
    console.log("promise1");
  })
  .then(function () {
    console.log("promise2");
  });

console.log("script end");
```

答案

> 'script start'、'script end'、'promise1'、'promise2'、'setTimeout'
> 先走完所有同步代码-到 promise 微任务-宏任务 setTimeout

```js
setTimeout(function () {
  console.log("setTimeout");
}, 0);

new Promise(function (resolve) {
  console.log("promise");
  for (var i = 0; i < 10000; i++) {
    i == 9999 && resolve(i);
  }
}).then(function (num) {
  console.log("then" + num);
});

console.log("script end");
```

答案

> 'promise'、'script end'、'then9999'、'setTimeout'
> 先走完所有同步代码-到 promise 微任务-宏任务 setTimeout

## 深拷贝

在 JS 里，除 Array 和 Object 之外的数据类型的复制可以直接通过等号=来实现，但 Array 和 Object 类型的数据通过等号只是起引用作用，指向的是同一块内存地址。当源数据改变，引用的数据也同时会发生变化

### JSON.parse

将对象转换为 String 再转回对象

```js
JSON.parse(JSON.stringify(target));
```

- 如果 obj 里面有时间对象，则 JSON.stringify 后再 JSON.parse 的结果，时间将只是字符串的形式。而不是时间对象；
- 如果 obj 里有 RegExp、Error 对象，则序列化的结果将只得到空对象；
- 如果 obj 里有函数，undefined，则序列化的结果会把函数或 undefined 丢失；
- 如果 obj 里有 NaN、Infinity 和-Infinity，则序列化的结果会变成 null
- JSON.stringify()只能序列化对象的可枚举的自有属性，例如 如果 obj 中的对象是有构造函数生成的， 则使用 JSON.parse(JSON.stringify(obj))深拷贝后，会丢弃对象的 constructor；
- 如果对象中存在循环引用的情况也无法正确实现深拷贝；

### Object.assign

Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象分配到目标对象。它将返回目标对象

### 手动实现

```js
function deepCopy(obj) {
  let _obj = Array.isArray(obj) ? [] : {};
  for (let i in obj) {
    _obj[i] = typeof obj[i] === "object" ? deepCopy(obj[i]) : obj[i];
  }
  return _obj;
}
```

Object.assign 不是简单的深拷贝。查阅官方文档发现它 Object.assign 只对顶层属性做了赋值，完全没有继续做递归之类的把所有下一层的属性做深拷贝。

## 数组

### 方法

```js
// 以*作为分隔符，合成字符串
Array.join(*)

// 数组尾部增删
Array.push()
Array.pop()

// 数组头部增删
Array.shift() //删，返回该item
Array.unshift()
```

使用 delete 会在数组留下未定义的空洞。请使用 pop() 或 shift() 取而代之

```js
delete arr[2]; //不可取
```

片段处理

```js
Array.splice(2, 0, "Lemon", "Kiwi"); //返回删除项数组
第一个参数（2）定义了应添加新元素的位置（拼接）。
第二个参数（0）定义应删除多少元素。
其余参数（“Lemon”，“Kiwi”）定义要添加的新元素。

// 切出一段数组，返回新数组
Array.slice(startIndex, endIndex);

// 拼接数组，返回新数组
Array.concat(arr1,arr2...)
```

### 排序方法

```js
// 反转数组
Array.reverse()

// 排序
Array.sort()
// 自定义排序
Array.sort((a,b)=>{ retrun isTure})

// 例，Max
Math.max.apply(null, arr)//Math.max.apply([1, 2, 3]) 等于 Math.max(1, 2, 3)
```

### 迭代方法

```js
// 遍历
Array.forEach((item, index, arr) => {});
// 遍历 返回新数组
Array.map((item, index, arr) => {
  return newItem;
});
// 过滤 根据条件返回新数组
Array.filter((item, index, arr) => {
  return isTure;
});
// 汇总 prev：上一次执行的返回值，initValue：第二个参数接受初始值
Array.reduce((prev, item, index, arr) => {}, initValue);

// 全部通过测试 所有值是否满足条件
Array.every((item, index, arr) => {
  return isTure;
});
// 部分通过测试 存在值满足条件
Array.some((item, index, arr) => {
  return isTure;
});

// 寻找下标，start：寻找起始值，返回值-1表示找不到
Array.indexOf(item, start);
// 倒序寻找下标，start：寻找起始值
Array.indexOf(item, start);

// 寻找 与reduce相似，根据条件返回符合的第一个值
Array.find((item, index, arr) => {
  return isTure;
});
// 寻找 与reduce相似，根据条件返回符合的第一个值的索引
Array.findIndex((item, index, arr) => {
  return isTure;
});
```

### 注

#### for in 和 for of

for...in 循环主要是为了遍历对象而生，不适用于遍历数组

for...of 循环可以用来遍历数组、类数组对象，字符串、Set、Map 以及 Generator 对象

- for...in 循环：只能获得对象的键名，不能获得键值；for...of 循环：允许遍历获得键值
- 对于普通对象，没有部署原生的 iterator 接口，直接使用 for...of 会报错，可以使用 Object.keys(obj) 方法将对象的键名生成一个数组，然后遍历这个数组
- for...in 循环不仅遍历数字键名，还会遍历手动添加的其它键，甚至包括原型链上的键。

```js
let arr = [1, 2, 3];
arr.set = "world"; // 手动添加的键
Array.prototype.name = "hello"; // 原型链上的键

for (let item in arr) {
  console.log("item", item);
}

/*
  item 0
  item 1
  item 2
  item set
  item name
*/
```

- 无论是 for...in 还是 for...of 都不能遍历出 Symbol 类型的值，遍历 Symbol 类型的值需要用 Object.getOwnPropertySymbols() 方法

#### 去重

- 法一：indexOf循环去重 

- 法二：ES6 Set去重；Array.from(new Set(array)) 

- 法三：Object 键值对去重；把数组的值存成 Object 的 key 值，比如 Object[value1] = true，在判断另一个值的时候，如果 Object[value2]存在的话，就说明该值是重复的。 

## Map 和 Object

[参考](https://www.zhihu.com/people/ba-er-ba)

### 用法对比

1. 对于 Object 而言，它键（key）的类型只能是字符串，数字或者 Symbol；而对于 Map 而言，它可以是任何类型。（包括 Date，Map，或者自定义对象）
2. Map 中的元素会保持其插入时的顺序；而 Object 则不会完全保持插入时的顺序，而是根据如下规则进行排序:

- 非负整数会最先被列出，排序是从小到大的数字顺序
- 然后所有字符串，负整数，浮点数会被列出，顺序是根据插入的顺序
- 最后才会列出 Symbol，Symbol 也是根据插入的顺序进行排序的

1. 读取 Map 的长度很简单，只需要调用其 .size() 方法即可；而读取 Object 的长度则需要额外的计算： Object.keys(obj).length
2. Map 是可迭代对象，所以其中的键值对是可以通过 for of 循环或 .foreach() 方法来迭代的；而普通的对象键值对则默认是不可迭代的，只能通过 for in 循环来访问（或者使用 Object.keys(o)、Object.values(o)、Object.entries(o) 来取得表示键或值的数字）迭代时的顺序就是上面提到的顺序。

```
const o = {};
const m = new Map();
o[Symbol.iterator] !== undefined; // false
m[Symbol.iterator] !== undefined; // true 
```

1. 在 Map 中新增键时，不会覆盖其原型上的键；而在 Object 中新增键时，则有可能覆盖其原型上的键

```
Object.prototype.x = 1;
const o = {x:2};
const m = new Map([[x,2]]);
o.x; // 2，x = 1 被覆盖了
m.x; // 1，x = 1 不会被覆盖 
```

1. JSON 默认支持 Object 而不支持 Map。若想要通过 JSON 传输 Map 则需要使用到 .toJSON() 方法，然后在 JSON.parse() 中传入复原函数来将其复原。

```
const o = {x:1};
const m = new Map([['x', 1]]);
const o2 = JSON.parse(JSON.stringify(o)); // {x:1}
const m2 = JSON.parse(JSON.stringify(m)) // {}
```

### 性能对比

使用 Map：

- 储存的键不是字符串/数字/或者 Symbol 时，选择 Map，因为 Object 并不支持
- 储存大量的数据时，选择 Map，因为它占用的内存更小
- 需要进行许多新增/删除元素的操作时，选择 Map，因为速度更快
- 需要保持插入时的顺序的话，选择 Map，因为 Object 会改变排序
- 需要迭代/遍历的话，选择 Map，因为它默认是可迭代对象，迭代更为便捷

使用 Object：

- 只是简单的数据结构时，选择 Object，因为它在数据少的时候占用内存更少，且新建时更为高效
- 需要用到 JSON 进行文件传输时，选择 Object，因为 JSON 不默认支持 Map
- 需要对多个键值进行运算时，选择 Object，因为句法更为简洁
- 需要覆盖原型上的键时，选择 Object

虽然 Map 在很多情况下会比 Object 更为高效，不过 Object 永远是 JS 中最基本的引用类型，它的作用也不仅仅是为了储存键值对。

## 监听对象属性

比如在VUE中自动监听属性的变动，我们假设这里有一个user对象

### Object.defineProperty

在ES5中可以通过Object.defineProperty来实现已有属性的监听 （Vue 2.+）

```js
Object.defineProperty(user,'name',{
set：function(key,value){
}
})
```
缺点：如果id不在user对象中，则不能监听id的变化 

### Proxy

在ES6中可以通过Proxy来实现 （Vue 3.0）

```js
var  user = new Proxy({}，{
  set：function(target,key,value,receiver){}
})
```

这样即使有属性在user中不存在，通过user.id来定义也同样可以这样监听这个属性的变化哦~ 



## 定时任务

### setTimeout

### setInterval

### requestAnimationFrame

[参考requestAnimationFrame](http://www.cnblogs.com/xiaohuochai/p/5777186.html)

与setTimeout和setInterval不同，requestAnimationFrame不需要设置时间间隔，
大多数电脑显示器的刷新频率是60Hz，大概相当于每秒钟重绘60次。大多数浏览器都会对重绘操作加以限制，不超过显示器的重绘频率，因为即使超过那个频率用户体验也不会有提升。因此，最平滑动画的最佳循环间隔是1000ms/60，约等于16.6ms。 

RAF采用的是系统时间间隔，不会因为前面的任务，不会影响RAF，但是如果前面的任务多的话，
会响应setTimeout和setInterval真正运行时的时间间隔。 

特点：

1. requestAnimationFrame会把每一帧中的所有DOM操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率。 

2. 在隐藏或不可见的元素中，requestAnimationFrame将不会进行重绘或回流，这当然就意味着更少的CPU、GPU和内存使用量 
3. requestAnimationFrame是由浏览器专门为动画提供的API，在运行时浏览器会自动优化方法的调用，并且如果页面不是激活状态下的话，动画会自动暂停，有效节省了CPU开销。

### 类型判断
typeof()，instanceof，Object.prototype.toString.call()等

#### typeof

##### 基本类型

number：Number、NaN

string：String

boolean：Boolean

undefined：Undefined

symbol：Symbol（ES6）

##### 引用类型

object：Object、Array、null、自定义对象

function：Function

#### instanceof

#### Object.prototype.toString.call

对于 `Object.prototype.toString.call(arg)`，若参数为 `null` 或 `undefined`，直接返回结果。 

```js
Object.prototype.toString.call(null);       // => "[object Null]"

Object.prototype.toString.call(undefined);  // => "[object Undefined]"
```

若参数不为 `null` 或 `undefined`，则将参数转为对象，再作判断。对于原始类型，转为对象的方法即装箱，此处不赘述。

转为对象后，取得该对象的 `[Symbol.toStringTag]` 属性值（可能会遍历原型链）作为 `tag`，如无该属性，或该属性值不为字符串类型，则依下表取得 `tag`, 然后返回 `"[object " + tag + "]"` 形式的字符串。

## 闭包
一句话可以概括：闭包就是能够读取其他函数内部变量的函数，或者子函数在外调用，子函数所在的父函数的作用域不会被释放
```js
function test(){
	var user = "Tom";
	return function(){
		use(user);
		...
	}
}
```
### 什么是闭包
闭包是指有权访问另外一个函数作用域中的变量的函数。

MDN对闭包的定义是：闭包是指那些能够访问自由变量的函数，自由变量是指在函数中使用的，但既不是函数参数又不是函数的局部变量的变量，由此可以看出，闭包=函数+函数能够访问的自由变量

闭包就是函数的局部变量集合，只是这些局部变量在函数返回后会继续存在。闭包就是就是函数的“堆栈”在函数返回后并不释放，我们也可以理解为这些函数堆栈并不在栈上分配而是在堆上分配。当在一个函数内定义另外一个函数就会产生闭包。

### 为什么要用

- 匿名自执行函数：我们知道所有的变量，如果不加上var关键字，则默认的会添加到全局对象的属性上去，这样的临时变量加入全局对象有很多坏处，比如：别的函数可能误用这些变量；造成全局对象过于庞大，影响访问速度(因为变量的取值是需要从原型链上遍历的)。除了每次使用变量都是用var关键字外，我们在实际情况下经常遇到这样一种情况，即有的函数只需要执行一次，其内部变量无需维护，可以用闭包。
- 结果缓存：我们开发中会碰到很多情况，设想我们有一个处理过程很耗时的函数对象，每次调用都会花费很长时间，那么我们就需要将计算出来的值存储起来，当调用这个函数的时候，首先在缓存中查找，如果找不到，则进行计算，然后更新缓存并返回值，如果找到了，直接返回查找到的值即可。闭包正是可以做到这一点，因为它不会释放外部的引用，从而函数内部的值可以得以保留。
- 封装：封装私有变量，实现类和继承等。
- 模仿块级作用域

### 闭包案例
异步打印
```js
for(let i=0;i<5;i++){
  setTimeout(function(){
  	console.log(i)
  },1000*i)
}
```
闭包实现
```js
for(var i=0;i<5;i++){
  (function(i){
    setTimeout(function(){
    	console.log(i)
    },1000*i)
  })(i)
}
```

#####  实现一个once函数，传入函数参数只执行一次
```js
function ones(func){
  var tag=true;
  return function(){
    if(tag==true){
      func.apply(null,arguments);
      tag=false;
    }
  }
}
```

## 其他

#### 不支持冒泡事件

有：①focus

 ②blur

 ③mouseenter

 ④mouseleave

 ⑤load

 ⑥unload

 ⑦resize

**hasOwnProperty：** 是用来判断一个对象是否有你给出名称的属性或对象。不过需要注意的是，此方法无法检查该对象的原型链中是否具有该属性，该属性必须是对象本身的一个成员。

**isPrototypeOf :** 是用来判断要检查其原型链的对象是否存在于指定对象实例中，是则返回 true，否则返回 false。

#### 请求 Header

说一说常见的请求头和相应头 Header 都有什么呢？

1)请求(客户端->服务端[request])
GET(请求的方式) /newcoder/hello.html(请求的目标资源) HTTP/1.1(请求采用的协议和版本号)
Accept: _/_(客户端能接收的资源类型)
Accept-Language: en-us(客户端接收的语言类型)
Connection: Keep-Alive(维护客户端和服务端的连接关系)
Host: localhost:8080(连接的目标主机和端口号)
Referer: http://localhost/links.asp(告诉服务器我来自于哪里)
User-Agent: Mozilla/4.0(客户端版本号的名字)
Accept-Encoding: gzip, deflate(客户端能接收的压缩数据的类型)
If-Modified-Since: Tue, 11 Jul 2000 18:23:51 GMT(缓存时间)
Cookie(客户端暂存服务端的信息)

Date: Tue, 11 Jul 2000 18:23:51 GMT(客户端请求服务端的时间)

2)响应(服务端->客户端[response])
HTTP/1.1(响应采用的协议和版本号) 200(状态码) OK(描述信息)
Location: http://www.baidu.com(服务端需要客户端访问的页面路径)
Server:apache tomcat(服务端的 Web 服务端名)
Content-Encoding: gzip(服务端能够发送压缩编码类型)
Content-Length: 80(服务端发送的压缩数据的长度)
Content-Language: zh-cn(服务端发送的语言类型)
Content-Type: text/html; charset=GB2312(服务端发送的类型及采用的编码方式)
Last-Modified: Tue, 11 Jul 2000 18:23:51 GMT(服务端对该资源最后修改的时间)
Refresh: 1;url=http://www.it315.org(服务端要求客户端1秒钟后，刷新，然后访问指定的页面路径)
Content-Disposition: attachment; filename=aaa.zip(服务端要求客户端以下载文件的方式打开该文件)
Transfer-Encoding: chunked(分块传递数据到客户端）  
 Set-Cookie:SS=Q0=5Lb*nQ; path=/search(服务端发送到客户端的暂存数据)
Expires: -1//3 种(服务端禁止客户端缓存页面数据)
Cache-Control: no-\*\**(服务端禁止客户端缓存页面数据)  
 Pragma: no-\_\*\*(服务端禁止客户端缓存页面数据)  
 Connection: close(1.0)/(1.1)Keep-Alive(维护客户端和服务端的连接关系)

Date: Tue, 11 Jul 2000 18:23:51 GMT(服务端响应客户端的时间)

**在服务器响应客户端的时候，带上 Access-Control-Allow-Origin 头信息，解决跨域的一种方法。**

#### JS 全局函数

函数 描述

decodeURI() 解码某个编码的 URI。

decodeURIComponent() 解码一个编码的 URI 组件。

encodeURI() 把字符串编码为 URI。

encodeURIComponent() 把字符串编码为 URI 组件。

escape() 对字符串进行编码。

eval() 计算 JavaScript 字符串，并把它作为脚本代码来执行。

isFinite() 检查某个值是否为有穷大的数。

isNaN() 检查某个值是否是数字。

Number() 把对象的值转换为数字。

parseFloat() 解析一个字符串并返回一个浮点数。

parseInt() 解析一个字符串并返回一个整数。

String() 把对象的值转换为字符串。

unescape() 对由 escape() 编码的字符串进行解码

### 案例

#### 数组扁平化

数组扁平化处理：实现一个 flatten 方法，使得输入一个数组，该数组里面的元素也可以是数组，该方法会输出一个扁平化的数组

```js
// Example
let givenArr = [
  [1, 2, 2],
  [3, 4, 5, 5],
  [6, 7, 8, 9, [11, 12, [12, 13, [14]]]],
  10,
];
let outputArr = [1, 2, 2, 3, 4, 5, 5, 6, 7, 8, 9, 11, 12, 12, 13, 14, 10];
// 实现flatten方法使得flatten(givenArr)——>outputArr
```

1.递归

```js
const flatten = (arr) => {
  let ans = [];
  arr.forEach((element) => {
    if (element instanceof Array) {
      ans = ans.concat(flatten(element));
    } else {
      ans.push(element);
    }
  });
  return ans;
};
```

2.Array.reduce

```js
const flatten = (arr) => {
  return arr.reduce((prev, item) => {
    return prev.concat(item instanceof Array ? flatten(item) : item);
  }, []); //默认以空数组开始汇总
};
```

3.扩展运算符

```js
const flatten = (arr) => {
  while (arr.some((item) => item instanceof Array)) {
    arr = [].concat(...arr);
  }
  return arr;
};

//arr = [].concat(...arr)等价于
for (const iterator of arr) {
  arr = arr.concat(iterator);
}
```

#### 数组求子集
假设数组长度为n，[1,2,3,...,n]
那么所有子集则为长度为n的000...000到长度为n的111...111
```js
const subsets =  (nums) => {
  let res = [];
  let len = nums.length;
  //假设len为6
  //1左移len位:1000000，即遍历000000到111111
  for (let i = 0; i < 1 << len; i++) {
    //临时子集
    let arr = [];
    
    //方案1:转换为2进制字符串，再分割为数组，如：['1','0','1','0']
    let flag = i.toString(2).split("");
    flag.forEach((item, index) => {
    	//'1'则表示加入子集，flag.length - 1 - index获取数组下标
      item === '1' && arr.push(nums[flag.length - 1 - index]);
    });
    
    //方案2:2进制数字分别与第n位做与运算，获取2进制数字中1的位置
    for (let j = 0; j < len; j++) {
      //获取到i，如：001010，分别与j的二进制（如：000001，000010）做与运算，获取原数组下标
      if (i & (1 << j)) arr.push(nums[j]);
    }
    
    //子集加入res
    res.push(arr);
  }
  return res;
};

console.log(subsets([1, 2, 3, 4, 5, 6]));
```

#### 字符串全排列
使用set去重
```js
function permutate(str) {
  let result = new Set();
  if (str.length > 1) {
    for (let index = 0; index < str.length; index++) {
      let left = str[index]; //取首位
      let rest = str.slice(0, index) + str.slice(index + 1); //剩余
      let preResult = permutate(rest); //返回剩余排列的数组
      preResult.forEach((item, index) => {
        result.add(left + item);
        result.add(item + left);
      });
    }
    return Array.from(result);
  } else {
    return [str];
  }
}

console.log(permutate("ABCD"));
```