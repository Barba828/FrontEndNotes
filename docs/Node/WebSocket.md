![WebSocket](http://www.ruanyifeng.com/blogimg/asset/2017/bg2017051501.png)

## 一、为什么需要 WebSocket？

初次接触 WebSocket 的人，都会问同样的问题：我们已经有了 HTTP 协议，为什么还需要另一个协议？它能带来什么好处？

答案很简单，因为 HTTP 协议有一个缺陷：通信只能由客户端发起。

举例来说，我们想了解今天的天气，只能是客户端向服务器发出请求，服务器返回查询结果。HTTP 协议做不到服务器主动向客户端推送信息。

![img](http://www.ruanyifeng.com/blogimg/asset/2017/bg2017051507.jpg)

这种单向请求的特点，注定了如果服务器有连续的状态变化，客户端要获知就非常麻烦。我们只能使用["轮询"](https://www.pubnub.com/blog/2014-12-01-http-long-polling/)：每隔一段时候，就发出一个询问，了解服务器有没有新的信息。最典型的场景就是聊天室。

轮询的效率低，非常浪费资源（因为必须不停连接，或者 HTTP 连接始终打开）。因此，工程师们一直在思考，有没有更好的方法。WebSocket 就是这样发明的。

## 二、简介

WebSocket 协议在2008年诞生，2011年成为国际标准。所有浏览器都已经支持了。

它的最大特点就是，服务器可以主动向客户端推送信息，客户端也可以主动向服务器发送信息，是真正的双向平等对话，属于[服务器推送技术](https://en.wikipedia.org/wiki/Push_technology)的一种。

![img](http://www.ruanyifeng.com/blogimg/asset/2017/bg2017051502.png)

其他特点包括：

（1）建立在 TCP 协议之上，服务器端的实现比较容易。

（2）与 HTTP 协议有着良好的兼容性。默认端口也是80和443，并且握手阶段采用 HTTP 协议，因此握手时不容易屏蔽，能通过各种 HTTP 代理服务器。

（3）数据格式比较轻量，性能开销小，通信高效。

（4）可以发送文本，也可以发送二进制数据。

（5）没有同源限制，客户端可以与任意服务器通信。

（6）协议标识符是`ws`（如果加密，则为`wss`），服务器网址就是 URL。

```js
 ws://example.com:80/some/path
```

![img](http://www.ruanyifeng.com/blogimg/asset/2017/bg2017051503.jpg)

## 三、客户端

WebSocket 的用法相当简单。
```javascript
 var ws = new WebSocket("wss://echo.websocket.org");
 
 ws.onopen = function(evt) { 
   console.log("Connection open ..."); 
   ws.send("Hello WebSockets!");
 };
 
 ws.onmessage = function(evt) {
   console.log( "Received Message: " + evt.data);
   ws.close();
 };
 
 ws.onclose = function(evt) {
   console.log("Connection closed.");
 };      
```

### 3.1 WebSocket 构造函数

WebSocket 对象作为一个构造函数，用于新建 WebSocket 实例。

```javascript
var ws = new WebSocket('ws://localhost:8080');
```

执行上面语句之后，客户端就会与服务器进行连接。

实例对象的所有属性和方法清单，参见[这里](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)。

### 3.2 webSocket.readyState

`readyState`属性返回实例对象的当前状态，共有四种。

- CONNECTING：值为0，表示正在连接。
- OPEN：值为1，表示连接成功，可以通信了。
- CLOSING：值为2，表示连接正在关闭。
- CLOSED：值为3，表示连接已经关闭，或者打开连接失败。

下面是一个示例。

```javascript
switch (ws.readyState) {
  case WebSocket.CONNECTING:
    // do something
    break;
  case WebSocket.OPEN:
    // do something
    break;
  case WebSocket.CLOSING:
    // do something
    break;
  case WebSocket.CLOSED:
    // do something
    break;
  default:
    // this never happens
    break;
}
```

### 3.3 webSocket接收数据
#### webSocket.onopen
连接成功后回调函数

```javascript
ws.onopen = function () {
  ws.send('Hello Server!');
}
```

#### webSocket.onclose

连接关闭后回调函数（即调用`ws.close()`方法或者失去连接后）

```javascript
ws.onclose = function(event) {
  var code = event.code;
  var reason = event.reason;
  var wasClean = event.wasClean;
  // handle close event
};
```

#### webSocket.onmessage

收到服务器数据后的回调函数

```javascript
ws.onmessage = function(event) {
  var data = event.data;
  // 处理数据
};
```

#### webSocket.binaryType

指定接受服务器数据的数据类型

```javascript
// 收到的是 blob 数据
ws.binaryType = "blob";
ws.onmessage = function(e) {
  console.log(e.data.size);
};

// 收到的是 ArrayBuffer 数据
ws.binaryType = "arraybuffer";
ws.onmessage = function(e) {
  console.log(e.data.byteLength);
};
```

#### webSocket.onerror

指定报错时的回调函数

```javascript
ws.onerror = function(event) {
  // handle error event
};
```

#### webocket.addEventListener

指定多个回调函数

```javascript
ws.addEventListener('open', function (event) {
  ws.send('Hello Server!');
});
```

### 3.4 webSocket发送数据

#### webSocket.send()

实例对象的`send()`方法用于向服务器发送数据。

发送文本的例子。

```javascript
ws.send('your message');
```

发送 Blob 对象的例子。

```javascript
var file = document
 .querySelector('input[type="file"]')
 .files[0];
ws.send(file);
```

发送 ArrayBuffer 对象的例子。

```javascript
// Sending canvas ImageData as ArrayBuffer
var img = canvas_context.getImageData(0, 0, 400, 320);
var binary = new Uint8Array(img.data.length);
for (var i = 0; i < img.data.length; i++) {
 binary[i] = img.data[i];
}
ws.send(binary.buffer);
```

#### webSocket.bufferedAmount

实例对象的`bufferedAmount`属性，表示还有多少字节的二进制数据没有发送出去。它可以用来判断发送是否结束。

```javascript
var data = new ArrayBuffer(10000000);
socket.send(data);

if (socket.bufferedAmount === 0) {
 // 发送完毕
} else {
 // 发送还没结束
}
```

## 四、服务端
nodejs 可以通过`nodejs-websocket`来实现创建一个 websocket 的服务
[nodejs-websocket](https://www.npmjs.com/package/nodejs-websocket)

### 简单示例
```js
const ws = require('nodejs-websocket')

let server = ws.createServer(connection => {
        connection.on('text', function(result) {
        console.log('发送消息', result)
    })
        connection.on('connect', function(code) {
        console.log('开启连接', code)
    })
        connection.on('close', function(code) {
        console.log('关闭连接', code)
    })
        connection.on('error', function(code) {
        console.log('异常关闭', code)
    })
})

serve.listen(8081) 
```
### WS对象
引入nodejs-websocket后的主要对象
- ws.createServer([options], [callback])：创建一个 server 对象
- ws.connect(URL, [options], [callback])：创建一个 connect 对象，一般由客户端链接服务端websocket 服务时创建
- ws.setBinaryFragmentation(bytes)：设置传输二进制文件的最小尺寸，默认 512kb
- ws.setMaxBufferLength：设置传输二进制文件的最大尺寸，默认 2M

#### servs对象
通过 ws.createServer 创建
- server.listen(port, [host], [callback]): 传入端口和主机地址后，开启一个 websocket 服务
- server.close([callback]): 关闭 websocket 服务
- server.connections: 返回包含所有 connection 的数组，可以用来广播所有消息

```js
// 服务端广播
function broadcast(server, msg) {
  server.connections.forEach(function(conn) {
    conn.sendText(msg)
  })
}
```
##### serve.Event

可以通过`server.on('event', (res) => {console.log(res)})`调用

- Event: 'listening()'：调用`server.listen`会触发当前事件
- Event: 'close()'： 当服务关闭时触发该事件，如果有任何一个 connection 保持链接，都不会触发该事件
- Event: 'error(errObj)'：发生错误时触发，此事件后会直接调用 close 事件
- Event: 'connection(conn)'：建立新链接（完成握手后）触发，conn 是连接的实例对象

#### Connection对象
每一个客户端创建连接时的实例

- connection.sendText(str, [callback])：发送字符串给另一侧，可以由服务端发送字符串数据给客户端
- connection.beginBinary()：要求连接开始传输二进制，返回一个`WritableStream`
- connection.sendBinary(data, [callback]): 发送一个二进制块，类似`connection.beginBinary().end(data)`
- connection.send(data, [callback]): 发送一个字符串或者二进制内容到客户端，如果发送的是文本，类似于`sendText()`，如果发送的是二进制，类似于`sendBinary()`,
   `callback`将监听发送完成的回调
- connection.close([code, [reason]])：开始关闭握手（发送一个关闭指令）
- connection.server：如果服务是 nodejs 启动，这里会保留 server 的引用
- connection.readyState：一个常量，表示连接的当前状态

>  connection.CONNECTING：值为 0，表示正在连接
>  connection.OPEN：值为 1，表示连接成功，可以通信了
>  connection.CLOSING：值为 2，表示连接正在关闭。
>  connection.CLOSED：值为 3，表示连接已经关闭，或者打开连接失败。

- connection.outStream: 存储`connection.beginBinary()`返回的`OutStream`对象，没有则返回 null
- connection.path：表示建立连接的路径
- connection.headers：只读请求头的 name 的 value 对应的 object 对象
- connection.protocols：客户端请求的协议数组，没有则返回空数组
- connection.protocol：同意连接的协议，如果有这个协议，它会包含在`connection.protocols`数组里面

##### connection.Event

- Event: 'close(code, reason)': 连接关闭时触发
- Event: 'error(err)'：发生错误时触发，如果握手无效，也会发出响应
- Event: 'text(str)'：收到文本时触发，str 时收到的文本字符串
- Event: 'binary(inStream)'：收到二进制内容时触发，`inStream`时一个`ReadableStream`



```js
var server = ws
  .createServer(function(conn) {
    console.log('New connection')
    conn.on('binary', function(inStream) {
      // 创建空的buffer对象，收集二进制数据
      var data = new Buffer(0)
      // 读取二进制数据的内容并且添加到buffer中
      inStream.on('readable', function() {
        var newData = inStream.read()
        if (newData)
          data = Buffer.concat([data, newData], data.length + newData.length)
      })
      inStream.on('end', function() {
        // 读取完成二进制数据后，处理二进制数据
        process_my_data(data)
      })
    })
    conn.on('close', function(code, reason) {
      console.log('Connection closed')
    })
  })
  .listen(8001)
```

- Event: 'connect()':连接完全建立后发出

### 问题
如果浏览器进入其它页面或者关闭浏览器，链接会异常关闭，经常会导致后端出现异常报错
```js
// 前端代码监听页面关闭或者刷新
window.onunload = () => {
  this.closeConnect()
}
// vue里跳转到其它页面
beforeRouteLeave(to, from, next) {
  this.closeConnect()
  next()
}
```
为了避免中间会出现一些由于链接异常断开，导致后端服务抛出异常挂掉的情况
记住前端关闭页面或者刷新页面时，先把连接关掉，每次进入页面时创建连接，然后后端将由于异常关闭导致的出错 try/catch 一下，避免抛出异常，阻塞进程

## 五、webSocketd服务器

阮一峰推荐WebSocket 服务器：[Websocketd](http://websocketd.com/)。

它的最大特点，就是后台脚本不限语言，标准输入（stdin）就是 WebSocket 的输入，标准输出（stdout）就是 WebSocket 的输出
服务端后台脚本:`my-program`
```java
class Counter {
  public static void main(String [] args) throws Exception {
    for (int i=0; i<10; i++) {
      System.out.println(i);
      Thread.sleep(500);
    }
  }
}
```
开始程序:
```bash
$ websocketd --port=8080 my-program
```
客户端程序:
```js
var ws = new WebSocket('ws://localhost:8080/');

ws.onmessage = function(event) {
  console.log('Count is: ' + event.data);
};
```

## 六、参考

[阮一峰博客](http://www.ruanyifeng.com/blog/2017/05/websocket.html)
[MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket)
[nodejs-websocket](https://www.npmjs.com/package/nodejs-websocket)
[websocket聊天室实战](https://www.jianshu.com/p/f0baf93a3795)