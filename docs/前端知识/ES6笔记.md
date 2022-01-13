# ES6

## 作用域

- 使用`let`声明的变量可以重新赋值,但是不能在同一作用域内重新声明
- 使用`const`声明的变量必须赋值初始化,但是不能在同一作用域类重新声明也无法重新赋值

## 箭头函数

```js
function [名字](参数){
}
(参数)=>{
}//该参数已经this绑定，即函数内this仍然为上下文的对象
```

1. 如果只有一个参数，（）可以省

2. 如果只有一个return，{}可以省

```js
let arr=[12,5,12,53,42,14,326,75,98,45]; 
//1.排序普通写法 
function sr(n1,n2){  
	return n1-n2 
} 
arr.sort(sr); 
//2. 
arr.sort(function(n1,n2){  
	return n1-n2 
}); 
//3.箭头函数写法 
arr.sort=(n1,n2)=>{    
	return n1-n2 
}
```

## 参数扩展

1. 参数的扩展/展开

2. 默认参数

```js
//参数的扩展 
//1.收集剩余的参数 
function show(a,b,...args){} 
show(1,2,3,4,5) 
//...args必须是最后一个 
//2.展开数组 
let arr=[1,2,3,4,5] 
show(...arr) 
show(1,2,3,4,5) 
//...arr和1，2，3，4，5等价     
//默认参数 
function show(a,b=2,c=3){    
	alert(a,b,c) 
} 
show(1)//1，2，3 
show(5,10)//5，10，3 
show(3,6,9)//3，6，9
```

## 解构赋值

1. 左右两边结构必需一样

2. 右边必须是个东西

3. 声明和赋值不能分开（必须在一个语句里完成）

```js
//数组 
//let arr=[1,2,3]; 
let [a,b,c]=[1,2,3]; 
alert(a,b,c); 
//JSON 
let {q,w,e}={q:3,w:6,e:9}; 
//灵活使用 
let [{a,b},[n1,n2,n3],num,str] = [{a:1,b:2},[3,4,5],6,'7'];
```

## 数组

map			映射
reduce		汇总
filter			过滤器
foreach		循环（迭代）

```js
//映射 一对一 
let arr=[96,65,34,58,78];
//let result=arr.map(item=>item*2) 
let result=arr.map(item=>item>=60?'及格':'不及格') 
alert(result); 

//汇总 N对一 
//例如求和 tmp:上一次迭代返回结果，item:本次迭代参数，index:数组下标、迭代次数 
let arr=[321,124,45,67,824,4653] 
let result=arr.reduce(function(tmp,item,index){    
	return(tmp+item); 
}) 
alert(result); 

//过滤器  
let arr=[1,2,3,4,5,6]; 
let result=arr.filter(item=>item%3==0) 
alert(result)//取数组中3的模
```


## 字符串

1. ES6新方法startWith,endsWith

2. 字符串模板

```js
//两个新方法 
let str='http://www.baidu.com' 
let mail='liningzhu828@163.com' 
if(str.startsWith('http://')){    
alert('普通网址') 
} 
if(mail.endsWith('@163.com')){    
alert('网易邮箱') 
} 
//字符串模板 使用反单引号 `` 
//可以更方便的拼接字符串，拼接字符串可以换行 
let title='AA' 
let content='bb' 
let str=`<div>    
    <h1>${title}</h1>    
    <p>${content}</p> 
</div>`
```

## 面向对象

1. class关键字，构造器在类内部；
2. class里面直接加方法；

```js
class User{    
  	//constructor方法虽然在类中,但不是原型上的方法,只是用来生成实例的
    constructor(name,pass){      
        this.name=name;      
        this.pass=pass;    
    }    
    //原型上的方法, 由所有实例对象共享
    showName() {      
    	alert(this.name)    
    }
}
```
ES5实现
```js
function User(name,pass) {
      this.name=name;      
      this.pass=pass; 
}
// 由所有实例 "继承" 的方法
User.prototype.showName = function () {
    	alert(this.name) 
};
```
3. 继承
```js
class VipUser extends User{
    constructor(name,pass,level){   
    		//在使用 this 之前，必须先调用超级类
        super(name,pass);
        this.level = level;
    }
    showLevel(){
        alert(this.level)
    }
}
```
ES5实现，组合式继承
```js
function VipUser(name,pass,level) {
    User.call(this, name,pass);  // 借用构造函数, 第一次调用父类构造函数
    this.level = level;
}

VipUser.prototype = new User();  // 原型链继承, 第二次调用父类构造函数
VipUser.prototype.constructor = VipUser;  // 将实例的原型上的构造函数指定为当前子类的构造函数
VipUser.prototype.showLevel = function () {
        alert(this.level)
};
```

## Promise

## 元编程

### 代理 Proxy



### 反射 Reflex



## 集合


### Set

Set是es6新提供的数据结构，类似于数组。特点：**Set内成员值是惟一的，没有重复的值**。

```js
var set = new Set([1, 2, 3, 4, 4]);//构造函数默认数组类型，可以去重
[...set] // [1, 2, 3, 4]

var set=new Set();
set.add({});
set.add({});
[...set]//[{},{}] 对象和对象时不相等的 {}==={} 为false
```

#### 属性

```js
Set.prototype.constructor：构造函数，默认就是Set函数。
Set.prototype.size：返回Set实例的成员总数。
```

#### 方法

```js
add(value)：添加某个值，返回Set结构本身。
delete(value)：删除某个值，返回一个布尔值，表示删除是否成功。
has(value)：返回一个布尔值，表示该值是否为Set的成员。
clear()：清除所有成员，没有返回值。
```

#### 遍历

1. keys方法、values方法、entries方法返回的都是遍历器对象。Set 接口没有键名，只有键值。因此Keys 和Values 返回值相等。

```js
var obj=new Set([1,2,3,4,5,3,6]);
[...obj.keys()]; //[1,2,3,4,5,3,6]
[...obj.values()];//[1,2,3,4,5,3,6]
[...obj.entries()];//[[1,1],[2,2],[3,3],[4,4],[5,5],[6,6]]
```

2. forEach()

```js
let set = new Set([1, 2, 3]);
set.forEach((value, key) => console.log(value * 2) )
```

3. 其他遍历 for of 扩展运算符也可以使用

```js
var obj=new Set([1,2,3,4,5,3,6]);
[...obj]
//返回是数组：[1,2,3,4,5,6]
```

### WeakSet

1. WeakSet 成员**只能是对象**，并且存储的对象都是**弱引用**。
2. WeakSet没有size 属性，因此**不可遍历**。
3. 有三个方法：add，delete，has。

**弱引用**

>垃圾回收机制不考虑对该对象的引用。

```js
const ws = new WeakSet();
var a = { p1: "1", p2: "2" };
ws.add(a);
console.log(ws.has(a)); //true
a = null;
console.log(ws.has(a)); //false;
```

主要应用场景：存储DOM节点。成员是弱引用，不会担心节点被删除造成内存泄露。也可以避免全部使用强引用DOM对象，造成无法释放内存，造成内存溢出。

### Map

ES6中提供了Map的数据结构,类似于对象，是键值对的集合， 与对象不同的是，对象的键值只能是字符串，而Map 可以将任意类型都可以作为键值。

```js
var map = new Map([
  ["a", "1"],
  ["b", "2"],
]);

map.size; // 2
map.has("a"); // true
map.get("a"); // "1"
```

#### 属性

```js
Map.prototype.constructor：构造函数，默认就是Set函数。
Map.prototype.size：返回Set实例的成员总数。
```

#### 方法

```js
set(key,value)：添加某个值，返回Map结构本身
get(key): 获取某个值
has(key)：返回一个布尔值，表示该值是否为Set的成员
delete(key)：删除某个值，返回一个布尔值，表示删除是否成功
clear()：清除所有成员，没有返回值
```
#### 遍历
同Set

### WeakMap
只接受**对象作为键名，键名为弱引用，不能遍历（没有size属性）**
操作方法：get()、set()、has()、delete()
应用场景：
同WeakSet 一样，适合用来操作DOM。

```
let elem= document.getElementById('logo');
let myWeakmap = new WeakMap();

myWeakmap.set(myElement, {timesClicked: 0});

myElement.addEventListener('click', function() {
  let logoData = myWeakmap.get(myElement);
  logoData.timesClicked++;
}, false);
```

myElement是一个 DOM 节点，每当发生click事件，就更新一下状态。我们将这个状态作为键值放在 WeakMap 里，对应的键名就是myElement。一旦这个 DOM 节点删除，该状态就会自动消失，不存在内存泄漏风险。

