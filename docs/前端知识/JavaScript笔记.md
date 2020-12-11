1. parseFloat 解析一个字符串，并返回一个浮点数
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



- 一个promise可能有三种状态：等待（pending）、已完成（fulfilled）、已拒绝（rejected）
- 一个promise的状态只可能从“等待”转到“完成”态或者“拒绝”态，不能逆向转换，同时“完成”态和“拒绝”态不能相互转换
- promise必须实现then方法（可以说，then就是promise的核心），而且then必须返回一个promise，同一个promise的then可以调用多次，并且回调的执行顺序跟它们被定义时的顺序一致
- then方法接受两个参数，第一个参数是成功时的回调，在promise由“等待”态转换到“完成”态时调用，另一个是失败时的回调，在promise由“等待”态转换到“拒绝”态时调用。同时，then可以接受另一个promise传入，也接受一个“类then”的对象或方法，即thenable对象。

![img](https://uploadfiles.nowcoder.com/images/20190903/8018242_1567479495575_D3936A1FC6EBC59323A9A311B6076ABF)



不支持冒泡事件

有：①focus

​    ②blur

​    ③mouseenter

​    ④mouseleave

​    ⑤load

​    ⑥unload

​    ⑦resize

**hasOwnProperty：** 是用来判断一个对象是否有你给出名称的属性或对象。不过需要注意的是，此方法无法检查该对象的原型链中是否具有该属性，该属性必须是对象本身的一个成员。

**isPrototypeOf :** 是用来判断要检查其原型链的对象是否存在于指定对象实例中，是则返回true，否则返回false。

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

JS全局函数

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



js原型遵循5个规则： 1、所有的引用类型（数组、对象、函数），都具有对象特性，即可自由扩展属性（除了“null”以外）； 2、所有的引用类型（数组、对象、函数），都有一个__proto__（隐式原型）属性，属性值是一个普通的对象； 3、所有的函数，都有一个prototype（显式原型）属性，属性值也是一个普通对象； 4、所有的引用类型（数组、对象、函数），__proto__属性值指向（完全相等）它的构造函数的“prototype”属性值； 5、当试图得到一个对象的某个属性时，如果这个对象本身没有这个属性，那么会去__proto__（即它的构造函数的prototype中）寻找。



## 取整

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

 

## 取余

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

