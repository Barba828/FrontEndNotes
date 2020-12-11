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
## 安装npm包

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

## npm包发布

```sh
npm publish 
# 撤销发布 
npm unpublish
```

