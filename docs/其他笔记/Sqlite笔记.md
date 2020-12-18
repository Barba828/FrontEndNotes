## 修改表结构

SQLite 仅仅支持 ALTER TABLE 语句的一部分功能
### ALTER TABLE
我们可以用 ALTER TABLE 语句来更改一个表的名字，也可向表中增加一个字段
- 改变表名
```
ALTER TABLE 旧表名 RENAME TO 新表名
```
- 增加一列
```
ALTER TABLE 表名 ADD COLUMN 列名 数据类型 
```
但是我们不能删除一个已经存在的字段，或者更改一个已经存在的字段的名称、数据类型、限定符等等。 

### 移植 TABLE
而修改一列无法像其他数据库那样直接以“ALTER TABLE 表名 ADD COLUMN 列名 数据类型”的方式来完成，所以要换种思路，具体步骤看下面
#### 将表名改为临时表
```
ALTER TABLE "Student" RENAME TO "_Student_old_20140409";
```
#### 创建新表
```
CREATE TABLE "Student" (
	"Id"  INTEGER PRIMARY KEY AUTOINCREMENT,
	"Name" Text
);
```
#### 导入数据
```
INSERT INTO "Student" ("Id", "Name") SELECT "Id", "Title" FROM "_Student_old_20140409";
```
#### 更新sqlite_sequence
```
UPDATE "sqlite_sequence" SET seq = 3 WHERE name = 'Student';
```
由于在Sqlite中使用自增长字段,引擎会自动产生一个sqlite_sequence表,用于记录每个表的自增长字段的已使用的最大值，所以要一起更新下。如果有没有设置自增长，则跳过此步骤。
#### 删除临时表(可选)
```
DROP TABLE _Student_old_20140409;
```

