
## 安装
[Git地址](https://github.com/nvm-sh/nvm)

注:

- Since macOS 10.15, the default shell is zsh and nvm will look for .zshrc to update, none is installed by default. Create one with touch ~/.zshrc and run the install script again.
- M1芯片
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

## 命令

### 基础命令
nvm install --lts / nvm install --lts=argon / nvm install 'lts/*' / nvm install lts/argon
nvm uninstall --lts / nvm uninstall --lts=argon / nvm uninstall 'lts/*' / nvm uninstall lts/argon
nvm use --lts / nvm use --lts=argon / nvm use 'lts/*' / nvm use lts/argon
nvm exec --lts / nvm exec --lts=argon / nvm exec 'lts/*' / nvm exec lts/argon
nvm run --lts / nvm run --lts=argon / nvm run 'lts/*' / nvm run lts/argon
nvm ls-remote --lts / nvm ls-remote --lts=argon nvm ls-remote 'lts/*' / nvm ls-remote lts/argon
nvm version-remote --lts / nvm version-remote --lts=argon / nvm version-remote 'lts/*' / nvm version-remote lts/argon

### 常用
nvm --help	展示帮助
nvm use	使用对应的 node 版本
nvm install version	下载对应的 node 版本(version)
nvm ls	展示安装的 node 版本
nvm ls --no-alias   展示安装的 node 版本(无别名)