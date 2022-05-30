## Nodejs背景简介

1 ，JavaScript最早是运行在浏览器中，然而浏览器只是提供了一个上下文
2 ，node.js事实上就是另外一种上下文，它允许在后端（脱离浏览器环境）运行JavaScript代码
3 ，Node.js事实上既是一个运行时环境，同时又是一个库

Nodejs架构如下图
![img](https://img-blog.csdn.net/20140823002109990?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvTEdDU1NY/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

Node.js 的异步机制是基于事件的，所有的磁盘 I/O 、网络通信、数据库查询都以非阻塞，的方式请求，返回的结果由事件循环来处理



•事件驱动的回调（事件轮询）

•异步IO避免了频繁的上下文切换

•在node中除了代码，所有一切都是并行执行的


![img](https://img-blog.csdn.net/20140823001956953?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvTEdDU1NY/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

## 多线程同步式 I/O与单线程异步式 I/O

同步式 I/O （阻塞式）：
利用多线程提供吞吐量 
通过事件片分割和线程调度利用多核CPU 
需要由操作系统调度多线程使用多核 CPU 
难以充分利用 CPU  资源 
内存轨迹大，数据局部性弱
符合线性的编程思维 

异步式 I/O （非阻塞式）：
单线程即可实现高吞吐量
通过功能划分利用多核CPU 
可以将单进程绑定到单核 CPU 
可以充分利用 CPU  资源 
内存轨迹小，数据局部性强 
不符合传统编程思维 

![img](https://img-blog.csdn.net/20140823002202546?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvTEdDU1NY/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)![img](https://img-blog.csdn.net/20140823002224620?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvTEdDU1NY/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

Node.js 程序由事件循环开始，到事件循环结束，所有的逻辑都是事件的回调函数，所以 Node.js  始终在事件循环中，程序入口就是事件循环第一个事件的回调函数

![img](https://img-blog.csdn.net/20140823002147593?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvTEdDU1NY/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)



##  Nodejs核心模块

1，核心模块是 Node.js  的心脏，它由一些精简而高效的库组成，为 Node.js  提供了基本的 API
2，process：用于描述当前 Node.js  进程状态的对象，提供了一个与操作系统的简单接口，通常在你写本地命令行程序的时候用到。
3，console ：用于提供控制台标准输出。（IE）
4，Util：  是一个 Node.js  核心模块，提供常用函数的集合
5，events ：是 Node.js  最重要的模块，没有“之一”
6，fs ：文件系统，提供了文件的读取、写入、更名、删除、遍历目录、链接等 POSIX  文件系统操作