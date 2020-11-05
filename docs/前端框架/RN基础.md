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
    if (nextProps.email !== prevState.email) {
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



