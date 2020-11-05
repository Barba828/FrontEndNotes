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