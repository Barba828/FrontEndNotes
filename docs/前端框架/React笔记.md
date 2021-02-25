## JSX
### JSX 表示对象
Babel 会把 JSX 转译成一个名为 React.createElement() 函数调用。
以下两种示例代码完全等效：
```jsx
const element = (
  <h1 className="greeting">
    Hello, world!
  </h1>
);
const element = React.createElement(
  'h1',
  {className: 'greeting'},
  'Hello, world!'
);
```
React.createElement() 会预先执行一些检查，以帮助你编写无错代码，但实际上它创建了一个这样的对象：
```js
// 注意：这是简化过的结构
const element = {
  type: 'h1',
  props: {
    className: 'greeting',
    children: 'Hello, world!'
  }
};
```
这些对象被称为 “React 元素”。它们描述了你希望在屏幕上看到的内容。React 通过读取这些对象，然后使用它们来构建 DOM 以及保持随时更新。

### 注
组件名称必须以大写字母开头。
React 会将以小写字母开头的组件视为原生 DOM 标签。例如，<div /> 代表 HTML 的 div 标签，而 <Welcome /> 则代表一个组件，并且需在作用域内使用 Welcome

## Class

### State 的更新可能是异步的
出于性能考虑，React 可能会把多个 setState() 调用合并成一个调用。
因为 this.props 和 this.state 可能会异步更新，所以你不要依赖他们的值来更新下一个状态。
例如，此代码可能会无法更新计数器：
```js
// Wrong
this.setState({
  counter: this.state.counter + this.props.increment,
});
```
要解决这个问题，可以让 setState() 接收一个函数而不是一个对象。这个函数用上一个 state 作为第一个参数，将此次更新被应用时的 props 做为第二个参数：
```js
// Correct
this.setState((state, props) => ({
  counter: state.counter + props.increment
}));
```

### bind
你必须谨慎对待 JSX 回调函数中的 this，在 JavaScript 中，class 的方法默认不会绑定 this。如果你忘记绑定 this.handleClick 并把它传入了 onClick，当你调用这个函数的时候 this 的值为 undefined。
这并不是 React 特有的行为；这其实与 JavaScript 函数工作原理有关。通常情况下，如果你没有在方法后面添加 ()，例如 onClick={this.handleClick}，你应该为这个方法绑定 this。
```jsx
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isToggleOn: true};

    // 为了在回调中使用 `this`，这个绑定是必不可少的
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    this.setState(state => ({
      isToggleOn: !state.isToggleOn
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? 'ON' : 'OFF'}
      </button>
    );
  }
}
```
#### 箭头函数
方案1
```jsx
class LoggingButton extends React.Component {
  handleClick() {
    console.log('this is:', this);
  }

  render() {
    // 此语法确保 `handleClick` 内的 `this` 已被绑定。
    return (
      <button onClick={() => this.handleClick()}>
        Click me
      </button>
    );
  }
}
```
方案2
```jsx
class LoggingButton extends React.Component {
  // 此语法确保 `handleClick` 内的 `this` 已被绑定。
  // 注意: 这是 *实验性* 语法。
  handleClick = () => {
    console.log('this is:', this);
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        Click me
      </button>
    );
  }
}
```

#### 传递参数
向事件处理程序传递参数
在循环中，通常我们会为事件处理函数传递额外的参数。例如，若 id 是你要删除那一行的 ID，以下两种方式都可以向事件处理函数传递参数：
```jsx
<button onClick={(e) => this.deleteRow(id, e)}>Delete Row</button>
<button onClick={this.deleteRow.bind(this, id)}>Delete Row</button>
```
上述两种方式是等价的，分别通过箭头函数和 Function.prototype.bind 来实现。
在这两种情况下，React 的事件对象 e 会被作为第二个参数传递。如果通过箭头函数的方式，事件对象必须显式的进行传递，而通过 bind 的方式，事件对象以及更多的参数将会被隐式的进行传递。


### 状态提升
通常，多个组件需要反映相同的变化数据，这时我们建议将共享状态提升到最近的共同父组件中去。
例如
```jsx
  render() {
    const scale = this.state.scale;
    const temperature = this.state.temperature;
    const celsius = scale === 'f' ? tryConvert(temperature, toCelsius) : temperature;
    const fahrenheit = scale === 'c' ? tryConvert(temperature, toFahrenheit) : temperature;

    return (
      <div>
        <TemperatureInput
          scale="c"
          temperature={celsius}
          onTemperatureChange={this.handleCelsiusChange} />
        <TemperatureInput
          scale="f"
          temperature={fahrenheit}
          onTemperatureChange={this.handleFahrenheitChange} />
        <BoilingVerdict
          celsius={parseFloat(celsius)} />
      </div>
    );
  }
}
```
华氏度和摄氏度公用一个父组件的状态值`this.state.temperature`，并且在自组件中处理该状态修改也是通过父组件传入的函数修改`this.handleCelsiusChange`、`this.handleFahrenheitChange`

在 React 应用中，任何可变数据应当只有一个相对应的唯一“数据源”。通常，state 都是首先添加到需要渲染数据的组件中去。然后，如果其他组件也需要这个 state，那么你可以将它提升至这些组件的最近共同父组件中。你应当依靠自上而下的数据流，而不是尝试在不同组件间同步 state。
虽然提升 state 方式比双向绑定方式需要编写更多的“样板”代码，但带来的好处是，排查和隔离 bug 所需的工作量将会变少。由于“存在”于组件中的任何 state，仅有组件自己能够修改它，因此 bug 的排查范围被大大缩减了。此外，你也可以使用自定义逻辑来拒绝或转换用户的输入。

如果某些数据可以由 props 或 state 推导得出，那么它就不应该存在于 state 中。举个例子，本例中我们没有将 celsiusValue 和 fahrenheitValue 一起保存，而是仅保存了最后修改的 temperature 和它的 scale。这是因为另一个输入框的温度值始终可以通过这两个值以及组件的 render() 方法获得。这使得我们能够清除输入框内容，亦或是，在不损失用户操作的输入框内数值精度的前提下对另一个输入框内的转换数值做四舍五入的操作。

#### 双向绑定
VUE中通过v-model实现双向绑定，好处是减少了修改state的模版代码，缺点是使组件中的数据源变得不可控，父组件和自组件都可以修改该数据，数据流非自上而下的瀑布流形式，较难排查bug。

### 注
- 构造函数是唯一可以给 this.state 赋值的地方
- 当元素没有确定 id 的时候，万不得已你可以使用元素索引 index 作为 key：
```jsx
const todoItems = todos.map((todo, index) =>
  // Only do this if items have no stable IDs
  <li key={index}>
    {todo.text}
  </li>
);
```
如果列表项目的顺序可能会变化，我们不建议使用索引来用作 key 值，因为这样做会导致性能变差，还可能引起组件状态的问题。如果你选择不指定显式的 key 值，那么 React 将默认使用索引用作为列表项目的 key 值。

## Context
[官网](https://react.docschina.org/docs/context.html)
在一个典型的 React 应用中，数据是通过 props 属性自上而下（由父及子）进行传递的，但这种做法对于某些类型的属性而言是极其繁琐的（例如：地区偏好，UI 主题），这些属性是应用程序中许多组件都需要的。Context 提供了一种在组件之间共享此类值的方式，而不必显式地通过组件树的逐层传递 props。

有的时候在组件树中很多不同层级的组件需要访问同样的一批数据。Context 能让你将这些数据向组件树下所有的组件进行“广播”，所有的组件都能访问到这些数据，也能访问到后续的数据更新。使用 context 的通用的场景包括管理当前的 locale，theme，或者一些缓存数据，这比替代方案要简单的多。

```jsx
// Context 可以让我们无须明确地传遍每一个组件，就能将值深入传递进组件树。
// 为当前的 theme 创建一个 context（“light”为默认值）。
const ThemeContext = React.createContext('light');
class App extends React.Component {
  render() {
    // 使用一个 Provider 来将当前的 theme 传递给以下的组件树。
    // 无论多深，任何组件都能读取这个值。
    // 在这个例子中，我们将 “dark” 作为当前的值传递下去。
    return (
      <ThemeContext.Provider value="dark">
        <Toolbar />
      </ThemeContext.Provider>
    );
  }
}

// 中间的组件再也不必指明往下传递 theme 了。
function Toolbar() {
  return (
    <div>
      <ThemedButton />
    </div>
  );
}

class ThemedButton extends React.Component {
  // 指定 contextType 读取当前的 theme context。
  // React 会往上找到最近的 theme Provider，然后使用它的值。
  // 在这个例子中，当前的 theme 值为 “dark”。
  // static，类静态属性，初始化contextType订阅
  static contextType = ThemeContext;
  render() {
    return <Button theme={this.context} />;
  }
}
```

### React.createContext
创建一个 Context 对象。
```js
const MyContext = React.createContext(defaultValue);
```
当 React 渲染一个订阅了这个 Context 对象的组件，这个组件会从组件树中离自身最近的那个匹配的 Provider 中读取到当前的 context 值。

### Context.Provider
创建一个生产Context对象
```jsx
<MyContext.Provider value={/* 某个值 */}>
```
每个 Context 对象都会返回一个 Provider React 组件，它允许消费组件订阅 context 的变化。

Provider 接收一个 value 属性，传递给消费组件。一个 Provider 可以和多个消费组件有对应关系。多个 Provider 也可以嵌套使用，里层的会覆盖外层的数据。

当 Provider 的 value 值发生变化时，它内部的所有消费组件都会重新渲染。Provider 及其内部 consumer 组件都不受制于 shouldComponentUpdate 函数，因此当 consumer 组件在其祖先组件退出更新的情况下也能更新。

通过新旧值检测来确定变化，使用了与 Object.is 相同的算法。

### Class.contextType
挂载一个消费Context对象，用于Class组件
```js
class MyClass extends React.Component {
  static contextType = MyContext;
  componentDidMount() {
    let value = this.context;
    /* 在组件挂载完成后，使用 MyContext 组件的值来执行一些有副作用的操作 */
  }
  render() {
    let value = this.context;
    /* 基于这个值进行渲染工作 */
  }
}
```
挂载在 class 上的 contextType 属性会被重赋值为一个由 React.createContext() 创建的 Context 对象。这能让你使用 this.context 来消费最近 Context 上的那个值。你可以在任何生命周期中访问到它，包括 render 函数中。

### Context.Consumer
创建一个消费Context对象，用于Function组件
```jsx
<MyContext.Consumer>
  {value => /* 基于 context 值进行渲染*/}
</MyContext.Consumer>
```
这里，React 组件也可以订阅到 context 变更。这能让你在函数式组件中完成订阅 context。

## Refs转发
ref一般用于获取组件Dom叶节点，但是若需要在父组件获取子组件的Dom的ref，则需要ref转发
Ref 转发是一项将 ref 自动地通过组件传递到其一子组件的技巧。
```jsx
const FancyButton = React.forwardRef((props, ref) => (
  <button ref={ref} className="FancyButton">
    {props.children}
  </button>
));

// 你可以直接获取 DOM button 的 ref：
const ref = React.createRef();
<FancyButton ref={ref}>Click me!</FancyButton>;
```
这样，使用 FancyButton 的组件可以获取底层 DOM 节点 button 的 ref ，并在必要时访问，就像其直接使用 DOM button 一样。

以下是对上述示例发生情况的逐步解释：
>我们通过调用 React.createRef 创建了一个 React ref 并将其赋值给 ref 变量。
我们通过指定 ref 为 JSX 属性，将其向下传递给 <FancyButton ref={ref}>。
React 传递 ref 给 forwardRef 内函数 (props, ref) => ...，作为其第二个参数。
我们向下转发该 ref 参数到 <button ref={ref}>，将其指定为 JSX 属性。
当 ref 挂载完成，ref.current 将指向 <button> DOM 节点。


## 高阶组件
[官网](https://react.docschina.org/docs/higher-order-components.html)
高阶组件（HOC）是 React 中用于复用组件逻辑的一种高级技巧。HOC 自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式。

### 使用 HOC 解决横切关注点问题
- React之前建议使用 mixins 用于解决横切关注点相关的问题，但 mixins 会产生更多麻烦
- Render Props也会解决横切面问题，但更强调的是复用状态逻辑

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```
具体而言，高阶组件是参数为组件，返回值为新组件的函数。组件是将 props 转换为 UI，而高阶组件是将组件转换为另一个组件。

在higherOrderComponent组件中做一些公共的处理，例如生命周期，订阅消息等内容；
WrappedComponent相当于继承其公共内容完成UI处理。
```jsx
// 此函数接收一个组件...
function higherOrderComponent(WrappedComponent, selectData) {
  // ...并返回另一个组件...
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.handleChange = this.handleChange.bind(this);
      this.state = {
      	//selectData，订阅消息函数
        data: selectData(DataSource, props)
      };
    }

    componentDidMount() {
      // ...负责订阅相关的操作...
      DataSource.addChangeListener(this.handleChange);
    }

    componentWillUnmount() {
      DataSource.removeChangeListener(this.handleChange);
    }

    handleChange() {
      this.setState({
        data: selectData(DataSource, this.props)
      });
    }

    render() {
      // ... 并使用新数据渲染被包装的组件!
      // 请注意，我们可能还会传递其他属性
      return <WrappedComponent data={this.state.data} {...this.props} />;
    }
  };
}
```

### 约定：将不相关的 props 传递给被包裹的组件
HOC 为组件添加特性。自身不应该大幅改变约定。HOC 返回的组件与原组件应保持类似的接口。
HOC 应该透传与自身无关的 props。大多数 HOC 都应该包含一个类似于下面的 render 方法：
```js
render() {
  // 过滤掉非此 HOC 额外的 props，且不要进行透传
  const { extraProp, ...passThroughProps } = this.props;

  // 将 props 注入到被包装的组件中。
  // 通常为 state 的值或者实例方法。
  const injectedProp = someStateOrInstanceMethod;

  // 将 props 传递给被包装组件
  return (
    <WrappedComponent
      injectedProp={injectedProp}
      {...passThroughProps}
    />
  );
}
```
这种约定保证了 HOC 的灵活性以及可复用性。

### 注意
1. 不要在 render 方法中使用 HOC
```js
render() {
  // 每次调用 render 函数都会创建一个新的 EnhancedComponent
  // EnhancedComponent1 !== EnhancedComponent2
  const EnhancedComponent = enhance(MyComponent);
  // 这将导致子树每次渲染都会进行卸载，和重新挂载的操作！并且会丢失状态！
  return <EnhancedComponent />;
}
```
2. 原组件静态方法需要手动复制，否则高阶组件生成的新组件没有原始组件的任何静态方法
3. Refs不会被传递，需要使用 React.forwardRef API来ref转发

## Render Props
语 “render prop” 是指一种在 React 组件之间使用一个值为函数的 prop 共享代码的简单技术
具有 render prop 的组件接受一个函数，该函数返回一个 React 元素并调用它而不是实现自己的渲染逻辑。

在DataProvider组件中状态控制data值，通过render prop控制根据data状态值渲染内容
```jsx
<DataProvider render={data => (
  <h1>Hello {data.target}</h1>
)}/>
```
注：
- prop参数名可以不为render
- React.PureComponent 不可用于render prop，因为该组件props是浅比较，render prop函数总会是比较为false而重新render，可以将render prop定义为一个实例函数解决
```js
  // 当我们在渲染中使用它时，它指的是相同的函数
  renderTest = data => (
        <h1>Hello {data.target}</h1>
      );
  }

  render() {
    return (
      <DataProvider render={this.renderTest}/>
    );
  }
```

## 静态类型检查
像 Flow 和 TypeScript 等这些静态类型检查器，可以在运行前识别某些类型的问题。他们还可以通过增加自动补全等功能来改善开发者的工作流程。出于这个原因，我们建议在大型代码库中使用 Flow 或 TypeScript 来代替 PropTypes。

## 生命周期
### 挂载
当组件实例被创建并插入 DOM 中时，其生命周期调用顺序如下：
- constructor()
- static getDerivedStateFromProps()
- render()
- componentDidMount()

### 更新
当组件的 props 或 state 发生变化时会触发更新。组件更新的生命周期调用顺序如下：
- static getDerivedStateFromProps()
- shouldComponentUpdate()
- render()
- getSnapshotBeforeUpdate()
- componentDidUpdate()

### 卸载
当组件从 DOM 中移除时会调用如下方法：
- componentWillUnmount()

### 错误处理
当渲染过程，生命周期，或子组件的构造函数中抛出错误时，会调用如下方法：
- static getDerivedStateFromError()
- componentDidCatch()

## HOOK

### State
你可以在一个组件中多次使用 State Hook:
```js
function ExampleWithManyStates() {
  // 声明多个 state 变量！
  const [age, setAge] = useState(42);
  const [fruit, setFruit] = useState('banana');
  const [todos, setTodos] = useState([{ text: 'Learn Hooks' }]);
  // ...
}
```
数组解构的语法让我们在调用 useState 时可以给 state 变量取不同的名字。当然，这些名字并不是 useState API 的一部分。React 假设当你多次调用 useState 的时候，你能保证每次渲染时它们的调用顺序是不变的。

### Effect
它跟 class 组件中的 componentDidMount、componentDidUpdate 和 componentWillUnmount 具有相同的用途，只不过被合并成了一个 API。
数据获取，设置订阅以及手动更改 React 组件中的 DOM 都属于副作用，简称为“作用（Effect）”。
```jsx
function FriendStatusWithCounter(props) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    document.title = `You clicked ${count} times`;
  });

  const [isOnline, setIsOnline] = useState(null);
  useEffect(() => {
  	//组件挂载&更新时执行：执行更新订阅信息操作
    ChatAPI.subscribeToFriendStatus(props.friend.id, handleStatusChange);
    return () => {
    	//返回值，是 effect 可选的清除机制，组件卸载时执行：执行取消订阅操作
      ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
    };
  });

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }
  // ...
```
通过使用 Hook，你可以把组件内相关的副作用组织在一起（例如创建订阅及取消订阅），而不要把它们拆分到不同的生命周期函数里。
传递给 useEffect 的函数在每次渲染中都会有所不同，这是刻意为之的。事实上这正是我们可以在 effect 中获取最新的 count 的值，而不用担心其过期的原因。每次我们重新渲染，都会生成新的 effect，替换掉之前的。某种意义上讲，effect 更像是渲染结果的一部分 —— 每个 effect “属于”一次特定的渲染。

#### 注
1.  与 componentDidMount 或 componentDidUpdate 不同，使用 useEffect 调度的 effect 不会阻塞浏览器更新屏幕，这让你的应用看起来响应更快。大多数情况下，effect 不需要同步地执行。在个别情况下（例如测量布局），有单独的 useLayoutEffect Hook 供你使用，其 API 与 useEffect 相同。
2.  每次渲染后都执行清理或者执行 effect 可能会导致性能问题。在 class 组件中，我们可以通过在 componentDidUpdate 中添加对 prevProps 或 prevState 的比较逻辑解决。函数组件中，你可以通知 React 跳过对 effect 的调用，只要传递数组作为 useEffect 的第二个可选参数即可：
```js
useEffect(() => {
  document.title = `You clicked ${count} times`;
}, [count]); // 仅在 count 更改时更新
```
对于有清除操作的 effect 同样适用
3. 如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数。这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行。

### 自定义Hook
有时候我们会想要在组件之间重用一些状态逻辑。目前为止，有两种主流方案来解决这个问题：高阶组件和 render props。自定义 Hook 可以让你在不增加组件的情况下达到同样的目的。
即通过State和Effec的组合达到封装状态逻辑的目的。
```js
import React, { useState, useEffect } from 'react';

function useFriendStatus(friendID) {
  const [isOnline, setIsOnline] = useState(null);

  function handleStatusChange(status) {
    setIsOnline(status.isOnline);
  }

  useEffect(() => {
    ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
    return () => {
      ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
    };
  });

  return isOnline;
}
```

### 注
Hook 就是 JavaScript 函数，但是使用它们会有两个额外的规则：
- 只能在函数最外层调用 Hook。不要在循环、条件判断或者子函数中调用。
- 只能在 React 的函数组件中调用 Hook。不要在其他 JavaScript 函数中调用（除了自定义Hook）。
使用 eslint-plugin-react-hooks   ESLint 插件来强制执行这两条规则

- React 16.8.0，React Native 0.59 及以上版本支持 Hook

### FAQ

#### Hook 会替代 render props 和高阶组件吗？
通常，render props 和高阶组件只渲染一个子节点。我们认为让 Hook 来服务这个使用场景更加简单。这两种模式仍有用武之地，（例如，一个虚拟滚动条组件或许会有一个 renderItem 属性，或是一个可见的容器组件或许会有它自己的 DOM 结构）。但在大部分场景下，Hook 足够了，并且能够帮助减少嵌套。


## 概念
#### 挂载
组件挂载（插入 DOM 树中）


