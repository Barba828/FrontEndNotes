CSS在浏览器的渲染机制，选择器，从右向左查询
```css
/*选择器二次筛选，渲染性能更低*/
.box a {

}
/*渲染性能更高*/
a {

}
```


#### 定位居中

1.需要知道父布局的具体宽高

```css
.box {
  position: absolute;
  top:'50%';
  left:'50%';
  margin-top:25px;
  margin-right:50px;
}
```

2.父布局需要固定宽高

```css
.box {
  position: absolute;
  top:0;
  left:0;
  right:0;
  bottom: 0;
  margin: auto;
}
```

3.不需要父有具体宽高限制

```css
.box {
  position: absolute;
  top:'50%';
  left:'50%';
  transform:translate(-50%,-50%)
}
```

4.弹性布局
```css
.father {
  display: flex;
  justify-content:center;
  align-items:center;
}
```

5.table，父布局需要固定宽高
本身控制文本居中，box内联样式模拟文本样式
```css
.father {
  display: table-cell;
  vertical-align:middle;
  text-align:center;
  width:500px;
  height:500px;
}
.box{
	display:inline-block
}
```

6.JS方案
获取父布局宽高，获取box宽高，top和left位移（宽高相减的值）

#### 绝对布局居中

默认居于底部居中，该方式OPPO无效
```css
position: absolute;
bottom: 0;
right: auto;
left: auto;
```
该方式OPPO有效
```css
position: absolute;
bottom: 0;
margin: auto;
```

#### 盒子模型
1.标准模型 content-box
content内容宽高，即：width，height；
盒子宽高：content+padding+border+margin；

2.IE怪异模型 border-box
内容：width/heigth+padding+border；
盒子宽高：content+margin；

3.弹性模型 flex-box