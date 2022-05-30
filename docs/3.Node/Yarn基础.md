# Yarn
Yarn是facebook发布的一款取代npm的包管理工具

## Yarn的特点
1. 速度超快----Yarn缓存了每个下载过的包，所以再次使用时无需重复下载。同时利用并行下载以最大化资源利用率，因此安装快。
2. 超级安全----在执行代码之前，Yarn会通过算法检验每个安装包的完整性。
3. 超级可靠----使用详细、简洁的锁文件格式和明确的安装算法，Yarn能够保证在不同系统上无差异工作。

## Yarn的安装

1. 下载nodejs，使用npm安装  npm install -g yarn，查看版本 ：yarn --version

2. 下载node.js，下载yarn的安装程序----[提供一个.msi文件，在运行时将引导您在Windows上安装Yarn](https:#yarnpkg.com/en/docs/install#windows-stable);

3. Yarn淘宝源安装，分别复制黏贴以下代码到黑窗口运行即可；

   ```shell
   yarn config set registry https://registry.npm.taobao.org -g
   yarn config set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass -g
   ```

## Yarn的常用命令
### 基础命令
```shell
npm install -g yarn # 安装yarn

yarn --version # 查看版本号

md yarn && cd yarn # 创建yarn文件夹

yarn init # 初始化项目，同npm init,执行输入信息后，会生成package.json文件
```
### 配置命令
```shell
yarn config list #显示所有配置项

yarn config get <key> #显示某配置项

yarn config delete <key> #删除某配置项

yarn config set <key> <value> [-g|--global] #设置配置项
```
### 安装命令
```shell
yarn install # 安装package.json里所有包，并将包即它所有依赖项保存进yarn.lock

yarn install --flat #安装一个包的单一版本 

yarn install --force #强制重新下载所有包

yarn install --production #只安装dependencies里的包

yarn install --no-lockfile #不读取或生成yarn.lock

yarn install --pure-lockfile #不生成yarn.lock
```

### 添加包
会更新package.json 和 yarn.lock
```shell
yarn add [package] #在当前项目中添加一个依赖包，会自动更新到package.json 和 yarn.lock文件中

yarn add [package]@[version] #安装指定版本，这里指的是主要版本，如果需要精确到小版本，使用 -E参数

yarn add [package]@[tag] #安装某个tag (比如beta,next或者latest)

yarn add --dev/-D  #加到devDependencies

yarn add --peer/-P #加到peerDependencies

yarn add --optional /-O #加到optionalDependencies

yarn add --exact /-E #安装包的精确版本。例如： yarn add foo@1.2.3会接受1.9.1版，但是yarn add foo@1.2.3 --exact只能1.2.3版

yarn add --title /-T #安装包的次要版本里的最新版。例如：yarn add foo@1.2.3 --title 会接受1.2.9，但不接受1.3.0
```

### 包管理
```shell
yarn publish # 发布包

yarn remove [packageName]  # 移除一个包，会自动更新package.json 和 yarn.lock

yarn upgrade # 用于更新包到基本规范范围的最新版本

yarn run # 运行脚本，用来执行在package.json中scripts属性下定义的脚本

yarn info <packageName>  # 可以用来查看某个模块的最新版本信息
```

### 缓存管理
```shell
yarn cache list # 列出已缓存的每个包

yarn cache dir #返回 全局缓存位置

yarn cache clean # 清除缓存
```

## npm 与 yarn 命令比较：

| NPM                     | YARN                  | 说明                               |
| --------------------------- | ------------------------- | -------------------------------------- |
| npm init                    | yarn init                 | 初始化某个项目                         |
| npm install / link          | yarn install/link         | 默认的安装依赖操作                     |
| npm install taco --save     | yarn add taco             | 安装某个依赖，并且默认保存到package    |
| npm uninstall taco --save   | yarn remove taco          | 移除某个依赖项目                       |
| npm install taco --save-dev | yarn add taco --dev       | 安装某个开发时依赖项目                 |
| npm update taco --save      | yarn upgrade taco         | 更新某个依赖项目                       |
| npm install taco --global   | yarn global add taco      | 安装某个全局依赖项目                   |
| npm publish/login/logout    | yarn publish/login/logout | 发布/登录/登出，一系列NPM Registry操作 |
| npm run/test                | yarn run/test             | 运行某个命令                           |

## yarn.lock
解决模块依赖历史依赖：
	比如说你的项目模块依赖：@1.2.1代表这个模块的版本。在你安装A的时候需要安装依赖C和D，很多依赖不会指定版本号，
	默认会安装最新的版本，这样就会出现出题：比如今天安装模块的时候C和D是某一个版本，而当以后C、D更新的时候，再次安装模块就会安装C和D的最新版本。如果新的版本无法兼容你的项目，你的程序可能就会出BUG，甚至无法运行。
	这就是npm弊端，而yarn为解决这个问题推出了yarn.lock的机制。

# 技巧
## 改变 yarn 全局安装位置
```sh
yarn config set global-folder "D:\yarnData\global"
```

## 改变 yarn 缓存位置
```sh
yarn config set cache-folder "D:\yarnData\cache"
```
在我们使用 全局安装 包的时候，会在 “D:\Software\yarn\global” 下生成node_modules\.bin目录

## 改变yarn bin位置
```sh
yarn config set prefix D:\yarnData\global\bin
```
我们需要将D:\Software\yarn\global\bin整个目录添加到系统环境变量中去，否则通过yarn 添加的全局包 在cmd 中是找不到的。
```sh
#检查当前yarn 的 bin的 位置
yarn global bin
#检查当前 yarn 的 全局安装位置
yarn global dir
```
## 设置淘宝源
```sh
yarn config set registry https://registry.npm.taobao.org/
```