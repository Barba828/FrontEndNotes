## 生命周期

### Constructor
1. 用于初始化操作，一般很少使用
2. 唯一一个直接修改state的地方，其他地方通过调用this.setState()方法。

### componentDidMount
1. UI渲染完成后调用
2. 只执行一次
3. 典型场景：获取外部资源

### componentDidUpdate
1. 每次UI更新被调用
2. 典型场景：页面通过props重新获取数据

### componentWillUnmount
1. 组件被移除时调用
2. 典型场景：资源释放

### getSnapshotBeforeUpdate
1. 在render之前调用，state已更新
2. 典型场景：获取render之前的dom状态

### getDerivedStateFromProps
1. 当state需要从props初始化时，使用
2. 尽量不使用，维护俩者状态需要消耗额外资源，增加复杂度
3. 每次render都会调用
4. 典型场景表单获取默认值

### shouldComponentUpdate
1. 觉得Vistual Dom是否重绘
2. 一般可以由PuerComponent自动实现
3. 典型场景：性能优化

### UNSAFE

#### componentWillReceiveProps

```js
UNSAFE_componentWillReceiveProps(nextProps) {
 //通过this.props来获取旧的外部状态,初始 props 不会被调用
 //通过对比新旧状态，来判断是否执行如this.setState及其他方法(可能会引起重复渲染)
}
```

##### getDerivedStateFromProps

```js
// 更新状态
static getDerivedStateFromProps(nextProps, prevState) {
    //静态方法内禁止访问this
    if (nextProps.email !== prevState.value) {
        //通过对比nextProps和prevState，返回一个用于更新状态的state对象，可理解返回this.setState({})
        return {
            value: nextProps.email,
        };
    }
    return null;
}

// 执行渲染
componentDidUpdate(prevProps, prevState, snapshot){
    if(this.props.email){
        // 做一些需要this.props的事
    }
}
```
## 动画

### 一维动画 Animated.Value
声明一维动画标量值
```js
const _value = new Animated.Value(0);
```
#### setValue
设置动画值
```js
_value.setValue(100);
```
#### setOffset
设置偏移量，动画值变动计算仍不变，结果会加上偏移量
```js
_value.setOffset(100);
```
#### flattenOffset
合并偏移量到动画值，并将偏移量设为0
```js
//_value值合并偏移量100
_value.setOffset(100);
_value.flattenOffset();
//即等于
_value.setOffset(100);
_value.setOffset(0);
_value.setValue(100);
```
#### extractOffset
将偏移量设置为动画当前值，并将动画值设为0
```js
//_value值动画变动到了100
_value.setValue(100);
_value.extractOffset();
//即等于
_value.setValue(100);
_value.setOffset(100);
_value.setValue(0);
```
#### addListener
监听动画值，Animated.Value是无法直接取值的，做判断等条件时需要取值
```js
_value.addListener(state=>{
	//读取 _value 的值
	console.log(state.value)
})
```
#### interpolate
插值函数
```js
_value.interpolate({
	inputRange:Array,//动画变化值
	outputRange:Array,//映射输出变化值
	...
})
```

### 二维动画 Animated.ValueXY
二维动画标量值
#### getLayout()
将动画值赋值{x, y}到样式style的{left, top}属性中
```js
style={this.state.anim.getLayout()}
```
#### getTranslateTransform()#
getTranslateTransform();
将动画值赋值{x, y}到样式style.transform.translation属性中（即{translateX,translateY}）
```js
style={{
  transform: this.state.anim.getTranslateTransform()
}}
```

### 视图布局动画 LayoutAnimation
视图布局动画
当页面Dom布局变化时，自动将视图运动到它们新的位置上。
一个常用的调用此 API 的办法是在状态更新前调用，注意如果要在Android上使用此动画，则需要在代码中启用：

```js
import { UIManager } from 'react-native';

//这段代码应该写在任何组件加载之前，比如可以写到 index.js 的开头
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}
```
#### configureNext()
计划下一次布局要发生的动画
```js
static configureNext(config, onAnimationDidEnd?, onAnimationDidFail?)
```
##### config
- duration 动画持续时间，单位是毫秒。
- create，配置创建新视图时的动画。（参阅Anim类型）
- update，配置被更新的视图的动画。（参阅Anim类型）
- delete，配置被移除的视图的动画。（参阅Anim类型）
配置详见[官网文档](https://reactnative.cn/docs/layoutanimation#spring)
##### 例
```jsx
const App = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={style.container}>
      <TouchableOpacity
        onPress={() => {
          LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
          setExpanded(!expanded);
        }}
      >
        <Text>Press me to {expanded ? "collapse" : "expand"}!</Text>
      </TouchableOpacity>
      {expanded && (
        <View style={style.tile}>
          <Text>I disappear sometimes!</Text>
        </View>
      )}
    </View>
  );
};
```
#### create()
用来创建configureNext所需的 config 参数的辅助函数。
```js
static create(duration, type, creationProp)
```
##### 例
```js
  const toggleBox = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.create(
        500,
        LayoutAnimation.Types.spring,
        LayoutAnimation.Properties.scaleXY
      )
    );
    setExpanded(!expanded);
  };
```


## 官方方法

### DeviceEventEmitter
react-native中自定义事件监听时使用插件DeviceEventEmitter实现

注册通知：
```js
import  { DeviceEventEmitter } from 'react-native';
//…
//调用事件通知
DeviceEventEmitter.emit('xxxName’,param);
//xxxName:通知的名称 param：发送的消息（传参）
```
接收通知：
```js
//开始监听
componentDidMount(){
    /**
    * @xxxName :事件名称
    * @param：事件参数
    */
	this.listener = DeviceEventEmitter.addListener('xxxName',(param)=>{ });
}

//移除监听
componentWillUnmount(){
      this.listener.remove();
  }

```

# 常见错误

## 运行报错

#### error Invalid regular expression: /(.*\\__fixtures__\\.*|node_modules[\\\]react[\\\]dist[\\\].*|webs
windows 电脑 执行 react-native 项目，报错如下：
```sh
error Invalid regular expression: 
/(.*\\__fixtures__\\.*|node_modules[\\\]react[\\\]dist[\\\].*|website\\node_modules\\.
*|heapCapture\\bundle\.js|.*\\__tests__\\.*)$/:
 Unterminated character class. Run CLI with --verbose flag for more details.
```
##### 解决方法 ：

找到这个文件：

```sh
\node_modules\metro-config\src\defaults\blacklist.js
```

替换内容为：

```js
var sharedBlacklist = [
  /node_modules[\/\\]react[\/\\]dist[\/\\].*/,
  /website\/node_modules\/.*/,
  /heapCapture\/bundle\.js/,
  /.*\/__tests__\/.*/
];
```
原来以为这个报错是因为 windows 系统导致的，所以要对内容进行转义，后来发现其他同事windows系统并未有此现象，个人分析原因可能是命令工具所致