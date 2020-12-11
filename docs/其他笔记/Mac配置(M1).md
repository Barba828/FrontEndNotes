## Homebrew

根据官方规划，ARM 版 Homebrew 必须安装在 `/opt/homebrew` 路径下，而非此前的 `/usr/local/Homebrew`。由于官方的安装脚本还未更新，可以通过如下命令手动安装：
### 安装
```shell
cd /opt # 切换到 /opt 目录
mkdir homebrew # 创建 homebrew 目录
curl -L https://github.com/Homebrew/brew/tarball/master | tar xz --strip 1 -C homebrew
```
（**注：** 如果安装和使用过程中报错，可能是因为当前用户对于 `/opt/homebrew` 路径没有权限。对此，可以接管该目录：）
```shell
sudo chown -R $(whoami) /opt/homebrew
```
（**注2：**如果`==> Tapping homebrew/core`报错，执行下面这句命令，更换为中科院的镜像：）
```shell
git clone git://mirrors.ustc.edu.cn/homebrew-core.git/ /opt/homebrew/Library/Taps/homebrew/homebrew-core --depth=1
```

虽然上面的步骤已经安装了 ARM 版 Homebrew，但此时在终端中运行 `brew` 命令并不能直接启动该版本。这是因为默认情况下，ARM 版 Homebrew 用来安装程序的路径 `/opt/homebrew/bin` 并不在环境变量 `PATH` 中，因此终端无法检索到该路径下的 `brew` 程序。

### 配置路径
编辑配置文件 `~/.zshrc`，加入如下内容：

```shell
path=('/opt/homebrew/bin' $path)
export PATH
```


### 替换镜像地址
然后把homebrew-core的镜像地址也设为中科院的国内镜像

```shell
cd "$(brew --repo)"
git remote set-url origin https://mirrors.ustc.edu.cn/brew.git

cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://mirrors.ustc.edu.cn/homebrew-core.git
```


执行更新，成功：

```shell
brew update
```

最后用这个命令检查无错误：

```shell
brew doctor
```

### 其他替换

```shell
# 替换核心软件仓库
cd "$(brew --repo)/Library/Taps/homebrew/homebrew-core"
git remote set-url origin https://mirrors.ustc.edu.cn/homebrew-core.git

# 替换 cask 软件仓库（提供 macOS 应用和大型二进制文件）
cd "$(brew --repo)"/Library/Taps/caskroom/homebrew-cask
git remote set-url origin https://mirrors.ustc.edu.cn/homebrew-cask.git

# 替换 Bottles 源（Homebrew 预编译二进制软件包）zsh 用户：
echo 'export HOMEBREW_BOTTLE_DOMAIN=https://mirrors.ustc.edu.cn/homebrew-bottles' >> ~/.zshrc
source ~/.zshrc
```

### ARM 版 Mac Homebrew

根据《文件系统层次结构标准》（[Filesystem Hierarchy Standard](https://refspecs.linuxfoundation.org/FHS_3.0/fhs/index.html)，主要为 Linux 系统制定，但对具有共同 UNIX 基因的 macOS 也有参考价值）：

- [`/usr/local`](https://refspecs.linuxfoundation.org/FHS_3.0/fhs/ch04s09.html) 目录用于系统管理员在本地安装软件。系统软件更新时，该目录应免于被覆盖。
- [`/opt`](https://refspecs.linuxfoundation.org/FHS_3.0/fhs/ch03s13.html) 目录留作附加应用程序（add-on application）软件包的安装。安装在该目录下的软件包必须将其静态文件放置在单独的 `/opt/<package>` 或 `/opt/<provider>` 路径下。

历史上，`/usr/local` 主要用于放置在本地编译并另行安装的程序，避免和 `/usr` 下的系统自带版本冲突；而 `/opt` 则用于安装非系统自带的、第三方预先编译并发行的独立软件包。

显然，在如今的 macOS 使用场景下，用户很少会需要自行编译软件包，`/usr/local` 和 `/opt` 的区分一定程度上已经成为名义上的了。Homebrew 启用 `/opt` 作为 ARM 版的安装路径，可能更多是出于确保与 X86 版相互区隔的考虑。