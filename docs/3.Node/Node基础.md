# Node

## Nodejs 背景简介

1 ，JavaScript 最早是运行在浏览器中，然而浏览器只是提供了一个上下文
2 ，node.js 事实上就是另外一种上下文，它允许在后端（脱离浏览器环境）运行 JavaScript 代码
3 ，Node.js 事实上既是一个运行时环境，同时又是一个库

Nodejs 架构如下图
![img](https://img-blog.csdn.net/20140823002109990?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvTEdDU1NY/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

Node.js 的异步机制是基于事件的，所有的磁盘 I/O 、网络通信、数据库查询都以非阻塞，的方式请求，返回的结果由事件循环来处理

•事件驱动的回调（事件轮询）

•异步 IO 避免了频繁的上下文切换

•在 node 中除了代码，所有一切都是并行执行的

![img](https://img-blog.csdn.net/20140823001956953?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvTEdDU1NY/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

## 多线程同步式 I/O 与单线程异步式 I/O

同步式 I/O （阻塞式）：
利用多线程提供吞吐量
通过事件片分割和线程调度利用多核 CPU
需要由操作系统调度多线程使用多核 CPU
难以充分利用 CPU 资源
内存轨迹大，数据局部性弱
符合线性的编程思维

异步式 I/O （非阻塞式）：
单线程即可实现高吞吐量
通过功能划分利用多核 CPU
可以将单进程绑定到单核 CPU
可以充分利用 CPU 资源
内存轨迹小，数据局部性强
不符合传统编程思维

![img](https://img-blog.csdn.net/20140823002202546?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvTEdDU1NY/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)![img](https://img-blog.csdn.net/20140823002224620?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvTEdDU1NY/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

Node.js 程序由事件循环开始，到事件循环结束，所有的逻辑都是事件的回调函数，所以 Node.js 始终在事件循环中，程序入口就是事件循环第一个事件的回调函数

![img](https://img-blog.csdn.net/20140823002147593?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvTEdDU1NY/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)

## Nodejs 核心模块

1，核心模块是 Node.js 的心脏，它由一些精简而高效的库组成，为 Node.js 提供了基本的 API
2，process：用于描述当前 Node.js 进程状态的对象，提供了一个与操作系统的简单接口，通常在你写本地命令行程序的时候用到。
3，console ：用于提供控制台标准输出。（IE）
4，Util： 是一个 Node.js 核心模块，提供常用函数的集合
5，events ：是 Node.js 最重要的模块，没有“之一”
6，fs ：文件系统，提供了文件的读取、写入、更名、删除、遍历目录、链接等 POSIX 文件系统操作

# NVM

Node 版本管理工具

## 安装

[Git 地址](https://github.com/nvm-sh/nvm)

M1 安装需要 archx64 环境

- Since macOS 10.15, the default shell is zsh and nvm will look for .zshrc to update, none is installed by default. Create one with touch ~/.zshrc and run the install script again.
- M1 芯片

```sh
# Check what version you're running:
$ node --version
v14.15.4
# Check architecture of the `node` binary:
$ node -p process.arch
arm64
# This confirms that the arch is for the M1 chip, which is causing the problems.
# So we need to uninstall it.
# We can't uninstall the version we are currently using, so switch to another version:
$ nvm install v12.20.1
# Now uninstall the version we want to replace:
$ nvm uninstall v14.15.4
# Launch a new zsh process under the 64-bit X86 architecture:
$ arch -x86_64 zsh
# Install node using nvm. This should download the precompiled x64 binary:
$ nvm install v14.15.4
# Now check that the architecture is correct:
$ node -p process.arch
x64
# It is now safe to return to the arm64 zsh process:
$ exit
# We're back to a native shell:
$ arch
arm64
# And the new version is now available to use:
$ nvm use v14.15.4
Now using node v14.15.4 (npm v6.14.10)
```

## 常用命令

nvm --help 展示帮助
nvm use 使用对应的 node 版本
nvm install version 下载对应的 node 版本(version)
nvm ls 展示安装的 node 版本
nvm ls --no-alias 展示安装的 node 版本(无别名)
