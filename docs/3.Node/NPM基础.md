## 清除缓存

```sh
npm clean cache -f
```

## 修改代理

```sh
# 私服
npm config set registry http://10.112.13.156:8082/nexus/repository/npm-fe-group/
npm config set registry http://10.112.13.156:8082/nexus/repository/npm-rn-hosted/
# 淘宝代理
npm config set registry https://registry.npm.taobao.org
# 中央仓库
npm config set registry=http://registry.npmjs.org
```

## 安装 npm 包

```sh
# 本地安装，写入依赖package.json文件devDependencies
npm install --save-dev %packagename%
# 本地安装，写入依赖package.json文件dependencies
npm install --save %packagename%
# 全局安装
npm install -g %packagename%
# 卸载
npm uninstall %packagename%
```

## 查看安装的包

```sh
npm ls
# 深度为0
npm ls -depth 0
```

## npm 包发布

```sh
npm publish
# 撤销发布
npm unpublish
```

## npm 安装

- --save-dev 开发依赖
- --unsafe-perm 以当前用户身份安装
  （6.x 版本以下 npm 出于安全考虑不支持以 root 用户运行，即使你用 root 用户身份运行了，npm 会自动转成一个叫 nobody 的用户来运行，而这个用户几乎没有任何权限。这样的话如果你脚本里有一些需要权限的操作，比如写文件（尤其是写 /root/.node-gyp），就会崩掉了）
