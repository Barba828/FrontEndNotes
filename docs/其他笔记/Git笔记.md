# 基础命令

## reset 回退版本

git reset 命令用于回退版本，可以指定退回某一次提交的版本。

git reset 命令语法格式如下：

```sh
git reset [--soft | --mixed | --hard] [HEAD]
```
--mixed 为默认，可以不用带该参数，用于重置暂存区的文件与上一次的提交(commit)保持一致，工作区文件内容保持不变。
--soft 参数用于回退到某个版本
--hard 参数撤销工作区中所有未提交的修改内容，将暂存区与工作区都回到上一次版本，并删除之前的所有信息提交

## [HEAD]

#### 可以使用git log查看指定的版本提交ID
```sh
git reset ac2b64b60d76283059011090dc050a9dd255570e
```
#### 也可以使用HEAD标记近期版本提交
```sh
git reset HEAD^2
```
HEAD 表示当前版本

- HEAD^ 上一个版本
- HEAD^^ 上上一个版本
- HEAD^^^ 上上上一个版本

可以使用 ～数字表示

- HEAD~0 表示当前版本
- HEAD~1 上一个版本
- HEAD^2 上上一个版本
- HEAD^3 上上上一个版本

## cherry-pick
git cherry-pick命令的作用，就是将指定的提交（commit）应用于其他分支。

```sh
git cherry-pick <commitHash>
```
上面命令就会将指定的提交commitHash，应用于当前分支。这会在当前分支产生一个新的提交，当然它们的哈希值会不一样。

举例来说，代码仓库有master和feature两个分支。
```
  a - b - c - d   Master
        \
          e - f - g Feature
```
现在将提交f应用到master分支。


#### 切换到 master 分支
```
git checkout master
```

#### Cherry pick 操作
```sh
git cherry-pick f
```
上面的操作完成以后，代码库就变成了下面的样子：将提交f合并到master分支上

```
  a - b - c - d - f   Master
        \
          e - f - g Feature
```
#### 注
rebase一样可以将feature分支的提交合并到master，cherry-pick选择某次提交，rebase可以选择某部分提交
```sh
git checkout feature
git rebase --onto master f
```
上面的操作完成以后，代码库就变成了下面的样子：将f之后的提交（f - g）合并到master分支上
```
  a - b - c - d - f - g   Master
        \
          e - f - g Feature
```

# 常用操作

## 合并commit提交记录
```sh
# 在多次commit后，获取指定的提交id
git log 
# 或者可以使用HEAD^获取提交版本
```
### 方式1:reset
```sh
# 1.回退到需要合并的提交版本
git reset --soft [HEAD]

# 2.合并缓存区的commit
git commit --amend

# 3.提交
git push -f
```

#### 注
并没有新的提交时，即`[HEAD]`未变动时，可直接
```sh
# 1.添加修改内容
git add ***

# 2.直接合并commit到之前到[HEAD]到commit
git commit --amend --no-edit
```

### 方式2:rebase
1. 合并区间
```sh
# 1.选择合并的区间
# 注：区间前开后闭 (startpoint,endpoint]
# 注：[endpoint]默认为当前HEAD
git rebase -i [startpoint] [endpoint]
```

2. 选择提交记录
在vi编辑界面，选择保留与合并的commit记录
```
pick：保留该commit（缩写:p）
reword：保留该commit，但我需要修改该commit的注释（缩写:r）
edit：保留该commit, 但我要停下来修改该提交(不仅仅修改注释)（缩写:e）
squash：将该commit和前一个commit合并（缩写:s）
fixup：将该commit和前一个commit合并，但我不要保留该提交的注释信息（缩写:f）
exec：执行shell命令（缩写:x）
drop：我要丢弃该commit（缩写:d）
```  

3. 编辑提交
继续在新的vi编辑界面，编写改次commit提交记录

#### 注
1. cannot 'squash' without a previous commit. 不能合并已经提交远程分支的记录
2. 有冲突则解决冲突，然后使用`git rebase --continue`继续rebase
3. 任何时候可以使用`git rebase —abort`撤回rebase，回到之前的状态

## 推送到远程分支
```sh
# 将temp分支推送到远程master分支
git push origin temp:master -f
```

## rebase合并原分支改动
例：我从master分支切出temp子分支，远程master有了更新后，将其rebase到本地子分支temp中
```sh
# 1.更新原分支的远程到本地来
git fetch origin master:master

# 2.rebase合并记录
git rebase master
or
git pull --rebase
```
## 暂存未提交更改
```sh
# 暂存
git stash

# 恢复
git stash apply
```