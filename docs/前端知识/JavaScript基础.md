## 基本概念

### 语法

#### 标识符

- 第一个字符：字母、下划线_、美元$
- 其他字符：字母、下划线、美元、数字
- 驼峰命名：myCar

#### 注释

- //单行
- /* 多行 */

#### 语句分号

- 避免代码编写错误
- 删除空格来压缩JS代码
- 增进代码性能（解析器不必花时间推测哪里插入分号）

### 关键字和保留字

\* 标记的关键字是 ECMAScript5 中新添加的

|          |           |            |           |              |
| -------- | --------- | ---------- | --------- | ------------ |
| abstract | arguments | boolean    | break     | byte         |
| case     | catch     | char       | class*    | const        |
| continue | debugger  | default    | delete    | do           |
| double   | else      | enum*      | eval      | export*      |
| extends* | false     | final      | finally   | float        |
| for      | function  | goto       | if        | implements   |
| import*  | in        | instanceof | int       | interface    |
| let      | long      | native     | new       | null         |
| package  | private   | protected  | public    | return       |
| short    | static    | super*     | switch    | synchronized |
| this     | throw     | throws     | transient | true         |
| try      | typeof    | var        | void      | volatile     |
| while    | with      | yield      |           |              |


### 数据类型

#### typeof操作符

- ECMAScript是松散类型的
- 返回字符串："undefined","boolean","string","number","object","function"
- 对于尚未声明过的变量，只能执行一项操作：typeof操作符检测其数据类型

#### Undefined

主要目的用于比较，区分空对象指针（null）和未初始化的变量（undefined）

#### Null

```js
alert(null == undefined)
```

undefined是派生自null值的

#### Boolean类型

- if("false")
- if(3)
- if(Number("aa"))
- var a = new Persion;
  if(a)
- if(undefined)

TTFTF

#### Number类型

- 浮点计算误差：基于IEEE754数值浮点计算通病；
- 判断数字isNaN()或者转数字Number()等方法作用于对象时，先执行对象valueOf()方法，无效则继续使用toString()方法；
- 转数值类型方法：Number、parseInt、parseFloat

#### String类型
- \xnn nn表示一个字符，\xnnnn nnnn表示一个Unicode字符
- text.length length属性获取字符长度
- 字符串是不可变的，字符串拼接会生成新字符串并销毁过程字符串
- toString()：数值、布尔、对象、字符串 都有toString()方法（null和undefined没有）
- String()：转型函数，一般调用toString()方法，null和undefined会转为字面量"null","undefined"

#### Object类型
var o = new Object();
- constructor:构造函数，就是Object()
- Object是所有对象基础

### 操作符

#### 一元操作符
##### 前置和后置
前置：变量的增减操作在其语句被求值之前；
后置：变量的增减操作在其语句被求值之前；

```js
let num = 5;
let anotherNum = --num + 5;
// num = num - 1
// anotherNum = num + 5 => 9

let num2 = 5;
let anotherNum2 = num2-- + 5;
// anotherNum2 = num2 + 5 => 10
// num = num - 1
```

##### 位操作符
```js
// 按位非NOT
~num === -num -1
// 按位与AND
25&3 === 1
// 按位或OR
25|3 === 27
// 按位异或XOR
25^3 === 26
// 左移
2<<5 === 2 * 2^5
// 右移
64>>5 === 64 / 2^5
// 无符号右移，左侧补0
-64>>>5 === 134217726
```
##### 加性操作符
- 字符串则拼接
- 有一个字符串，其他是对象、数值、布尔等都将调用toString()/String()方法转字符串后拼接
##### 关系操作符
- 数值则比较大小
- 字符串则比编码值
- 有一个操作数是数值，则Number()转型另一个操作数
- 有一个是对象则valueOf()/toString()
- true>false

#### 语句
##### with语句
将代码的作用域设置到一个特定的对象中
```js
var qs = location.search.list[1];
var url = location.href;
//等价于
with(location){
    var qs = search.list[1];
    var url = href;
}
```
性能下降；代码调试困难
##### switch语句
switch语句比较使用的是===，不会发生类型转换

#### 函数
```js
function add(num1,num2){
	arguments[1]=10;
	alert(arguments[0]+num2);
}
add(5,15);
add(5);
```
- 可以通过arguments对象来访问参数数组，函数本身不支持重载，但通过arguments.length区别来完成简单的重载功能
- arguments对象不是数组实例，arguments[]值与参数的内存空间是独立的，但他们的值会同步
- arguments对象的长度是由参数个数决定的，不是定义函数时决定的
- 没有传递值的命名参数将被自动赋予undefined值
```js
//15
//NaN
```



## 变量和作用域

### 基本类型和引用类型的值

- 基本类型：Undefined、Null、Boolean、String、Number（基本类型值在内存中占据固定大小的空间，因此被保存在栈内存中）
- 引用类型：多个值构成的对象（引用类型的值是保存在内存中的对象，保存在堆内存中，JS不允许直接访问内存中的位置，所以操作对象时，实际上是在操作其引用）
- 基本类型的复制是创建一个新的变量，并复制值的副本，互不影响；引用类型的复制同样会复制一遍原对象的值到新分配的空间中，但这个值的副本是一个指针，指向堆中的同一个对象，即两个变量实际上将引用同一个对象；传递参数时同理;

```js
function setName(obj){
    obj.name = "li";
    obj = new Object();
    obj.name = "wang"
}
var person = new Object();
var person2 = person;
setName(person);
alert(person.name);
```

#### instanceof检测类型

- 引用类型即Object检测始终为true，基本类型检测始终为false（因为基本类型不是对象）
- 确定一个值是哪种基本类型使用 typeof 操作符，而确定一个值是哪种引用类型使用 instanceof 操作符

```js
console.log(2 instanceof Number);
console.log(false instanceof Boolean);
console.log('str' instanceof String);
console.log([] instanceof Array);
console.log(function(){} instanceof Function); 
var a = new Array();
console.log(a instanceof Object); 
var b = {};
console.log(b instanceof Object); 
```

FFFTTTT

```js
function Person(age){
    this.age = age;
}
var a = new Person(14);
console.log(a instanceof Person);
function Room(){
    return [1,2,3]
}
var a = new Room();
console.log(a instanceof Array);
```

TT

- instanceof可以对不同的对象实例进行判断，判断方法是根据对象的原型链依次向下查询，如果判断类型的原型属性存在该对象的原型链上，则为true

### 执行环境及作用域

#### 概念
执行环境（execution context，为简单起见，有时也称为“环境”、“上下文”）

##### 全局环境
全局执行环境是最外围的一个执行环境。根据 ECMAScript 实现所在的宿主环境不同，表示执行环境的对象也不一样。在 Web 浏览器中，全局执行环境被认为是 window 对象，因此所有全局变量和函数都是作为 window 对象的属性和方法创建的。
某个执行环境中的所有代码执行完毕后，该环境被销毁，保存在其中的所有变量和函数定义也随之销毁（全局执行环境直到应用程序退出——例如关闭网页或浏览器——时才会被销毁）。

##### 执行环境
每个函数都有自己的执行环境。当执行流进入一个函数时，函数的环境就会被推入一个环境栈中。
而在函数执行之后，栈将其环境弹出，把控制权返回给之前的执行环境。ECMAScript 程序中的执行流正是由这个方便的机制控制着。

##### 作用域链
当代码在一个环境中执行时，会创建变量对象的一个作用域链（scope chain）。作用域链的用途，是保证对执行环境有权访问的所有变量和函数的有序访问。作用域链的前端，始终都是当前执行的代码所在环境的变量对象。如果这个环境是函数，则将其活动对象（activation object）作为变量对象。活动对象在最开始时只包含一个变量，即 arguments 对象（这个对象在全局环境中是不存在的）。作用域链中的下一个变量对象来自包含（外部）环境，而再下一个变量对象则来自下一个包含环境。这样，一直延续到全局执行环境；全局执行环境的变量对象始终都是作用域链中的最后一个对象。
```js
// 向上搜索作用域链
var color = "blue";
function getColor(){
    function changeColor(){
        color = "green";
    }
	return color;
}
alert(getColor());
```

##### 标识符解析
标识符解析是沿着作用域链一级一级地搜索标识符的过程。搜索过程始终从作用域链的前端开始，
然后逐级地向后回溯，直至找到标识符为止（如果找不到标识符，通常会导致错误发生）。

#### 延长作用域链
在作用域链的前端临时增加一个变量对象，该变量对象会在代码执行后被移除
- try-catch 语句的 catch 块
- with 语句
```js
function buildUrl() {
    var qs = "?debug=true";
    with(location){
    	var url = href + qs;
    }
    return url;
} 
```
href => location.href
qs => "?debug=true"

### 垃圾收集

#### 标记清除
- 变量进入环境，打上进入标记
- 变量离开环境，打上离开标记
- 垃圾收集器去掉环境中的变量以及被环境中变量引用的变量的标记
- 之后再被加上标记的将被准备清除

#### 引用计数
- 声明时引用计数为1，被引用时+1，反之-1；
- 垃圾收集器释放引用值为0的值

##### 问题
- 循环引用，至少引用计数都为1；
- 避免循环引用，需要手动断开连接，即将原引用=null

#### 管理内存
一旦数据不再有用，最好通过将其值设置为 null 来释放其引用——这个做法叫做解除引用（dereferencing）。这一做法适用于大多数全局变量和全局对象的属性。局部变量会在它们离开执行环境时自动被解除引用。
```js
function createPerson(name){
    var localPerson = new Object();
    localPerson.name = name;
    return localPerson;
}
var globalPerson = createPerson("Nicholas");
// 手工解除 globalPerson 的引用
globalPerson = null; 
```
解除一个值的引用并不意味着自动回收该值所占用的内存。解除引用的真正作用是让值脱离执行环境，以便垃圾收集器下次运行时将其回收。

解除变量的引用不仅有助于消除循环引用现象，而且对垃圾收集也有好处。为了确保有效地回 收内存，应该及时解除不再使用的全局对象、全局对象属性以及循环引用变量的引用。

## 引用类型
### Object类型
### Array类型
- length不是只读的
```js
var colors = ["red", "blue", "green"];
colors.length = 2;
alert(colors[2]);
```
- 检测数组方法Array.isArray()在不同的全局环境中更实用（相较于instanceof）

- 栈方法push()、pop() LIFO

- 队列方法push()、shift() FIFO

- 反转方法reverse()

- 排序方法sort()，基于toString()后的字符串大小排序，可传入参数：比较函数，sort(compare)

- 操作方法concat() slice() splice() 

- 位置方法indexOf() lastIndexof()

- 迭代方法

- 归并方法

#### 数组转字符串
`Array.join()`将数组中所有元素放到一个字符串中，并用指定的分隔符进行分割
```js
const a = [1, 2, 3]

a.join(',')  // "1,2,3"
a.join('_') // "1_2_3"
```
#### 字符串转数组
`String.split()`将字符串以指定的分隔符分割成数组

```js
const a = '720_1_6'

a.split('_')  // [720, 1, 6]
```

### Data类型

### RegExp类型
正则表达式

```js
{n}          n次
{1,3}       1~3次
{1,}        1到多次
+           1到多次
?           0到一次
*           0到多次
^           匹配一行开始
$          匹配一行结束
字符类
[abc]   /[abc]/  匹配"abc"中任意一个字符
[^abc]  /[^abc]/  匹配非"abc"中任意一个字符
.     任意字符（除了换行符）
\w    任意字符   [a-zA-Z0-9]    
\W    任意非字符  [^a-zA-Z0-9]
\s    任意空白符  
\S    任意非空白符  
\d    任意数字    [0-9]
\D    任意非数字  [^0-9]
```



### Function类型
- 没有重载
- 函数声明，可以函数名提升，即解释器会率先读取函数声明，并使其再执行任何代码之前可用
```js
alert(sum(1,2));
function sum (n1,n2){
	return n1 + n2;
}
```
- 函数表达式
```js
alert(sum(1,2));
var sum = function (n1,n2){
	return n1 + n2;
}
```

#### arguments

函数实际上是访问了函数体中一个名为 [`arguments`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Functions_and_function_scope/arguments) 的内部对象，这个对象就如同一个类似于数组的对象一样，包括了所有被传入的参数。让我们重写一下上面的函数，使它可以接收任意个数的参数：
```js
function avg() {
    var sum = 0;
    for (var i = 0, j = arguments.length; i < j; i++) {
        sum += arguments[i];
    }
    return sum / arguments.length;
}
avg(2, 3, 4, 5); // 3.5
```
#### ...args 剩余参数
为了使代码变短一些，我们可以使用剩余参数来替换arguments的使用。在这方法中，我们可以传递任意数量的参数到函数中同时尽量减少我们的代码。这个剩余参数操作符在函数中以：...variable 的形式被使用，它将包含在调用函数时使用的未捕获整个参数列表到这个变量中。我们同样也可以将 for 循环替换为 for...of 循环来返回我们变量的值。

```js
function avg(...args) {
  var sum = 0;
  for (let value of args) {
    sum += value;
  }
  return sum / args.length;
}
avg(2, 3, 4, 5); // 3.5
```
在上面这段代码中，所有被传入该函数的参数都被变量 args 所持有。

需要注意的是，无论“剩余参数操作符”被放置到函数声明的哪里，它都会把除了自己之前的所有参数存储起来。比如函数：function avg(firstValue, ...args) 会把传入函数的第一个值存入 firstValue，其他的参数存入 args。这是虽然一个很有用的语言特性，却也会带来新的问题。

剩余参数和 `arguments`对象之间的区别主要有三个：

- 剩余参数只包含那些没有对应形参的实参，而 `arguments` 对象包含了传给函数的所有实参。
- `arguments`对象不是一个真正的数组，而剩余参数是真正的 `Array`实例，也就是说你能够在它上面直接使用所有的数组方法，比如 `sort`，`map`，`forEach`或`pop`。
- `arguments`对象还有一些附加的属性 （如`callee`属性）。

#### apply

`avg()` 函数只接受逗号分开的参数列表 -- 但是如果你想要获取一个数组的平均值怎么办,JavaScript 允许你通过任意函数对象的 `apply()` 方法来传递给它一个数组作为参数列表。

```js
avg.apply(null, [2, 3, 4, 5]); // 3.5
```

传给 `apply()` 的第二个参数是一个数组，它将被当作 `avg()` 的参数列表使用，至于第一个参数 `null`，代表this对象，这也正说明了一个事实——函数也是对象。

通过使用[展开语法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Spread_syntax)，你也可以获得同样的效果。

比如说：`avg(...numbers)`

#### call
apply() 有一个姐妹函数，名叫 call，它也可以允许你设置 this，但它带有一个扩展的参数列表而不是一个数组。

```js
avg.apply(null, 2, 3, 4, 5); // 3.5
```
例：
```js
function lastNameCaps() {
    return this.last.toUpperCase();
}
var s = new Person("Simon", "Willison");
lastNameCaps.call(s);
// 和以下方式等价
s.lastNameCaps = lastNameCaps;
s.lastNameCaps();
```

#### 应用场景

- 求数组中的最大和最小值
```js
var arr = [1,2,3,89,46]
var max = Math.max.apply(null,arr)//89
var min = Math.min.apply(null,arr)//1
```
- 将类数组转化为数组
```js
var trueArr = Array.prototype.slice.call(arrayLike)
```
- 数组追加
```js
var arr1 = [1,2,3];
var arr2 = [4,5,6];
var total = [].push.apply(arr1, arr2);//6
// arr1 [1, 2, 3, 4, 5, 6]
// arr2 [4,5,6]
```
- 判断变量类型
```js
function isArray(obj){
    return Object.prototype.toString.call(obj) == '[object Array]';
}
isArray([]) // true
isArray('dot') // false
```
- 利用call和apply做继承
```js
function Person(name,age){
    // 这里的this都指向实例
    this.name = name
    this.age = age
    this.sayAge = function(){
        console.log(this.age)
    }
}
function Female(){
    Person.apply(this,arguments)//将父元素所有方法在这里执行一遍就继承了
}
var dot = new Female('Dot',2)
```
- 使用 log 代理 console.log
```js
function log(){
  console.log.apply(console, arguments);
}
// 当然也有更方便的 var log = console.log()
```

#### call、apply和bind函数存在的区别:

bind返回对应函数, 便于稍后调用； apply, call则是立即调用。

除此外, 在 ES6 的箭头函数下, call 和 apply 将失效, 对于箭头函数来说:

- 箭头函数体内的 this 对象, 就是定义时所在的对象, 而不是使用时所在的对象;所以不需要类似于var _this = this这种丑陋的写法
- 箭头函数不可以当作构造函数，也就是说不可以使用 new 命令, 否则会抛出一个错误
- 箭头函数不可以使用 arguments 对象,，该对象在函数体内不存在. 如果要用, 可以用 Rest 参数代替
- 不可以使用 yield 命令, 因此箭头函数不能用作 Generator 函数，什么是Generator函数可自行查阅资料，推荐阅读阮一峰Generator 函数的含义与用法，Generator 函数的异步应用

作者：_Dot912
链接：https://www.jianshu.com/p/bc541afad6ee
来源：简书
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

### [重新介绍Js](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/A_re-introduction_to_JavaScript)
```

```