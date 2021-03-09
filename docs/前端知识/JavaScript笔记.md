## 数字
### 格式化数字
2. 1. parseFloat 解析一个字符串，并返回一个浮点数
2. toFixed 把数字转换为字符串，结果的小数点后有指定位数的数字
3. Math.round 把一个数字舍入为最接近的整数
4. toPrecision 把数字格式化为指定的长度

```js
// parseFloat(),解析一个字符串，并返回一个浮点数。
// toFixed把数字转换为字符，结果的小数点后有指定位数的数字,按四舍五入取值
var num = new Number(15.7857);
var a = num.toFixed(); //16 无参数，表示小数点后面位数为0位，然后四舍五入
var b = num.toFixed(1);//15.8
var c = num.toFixed(3);//15.786
var d = num.toFixed(10);  //多出的补0
 
//toPrecision()把数字格式化为指定长度
var f = num.toPrecision();//15.7857，无参数，返回原数字
var g = num.toPrecision(1);//2e+1，参数小于整数部分位数，返回科学计数
var h = num.toPrecision(3);//15.8，也是有四舍五入
var i = num.toPrecision(10);//15.78570000，长度不够补0
```
### 随机数
```js
Math.ceil(Math.random()*10);     // 获取从 1 到 10 的随机整数，取 0 的概率极小。

Math.round(Math.random());       // 可均衡获取 0 到 1 的随机整数。

Math.floor(Math.random()*10);    // 可均衡获取 0 到 9 的随机整数。

Math.round(Math.random()*10);    // 基本均衡获取 0 到 10 的随机整数，其中获取最小值 0 和最大值 10 的几率少一半。
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

 

4四舍五入

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
function getCountDays(){
   var curDate = new Date();
   // 获取当前月份
   var curMonth = curDate.getMonth();
   // 实际月份比curMonth大1，下面将月份设置为下一个月
   curDate.setMonth(curMonth+1);
   // 将日期设置为0，表示自动计算为上个月（这里指的是当前月份）的最后一天
   curDate.setDate(0);
   // 返回当前月份的天数
   return curDate.getDate();
}
getCountDays();


// 第二种方式
// 计算当前月份有多少天
function getCountDays(){
   var curDate = new Date();
   // 获取当前月份
   var curMonth = curDate.getMonth();
   // 将日期设置为32，表示自动计算为下个月的第几天（这取决于当前月份有多少天）
   curDate.setDate(32);
   // 返回当前月份的天数
   return 32-curDate.getDate();
}
getCountDays();

// 计算指定月份 天数
function GetDays(year, month){
   var d = new Date(year, month, 0);
   return d.getDate();
}
```







## Promise
### promise构造函数

规范没有指明如何书写构造函数，那就参考ES6的构造方式：

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

- 一个promise可能有三种状态：等待（pending）、已完成（fulfilled）、已拒绝（rejected）
- 一个promise的状态只可能从“等待”转到“完成”态或者“拒绝”态，不能逆向转换，同时“完成”态和“拒绝”态不能相互转换
- promise必须实现then方法（可以说，then就是promise的核心），而且then必须返回一个promise，同一个promise的then可以调用多次，并且回调的执行顺序跟它们被定义时的顺序一致
- then方法接受两个参数，第一个参数是成功时的回调，在promise由“等待”态转换到“完成”态时调用，另一个是失败时的回调，在promise由“等待”态转换到“拒绝”态时调用。同时，then可以接受另一个promise传入，也接受一个“类then”的对象或方法，即thenable对象。

#### 基本功能

```js
//Promise 的三种状态  (满足要求 -> Promise的状态)
const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

class MyPromise {
  constructor(fn) {
    //当前状态
    this.state = PENDING;
    //终值:FULFILLED状态
    this.value = null;
    //拒因:REJECTED状态
    this.reason = null;
    //成功态回调队列
    this.onFulfilledCallbacks = [];
    //拒绝态回调队列
    this.onRejectedCallbacks = [];

    //成功态回调
    const resolve = (value) => {
      // 使用macro-task机制(setTimeout),确保onFulfilled异步执行,且在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。
      setTimeout(() => {
        if (this.state === PENDING) {
          // pending(等待态)迁移至 fulfilled(执行态),保证调用次数不超过一次。
          this.state = FULFILLED;
          // 终值
          this.value = value;
          this.onFulfilledCallbacks.map((cb) => {
            this.value = cb(this.value);
          });
        }
      });
    };
    //拒绝态回调
    const reject = (reason) => {
      // 使用macro-task机制(setTimeout),确保onRejected异步执行,且在 then 方法被调用的那一轮事件循环之后的新执行栈中执行。 (满足要求 -> 调用时机)
      setTimeout(() => {
        if (this.state === PENDING) {
          // pending(等待态)迁移至 fulfilled(拒绝态),保证调用次数不超过一次。
          this.state = REJECTED;
          //拒因
          this.reason = reason;
          this.onRejectedCallbacks.map((cb) => {
            this.reason = cb(this.reason);
          });
        }
      });
    };
    try {
      //执行promise
      fn(resolve, reject);
    } catch (e) {
      reject(e);
    }
  }
  //因回调使用setTimeout任务，所以then回调函数数组push，在执行回调函数之前
  then(onFulfilled, onRejected) {
    typeof onFulfilled === "function" &&
      this.onFulfilledCallbacks.push(onFulfilled);
    typeof onRejected === "function" &&
      this.onRejectedCallbacks.push(onRejected);
    // 返回this支持then 方法可以被同一个 promise 调用多次
    return this;
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

#### [符合Promise/A+要求](https://juejin.cn/post/6844903763178684430)

[完整代码](https://github.com/webfansplz/article/tree/master/ajPromise)

```js

const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

class AjPromise {
  constructor(fn) {
    this.state = PENDING;
    this.value = null;
    this.reason = null;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    const resolve = value => {
      if (value instanceof Promise) {
        return value.then(resolve, reject);
      }
      setTimeout(() => {
        if (this.state === PENDING) {
          this.state = FULFILLED;
          this.value = value;
          this.onFulfilledCallbacks.map(cb => {
            cb = cb(this.value);
          });
        }
      });
    };
    const reject = reason => {
      setTimeout(() => {
        if (this.state === PENDING) {
          this.state = REJECTED;
          this.reason = reason;
          this.onRejectedCallbacks.map(cb => {
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

    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected =
      typeof onRejected === 'function'
        ? onRejected
        : reason => {
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
        this.onFulfilledCallbacks.push(value => {
          try {
            let x = onFulfilled(value);
            resolvePromise(newPromise, x, resolve, reject);
          } catch (e) {
            reject(e);
          }
        });
        this.onRejectedCallbacks.push(reason => {
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
    reject(new TypeError('循环引用'));
  }
  if (x instanceof AjPromise) {
    if (x.state === PENDING) {
      x.then(
        y => {
          resolvePromise(promise2, y, resolve, reject);
        },
        reason => {
          reject(reason);
        }
      );
    } else {
      x.then(resolve, reject);
    }
  } else if (x && (typeof x === 'function' || typeof x === 'object')) {
    let called = false;
    try {
      let then = x.then;
      if (typeof then === 'function') {
        then.call(
          x,
          y => {
            if (called) return;
            called = true;
            resolvePromise(promise2, y, resolve, reject);
          },
          r => {
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

AjPromise.deferred = function() {
  let defer = {};
  defer.promise = new AjPromise((resolve, reject) => {
    defer.resolve = resolve;
    defer.reject = reject;
  });
  return defer;
};

module.exports = AjPromise;
```

## [事件委托](https://www.cnblogs.com/liugang-vip/p/5616484.html)



### 概述

那什么叫事件委托呢？它还有一个名字叫事件代理，JavaScript高级程序设计上讲：事件委托就是利用事件冒泡，只指定一个事件处理程序，就可以管理某一类型的所有事件。那这是什么意思呢？网上的各位大牛们讲事件委托基本上都用了同一个例子，就是取快递来解释这个现象，我仔细揣摩了一下，这个例子还真是恰当，我就不去想别的例子来解释了，借花献佛，我摘过来，大家认真领会一下事件委托到底是一个什么原理：

有三个同事预计会在周一收到快递。为签收快递，有两种办法：一是三个人在公司门口等快递；二是委托给前台MM代为签收。现实当中，我们大都采用委托的方案（公司也不会容忍那么多员工站在门口就为了等快递）。前台MM收到快递后，她会判断收件人是谁，然后按照收件人的要求签收，甚至代为付款。这种方案还有一个优势，那就是即使公司里来了新员工（不管多少），前台MM也会在收到寄给新员工的快递后核实并代为签收。

这里其实还有2层意思的：

第一，现在委托前台的同事是可以代为签收的，即程序中的现有的dom节点是有事件的；

第二，新员工也是可以被前台MM代为签收的，即程序中新添加的dom节点也是有事件的。

为什么要用事件委托：

一般来说，dom需要有事件处理程序，我们都会直接给它设事件处理程序就好了，那如果是很多的dom需要添加事件处理呢？比如我们有100个li，每个li都有相同的click点击事件，可能我们会用for循环的方法，来遍历所有的li，然后给它们添加事件，那这么做会存在什么影响呢？

在JavaScript中，添加到页面上的事件处理程序数量将直接关系到页面的整体运行性能，因为需要不断的与dom节点进行交互，访问dom的次数越多，引起浏览器重绘与重排的次数也就越多，就会延长整个页面的交互就绪时间，这就是为什么性能优化的主要思想之一就是减少DOM操作的原因；如果要用事件委托，就会将所有的操作放到js程序里面，与dom的操作就只需要交互一次，这样就能大大的减少与dom的交互次数，提高性能；

每个函数都是一个对象，是对象就会占用内存，对象越多，内存占用率就越大，自然性能就越差了（内存不够用，是硬伤，哈哈），比如上面的100个li，就要占用100个内存空间，如果是1000个，10000个呢，那只能说呵呵了，如果用事件委托，那么我们就可以只对它的父级（如果只有一个父级）这一个对象进行操作，这样我们就需要一个内存空间就够了，是不是省了很多，自然性能就会更好。

### 原理

事件委托是利用事件的冒泡原理来实现的，何为事件冒泡呢？就是事件从最深的节点开始，然后逐步向上传播事件，举个例子：页面上有这么一个节点树，div>ul>li>a;比如给最里面的a加一个click点击事件，那么这个事件就会一层一层的往外执行，执行顺序a>li>ul>div，有这样一个机制，那么我们给最外面的div加点击事件，那么里面的ul，li，a做点击事件的时候，都会冒泡到最外层的div上，所以都会触发，这就是事件委托，委托它们父级代为执行事件`event`。

而通过`event.target`也能获取到深层触发该事件的节点，而不用为每一个节点添加Dom事件。

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

实现功能是点击li，弹出123：
```js
window.onload = function(){
    var oUl = document.getElementById("ul1");
    var aLi = oUl.getElementsByTagName('li');
    for(var i=0;i<aLi.length;i++){
        aLi[i].onclick = function(){
            alert(123);
        }
    }
}
```
 上面的代码的意思很简单，相信很多人都是这么实现的，我们看看有多少次的dom操作，首先要找到ul，然后遍历li，然后点击li的时候，又要找一次目标的li的位置，才能执行最后的操作，每次点击都要找一次li；

那么我们用事件委托的方式做又会怎么样呢？

```js
window.onload = function(){
    var oUl = document.getElementById("ul1");
   oUl.onclick = function(){
        alert(123);
    }
}
```
这里用父级ul做事件处理，当li被点击时，由于冒泡原理，事件就会冒泡到ul上，因为ul上有点击事件，所以事件就会触发，当然，这里当点击ul的时候，也是会触发的，那么问题就来了，如果我想让事件代理的效果跟直接给节点的事件效果一样怎么办，比如说只有点击li才会触发，不怕，我们有绝招：

Event对象提供了一个属性叫target，可以返回事件的目标节点，我们成为事件源，也就是说，target就可以表示为当前的事件操作的dom，但是不是真正操作dom，当然，这个是有兼容性的，标准浏览器用ev.target，IE浏览器用event.srcElement，此时只是获取了当前节点的位置，并不知道是什么节点名称，这里我们用nodeName来获取具体是什么标签名，这个返回的是一个大写的，我们需要转成小写再做比较（习惯问题）：

```js
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
```
```js
window.onload = function(){
            var Add = document.getElementById("add");
            var Remove = document.getElementById("remove");
            var Move = document.getElementById("move");
            var Select = document.getElementById("select");
            
            Add.onclick = function(){
                alert('添加');
            };
            Remove.onclick = function(){
                alert('删除');
            };
            Move.onclick = function(){
                alert('移动');
            };
            Select.onclick = function(){
                alert('选择');
            }
            
        }
```
上面实现的效果我就不多说了，很简单，4个按钮，点击每一个做不同的操作，那么至少需要4次dom操作，如果用事件委托，能进行优化吗？
```js
window.onload = function(){
            var oBox = document.getElementById("box");
            oBox.onclick = function (ev) {
                var ev = ev || window.event;
                var target = ev.target || ev.srcElement;
                if(target.nodeName.toLocaleLowerCase() == 'input'){
                    switch(target.id){
                        case 'add' :
                            alert('添加');
                            break;
                        case 'remove' :
                            alert('删除');
                            break;
                        case 'move' :
                            alert('移动');
                            break;
                        case 'select' :
                            alert('选择');
                            break;
                    }
                }
            }
            
        }
```
	用事件委托就可以只用一次dom操作就能完成所有的效果，比上面的性能肯定是要好一些的 

   现在讲的都是document加载完成的现有dom节点下的操作，那么如果是新增的节点，新增的节点会有事件吗？也就是说，一个新员工来了，他能收到快递吗？

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

现在是移入li，li变红，移出li，li变白，这么一个效果，然后点击按钮，可以向ul中添加一个li子节点
```js
window.onload = function(){
            var oBtn = document.getElementById("btn");
            var oUl = document.getElementById("ul1");
            var aLi = oUl.getElementsByTagName('li');
            var num = 4;
            
            //鼠标移入变红，移出变白
            for(var i=0; i<aLi.length;i++){
                aLi[i].onmouseover = function(){
                    this.style.background = 'red';
                };
                aLi[i].onmouseout = function(){
                    this.style.background = '#fff';
                }
            }
            //添加新节点
            oBtn.onclick = function(){
                num++;
                var oLi = document.createElement('li');
                oLi.innerHTML = 111*num;
                oUl.appendChild(oLi);
            };
        }
```
这是一般的做法，但是你会发现，新增的li是没有事件的，说明添加子节点的时候，事件没有一起添加进去，这不是我们想要的结果，那怎么做呢？一般的解决方案会是这样，将for循环用一个函数包起来，命名为mHover，如下：
```js
window.onload = function(){
            var oBtn = document.getElementById("btn");
            var oUl = document.getElementById("ul1");
            var aLi = oUl.getElementsByTagName('li');
            var num = 4;
            
            function mHover () {
                //鼠标移入变红，移出变白
                for(var i=0; i<aLi.length;i++){
                    aLi[i].onmouseover = function(){
                        this.style.background = 'red';
                    };
                    aLi[i].onmouseout = function(){
                        this.style.background = '#fff';
                    }
                }
            }
            mHover ();
            //添加新节点
            oBtn.onclick = function(){
                num++;
                var oLi = document.createElement('li');
                oLi.innerHTML = 111*num;
                oUl.appendChild(oLi);
                mHover ();
            };
        }
```
虽然功能实现了，看着还挺好，但实际上无疑是又增加了一个dom操作，在优化性能方面是不可取的，那么有事件委托的方式，能做到优化吗？
```js
window.onload = function(){
            var oBtn = document.getElementById("btn");
            var oUl = document.getElementById("ul1");
            var aLi = oUl.getElementsByTagName('li');
            var num = 4;
            
            //事件委托，添加的子元素也有事件
            oUl.onmouseover = function(ev){
                var ev = ev || window.event;
                var target = ev.target || ev.srcElement;
                if(target.nodeName.toLowerCase() == 'li'){
                    target.style.background = "red";
                }
                
            };
            oUl.onmouseout = function(ev){
                var ev = ev || window.event;
                var target = ev.target || ev.srcElement;
                if(target.nodeName.toLowerCase() == 'li'){
                    target.style.background = "#fff";
                }
                
            };
            
            //添加新节点
            oBtn.onclick = function(){
                num++;
                var oLi = document.createElement('li');
                oLi.innerHTML = 111*num;
                oUl.appendChild(oLi);
            };
        }
```

看，上面是用事件委托的方式，新添加的子元素是带有事件效果的，我们可以发现，当用事件委托的时候，根本就不需要去遍历元素的子节点，只需要给父级元素添加事件就好了，其他的都是在js里面的执行，这样可以大大的减少dom操作，这才是事件委托的精髓所在。

### 例
如上列表，有4个li，里面的内容各不相同，点击li，event对象肯定是当前点击的对象，怎么指定到li上，下面我直接给解决方案：

```js
　　var oUl = document.getElementById('test');
    oUl.addEventListener('click',function(ev){
        var target = ev.target;
        while(target !== oUl ){
            if(target.tagName.toLowerCase() == 'li'){
                console.log('li click~');
                break;
            }
            target = target.parentNode;
        }
    })
```
	核心代码是while循环部分，实际上就是一个递归调用，你也可以写成一个函数，用递归的方法来调用，同时用到冒泡的原理，从里往外冒泡，知道currentTarget为止，当当前的target是li的时候，就可以执行对应的事件了，然后终止循环，恩，没毛病！

### 总结

那什么样的事件可以用事件委托，什么样的事件不可以用呢？

适合用事件委托的事件：click，mousedown，mouseup，keydown，keyup，keypress。

值得注意的是，mouseover和mouseout虽然也有事件冒泡，但是处理它们的时候需要特别的注意，因为需要经常计算它们的位置，处理起来不太容易。

不适合的就有很多了，举个例子，mousemove，每次都要计算它的位置，非常不好把控，在不如说focus，blur之类的，本身就没用冒泡的特性，自然就不能用事件委托了。

好了，今天就到这里，下次我想介绍一下事件绑定，欢迎大家关注和阅读，以上纯属个人见解，如有不对的地方，万望指正，不胜感谢！

## 原型链

### js原型遵循5个规则

1、所有的引用类型（数组、对象、函数），都具有对象特性，即可自由扩展属性（除了“null”以外）； 

2、所有的引用类型（数组、对象、函数），都有一个__proto__（隐式原型）属性，属性值是一个普通的对象； 

3、所有的函数，都有一个prototype（显式原型）属性，属性值也是一个普通对象； 

4、所有的引用类型（数组、对象、函数），__proto__属性值指向（完全相等）它的构造函数的“prototype”属性值；

 5、当试图得到一个对象的某个属性时，如果这个对象本身没有这个属性，那么会去__proto__（即它的构造函数的prototype中）寻找。



有一个类如下：

```js
function Person(name) {
    this.name = name
}
let p = new Person('Tom');
```

1. `p.__proto__`等于什么？

**答案：**
Person.prototype

2. `Person.__proto__`等于什么？

**答案：**
Function.prototype

**解析：**

1，2两问其实问的是同一个问题，都是考察原型链相关的知识，我们只需要记住一句话就可以迎刃而解。实例的**proto**属性（原型）等于其构造函数的prototype属性。实例p的构造函数为Person，而Person的构造函数为Function

### new

>1. 创建一个新对象，同时继承对象类的原型，即Person.prototype；
>
>2. 执行对象类的构造函数，同时该实例的属性和方法被this所引用，即this指向新构造的实例；
>
>3. 如果构造函数return了一个新的“对象”，那么这个对象就会取代整个new出来的结果。如果构造函数没有return对象，那么就会返回步骤1所创建的对象，即隐式返回this。（一般情况下构造函数不会返回任何值，不过在一些特殊情况下，如果用户想覆盖这个值，可以选择返回一个普通的对象来覆盖。）

代码实现

```js
// let p = new Person();
let p = (function () {
    let obj = {};
    obj.__proto__ = Person.prototype;    
// 其他赋值语句...    
return obj;
})();
```

### instanceof

x会一直沿着隐式原型链**proto**向上查找直到`x.__proto__.__proto__......===y.prototype`为止，如果找到则返回true，也就是x为y的一个实例。否则返回false，x不是y的实例

```js
while(x.__proto__!==null) {
    if(x.__proto__===y.prototype) {
        return true;
        break;
    }
    x.__proto__ = x.__proto__.proto__;
}
if(x.__proto__==null) {
    return false;
}
```

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
delete arr[2] //不可取
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
Array.forEach((item,index,arr)=>{})
// 遍历 返回新数组
Array.map((item,index,arr)=>{return newItem})
// 过滤 根据条件返回新数组
Array.filter((item,index,arr)=>{return isTure})
// 汇总 prev：上一次执行的返回值，initValue：第二个参数接受初始值
Array.reduce((prev,item,index,arr)=>{},initValue)

// 全部通过测试 所有值是否满足条件
Array.every((item,index,arr)=>{return isTure})
// 部分通过测试 存在值满足条件
Array.some((item,index,arr)=>{return isTure})

// 寻找下标，start：寻找起始值，返回值-1表示找不到
Array.indexOf(item,start)
// 倒序寻找下标，start：寻找起始值
Array.indexOf(item,start)

// 寻找 与reduce相似，根据条件返回符合的第一个值
Array.find((item,index,arr)=>{return isTure})
// 寻找 与reduce相似，根据条件返回符合的第一个值的索引
Array.findIndex((item,index,arr)=>{return isTure})
```

### for in 和 for of
for...in 循环主要是为了遍历对象而生，不适用于遍历数组

for...of 循环可以用来遍历数组、类数组对象，字符串、Set、Map 以及 Generator 对象

- for...in 循环：只能获得对象的键名，不能获得键值；for...of 循环：允许遍历获得键值
- 对于普通对象，没有部署原生的 iterator 接口，直接使用 for...of 会报错，可以使用 Object.keys(obj) 方法将对象的键名生成一个数组，然后遍历这个数组
- for...in 循环不仅遍历数字键名，还会遍历手动添加的其它键，甚至包括原型链上的键。
```js
let arr = [1, 2, 3]
arr.set = 'world'  // 手动添加的键
Array.prototype.name = 'hello'  // 原型链上的键
 
for(let item in arr) {
  console.log('item', item)
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


## 其他

![img](https://uploadfiles.nowcoder.com/images/20190903/8018242_1567479495575_D3936A1FC6EBC59323A9A311B6076ABF)



#### 不支持冒泡事件

有：①focus

​    ②blur

​    ③mouseenter

​    ④mouseleave

​    ⑤load

​    ⑥unload

​    ⑦resize

**hasOwnProperty：** 是用来判断一个对象是否有你给出名称的属性或对象。不过需要注意的是，此方法无法检查该对象的原型链中是否具有该属性，该属性必须是对象本身的一个成员。

**isPrototypeOf :** 是用来判断要检查其原型链的对象是否存在于指定对象实例中，是则返回true，否则返回false。

#### 请求Header

说一说常见的请求头和相应头Header都有什么呢？

1)请求(客户端->服务端[request])
  GET(请求的方式) /newcoder/hello.html(请求的目标资源) HTTP/1.1(请求采用的协议和版本号)
  Accept: */*(客户端能接收的资源类型)
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
  Server:apache tomcat(服务端的Web服务端名)
  Content-Encoding: gzip(服务端能够发送压缩编码类型) 
  Content-Length: 80(服务端发送的压缩数据的长度) 
  Content-Language: zh-cn(服务端发送的语言类型) 
  Content-Type: text/html; charset=GB2312(服务端发送的类型及采用的编码方式)
  Last-Modified: Tue, 11 Jul 2000 18:23:51 GMT(服务端对该资源最后修改的时间)
  Refresh: 1;url=http://www.it315.org(服务端要求客户端1秒钟后，刷新，然后访问指定的页面路径)
  Content-Disposition: attachment; filename=aaa.zip(服务端要求客户端以下载文件的方式打开该文件)
  Transfer-Encoding: chunked(分块传递数据到客户端）  
  Set-Cookie:SS=Q0=5Lb_nQ; path=/search(服务端发送到客户端的暂存数据)
  Expires: -1//3种(服务端禁止客户端缓存页面数据)
  Cache-Control: no-***(服务端禁止客户端缓存页面数据)  
  Pragma: no-***(服务端禁止客户端缓存页面数据)  
  Connection: close(1.0)/(1.1)Keep-Alive(维护客户端和服务端的连接关系)  

  Date: Tue, 11 Jul 2000 18:23:51 GMT(服务端响应客户端的时间)

**在服务器响应客户端的时候，带上Access-Control-Allow-Origin头信息，解决跨域的一种方法。**

#### JS全局函数

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

#### 数组扁平化

数组扁平化处理：实现一个flatten方法，使得输入一个数组，该数组里面的元素也可以是数组，该方法会输出一个扁平化的数组

```js
// Example
let givenArr = [[1, 2, 2], [3, 4, 5, 5], [6, 7, 8, 9, [11, 12, [12, 13, [14]]]], 10];
let outputArr = [1,2,2,3,4,5,5,6,7,8,9,11,12,12,13,14,10]
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
  }, []);//默认以空数组开始汇总
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

