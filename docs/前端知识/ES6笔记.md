# ES6

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

## 函数的参数

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
    constructor(name,pass){      
        this.name=name;      
        this.pass=pass;    
    }    
    showName() {      
    	alert(this.name)    
    }    
    showPass(){      
    	alert(this.pass)    
    } 
}
```

3.继承

  class VipUser extends User{    constructor(name,pass,level){      super(name,pass);      this.level = level;    }    showLevel(){      alert(this.level)    }  }，