## meta

### viewport
viewport就是设备的屏幕上能用来显示我们的网页的那一块区域，默认的viewport是layout viewport，也就是那个比屏幕要宽的viewport，但在进行移动设备网站的开发时，我们需要的是ideal viewport。
```html
<meta name="viewport"
content="
height = [pixel_value | device-height] ,
width = [pixel_value | device-width ] ,
initial-scale = float_value ,
minimum-scale = float_value ,
maximum-scale = float_value ,
user-scalable = [yes | no] ,
target-densitydpi = [dpi_value | device-dpi | high-dpi | medium-dpi | low-dpi]
"
/>
```
- width=device-width：表示当前的viewpoint等于设备的宽度，width用来设置layout viewport的宽度
- height：用来设置layout viewport的高度
- initial-scale=1.0：表示页面的初始缩放值为1
- maximum-scale：允许用户的最大缩放值
- minimum-scale：允许用户的最小缩放值
- user-scalable：表示是否允许用户缩放，“no”不允许，“yes”允许
- target-densitydpi ：一个屏幕像素密度是由屏幕分辨率决定的，通常定义为每英寸点的数量（dpi）。Android支持三种屏幕像素密度：低像素密度，中像素密度，高像素密度。一个低像素密度的屏幕每英寸上的像素点更少，而一个高像素密度的屏幕每英寸上的像素点更多。Android Browser和WebView默认屏幕为中像素密度。

**例如**
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
```

**关于缩放**
1. 缩放指的是相对于ideal viewport来进行的，比如<meta name="viewport" content="width=500, initial-scale=1">，width=500表示把当前的viewport宽度设为500，initial-scale=1则表示把当前viewport的宽度设为ideal viewport的宽度，浏览器该怎么办呢，一般会取较大的那个值。
2. 不可缩放时，缩放倍率也无效。

### 移动端处理
#### format-detection 超链接
在手机上浏览时，该标签用于指定是否将网页内容中的手机号码显示为拨号的超链接。 
在 iPhone 上默认值是：
```html
<meta name="format-detection" content="telephone=yes"/>
```

#### app-capable 工具栏
这apple-mobile-web-app-capable的作用就是删除默认的苹果工具栏和菜单栏。content有两个值”yes”和”no”,当我们需要显示工具栏和菜单栏时，这个行meta就不用加了，默认就是显示。
```html
<meta name=”apple-mobile-web-app-capable” content=”yes” />
```

#### status-bar 状态栏
作用是控制状态栏显示样式:
```html
<meta name=”apple-mobile-web-app-status-bar-style” content=”default” />
<meta name=”apple-mobile-web-app-status-bar-style” content=”black” />
<meta name=”apple-mobile-web-app-status-bar-style” content=”black-translucent” />
```
default:默认； black:纯黑； black-translucent：半透明灰色