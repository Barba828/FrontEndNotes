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

### Animated原理
在RN中创建动画一般使用Animated组件，定义动画组件，定义动画属性，然后使用Animated提供的几种方法让动画生成。

#### JS端驱动
JS端：动画驱动在每一帧上执行requestanimationframe方法，更新value，驱动不断的使用新的value计算动画视图。
JS端：计算差值，并且传递给绑定的view
JS端：使用setNativeProps来更新View
JS到原生桥接
原生端：View更新
所以可以看到，大多数工作都在JS端，如果JS端被阻塞，动画将会跳帧，并且每帧都需要JS传递到原生端去更新。

#### 原生端驱动
而使用RN提供给动画的原生驱动方式，则可以将上面所有步骤都移交至native端，当Animated组件产生动画节点图之后，在动画开始时，可以进行序列化，并传递到native直接执行，这样就省去了向JS端callback的过程，而原生端只关心在UI线程的每一帧，并直接更新。

基于此，使用原生驱动的动画流程将变为： 
1. 原生端：原生动画驱动使用CADisplayLink或者android.view.Choreographer去执行每一帧，计算并更新动画视图得到的新值。 
2. 原生端：差值计算并被传递给绑定的原生view 
3. 原生端：UIView或者android.view更新 
如此，没有更多的JS线程，没有更多的桥接，也就意味着更快的动画效果。

#### useNativeDriver使用原生驱动
在Animated动画config设定中，添加useNativeDriver字段，并设为true
##### 注：
- 只能使用非布局的属性，比如transform或者opacity可以，而flexbox和位置属性不行
- Animated.event只能工作于直接的事件而不是冒泡事件，比如PanResponder不能使用但是scrollView的onScroll方法可以

比如：实现一个拖拽一个圆点，其余圆点逐渐跟随被拖拽圆点的动画；
非原生驱动，其余圆点会跟着拖拽圆点走，但是掉帧；
原生驱动，不会掉帧，但是需要在手势释放后，其余圆点动画才会跟随被拖拽圆点（原因：原生Brige & JS单线程）。

### Animation源码初探

以**Animated.timing()**为例
`react-native/Libraries/Animated/src/animations/TimingAnimation.js`

#### start
- 若duration为0，且非原生驱动，直接调用更新回调，结束动画
- 否则根据原生驱动接口，分别实现原生动画，或者使用`requestAnimationFrame`实现帧动画，帧动画可以调用this.onUpdate回调动画值
```ts
start(
    fromValue: number,
    onUpdate: (value: number) => void,
    onEnd: ?EndCallback,
    previousAnimation: ?Animation,
    animatedValue: AnimatedValue,
  ): void {
    this.__active = true;
    this._fromValue = fromValue;
    this._onUpdate = onUpdate;
    this.__onEnd = onEnd;

    const start = () => {
      // Animations that sometimes have 0 duration and sometimes do not
      // still need to use the native driver when duration is 0 so as to
      // not cause intermixed JS and native animations.
      if (this._duration === 0 && !this._useNativeDriver) {
        this._onUpdate(this._toValue);
        this.__debouncedOnEnd({finished: true});
      } else {
        this._startTime = Date.now();
        if (this._useNativeDriver) {
          this.__startNativeAnimation(animatedValue);
        } else {
          this._animationFrame = requestAnimationFrame(
            this.onUpdate.bind(this),
          );
        }
      }
    };
    if (this._delay) {
      this._timeout = setTimeout(start, this._delay);
    } else {
      start();
    }
  }
```
#### update
在开始时间到duration结束时间内，回调动画值
```ts
  onUpdate(): void {
    const now = Date.now();
    if (now >= this._startTime + this._duration) {
      if (this._duration === 0) {
        this._onUpdate(this._toValue);
      } else {
        this._onUpdate(
          this._fromValue + this._easing(1) * (this._toValue - this._fromValue),
        );
      }
      this.__debouncedOnEnd({finished: true});
      return;
    }

    this._onUpdate(
      this._fromValue +
        this._easing((now - this._startTime) / this._duration) *
          (this._toValue - this._fromValue),
    );
    if (this.__active) {
      this._animationFrame = requestAnimationFrame(this.onUpdate.bind(this));
    }
  }
```
#### stop
清除定时器，结束动画
```ts
  stop(): void {
    super.stop();
    this.__active = false;
    clearTimeout(this._timeout);
    global.cancelAnimationFrame(this._animationFrame);
    this.__debouncedOnEnd({finished: false});
  }
```

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

# Metro打包

metro 是一个针对 React Native的JavaScript模块打包器，他接收一个entry file (入口文件) 和一些配置作为参数，返回给你一个单独的JavaScript文件，这个文件包含了你写的所有的JavaScript 代码和所有的依赖。

也就是说Metro把你写的几十上百个js文件和几百个node_modules的依赖，打包成了一个文件。

## Metro的工作原理

Metro 的打包过程有3个独立的阶段
- Resolution
- Transformation
- Serialization

### Resolution 阶段

Metro 需要建立一个你的入口文件所需要的所有的模块的表，为了找到一个文件依赖了哪些文件，Metro 使用了一个resolver。在实际中，Resolution阶段是和transformation阶段并行进行的。

### Transformation阶段

所有的模块都要经历一个 transformer， transformer 负责把一个模块转换成RN能理解的格式；

### Serialization阶段

一旦模块被转换完成，就会马上被serialized，通过serializer，把上一个阶段转换好的模块组合成一个或多个bundle，bundle 就是字面意思：把一堆模块组合成一个单独的JavaScript文件

Metro这个库已经根据bundle时的各个阶段，拆分为resolver,transformer,serializer 模块了，每个模块负责相应的功能，因此你可以方便的替换为自己的模块。


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