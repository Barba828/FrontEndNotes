## JSX

### JSX 表示对象

Babel 会把 JSX 转译成一个名为 React.createElement() 函数调用。
以下两种示例代码完全等效：

```jsx
const element = <h1 className="greeting">Hello, world!</h1>;
const element = React.createElement(
  "h1",
  { className: "greeting" },
  "Hello, world!"
);
```

React.createElement() 会预先执行一些检查，以帮助你编写无错代码，但实际上它创建了一个这样的对象：

```js
// 注意：这是简化过的结构
const element = {
  type: "h1",
  props: {
    className: "greeting",
    children: "Hello, world!",
  },
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
  counter: state.counter + props.increment,
}));
```

### bind

你必须谨慎对待 JSX 回调函数中的 this，在 JavaScript 中，class 的方法默认不会绑定 this。如果你忘记绑定 this.handleClick 并把它传入了 onClick，当你调用这个函数的时候 this 的值为 undefined。
这并不是 React 特有的行为；这其实与 JavaScript 函数工作原理有关。通常情况下，如果你没有在方法后面添加 ()，例如 onClick={this.handleClick}，你应该为这个方法绑定 this。

```jsx
class Toggle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isToggleOn: true };

    // 为了在回调中使用 `this`，这个绑定是必不可少的
    // 处于上下文的this，指向这个Class实例
    // 并将这个this绑定到handleClick函数中
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    // 因为bind过this为当前实例，因此可以使用方法this.setState()
    // 否则该this值为undefine
    this.setState((state) => ({
      isToggleOn: !state.isToggleOn,
    }));
  }

  render() {
    return (
      <button onClick={this.handleClick}>
        {this.state.isToggleOn ? "ON" : "OFF"}
      </button>
    );
  }
}
```

#### 箭头函数

方案 1

```jsx
class LoggingButton extends React.Component {
  handleClick() {
    console.log("this is:", this);
  }

  render() {
    // 此语法确保 `handleClick` 内的 `this` 已被绑定。
    return <button onClick={() => this.handleClick()}>Click me</button>;
  }
}
```

方案 2

```jsx
class LoggingButton extends React.Component {
  // 此语法确保 `handleClick` 内的 `this` 已被绑定。
  // 注意: 这是 *实验性* 语法。
  handleClick = () => {
    console.log("this is:", this);
  };

  render() {
    return <button onClick={this.handleClick}>Click me</button>;
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

VUE 中通过 v-model 实现双向绑定，好处是减少了修改 state 的模版代码，缺点是使组件中的数据源变得不可控，父组件和自组件都可以修改该数据，数据流非自上而下的瀑布流形式，较难排查 bug。

### 注

- 构造函数是唯一可以给 this.state 赋值的地方
- 当元素没有确定 id 的时候，万不得已你可以使用元素索引 index 作为 key：

```jsx
const todoItems = todos.map((todo, index) => (
  // Only do this if items have no stable IDs
  <li key={index}>{todo.text}</li>
));
```

如果列表项目的顺序可能会变化，我们不建议使用索引来用作 key 值，因为这样做会导致性能变差，还可能引起组件状态的问题。如果你选择不指定显式的 key 值，那么 React 将默认使用索引用作为列表项目的 key 值。

## Context

[官网](https://react.docschina.org/docs/context.html)
在一个典型的 React 应用中，数据是通过 props 属性自上而下（由父及子）进行传递的，但这种做法对于某些类型的属性而言是极其繁琐的（例如：地区偏好，UI 主题），这些属性是应用程序中许多组件都需要的。Context 提供了一种在组件之间共享此类值的方式，而不必显式地通过组件树的逐层传递 props。

有的时候在组件树中很多不同层级的组件需要访问同样的一批数据。Context 能让你将这些数据向组件树下所有的组件进行“广播”，所有的组件都能访问到这些数据，也能访问到后续的数据更新。使用 context 的通用的场景包括管理当前的 locale，theme，或者一些缓存数据，这比替代方案要简单的多。

```jsx
// 原参数传递，层层传递value
<App/> -value-> <Toolbar/> -Appvalue-> <ThemedButton/> -Appvalue-> <Button/>
// 现参数传递，在需要时跨层级传递
<App/> --> <Toolbar/> --> <ThemedButton/> --> <Button/>
<App/> -context.value-> <Button/>
```

例：

```jsx
// Context 可以让我们无须明确地传遍每一个组件，就能将值深入传递进组件树。
// 为当前的 theme 创建一个 context（“light”为默认值）。
const ThemeContext = React.createContext("light");
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

创建一个生产 Context 对象

```jsx
<MyContext.Provider value={/* 某个值 */}>
```

每个 Context 对象都会返回一个 Provider React 组件，它允许消费组件订阅 context 的变化。

Provider 接收一个 value 属性，传递给消费组件。一个 Provider 可以和多个消费组件有对应关系。多个 Provider 也可以嵌套使用，里层的会覆盖外层的数据。

当 Provider 的 value 值发生变化时，它内部的所有消费组件都会重新渲染。Provider 及其内部 consumer 组件都不受制于 shouldComponentUpdate 函数，因此当 consumer 组件在其祖先组件退出更新的情况下也能更新。

通过新旧值检测来确定变化，使用了与 Object.is 相同的算法。

### Class.contextType

挂载一个消费 Context 对象，用于 Class 组件

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

创建一个消费 Context 对象，用于 Function 组件

```jsx
<MyContext.Consumer>
  {value => /* 基于 context 值进行渲染*/}
</MyContext.Consumer>
```

这里，React 组件也可以订阅到 context 变更。这能让你在函数式组件中完成订阅 context。

## Refs 转发

ref 一般用于获取组件 Dom 叶节点，但是若需要在父组件获取子组件的 Dom 的 ref，则需要 ref 转发
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

> 我们通过调用 React.createRef 创建了一个 React ref 并将其赋值给 ref 变量。
> 我们通过指定 ref 为 JSX 属性，将其向下传递给 <FancyButton ref={ref}>。
> React 传递 ref 给 forwardRef 内函数 (props, ref) => ...，作为其第二个参数。
> 我们向下转发该 ref 参数到 <button ref={ref}>，将其指定为 JSX 属性。
> 当 ref 挂载完成，ref.current 将指向 <button> DOM 节点。

## 高阶组件

[官网](https://react.docschina.org/docs/higher-order-components.html)
高阶组件（HOC）是 React 中用于复用组件逻辑的一种高级技巧。HOC 自身不是 React API 的一部分，它是一种基于 React 的组合特性而形成的设计模式。

### 使用 HOC 解决横切关注点问题

- React 之前建议使用 mixins 用于解决横切关注点相关的问题，但 mixins 会产生更多麻烦
- Render Props 也会解决横切面问题，但更强调的是复用状态逻辑

```js
const EnhancedComponent = higherOrderComponent(WrappedComponent);
```

具体而言，高阶组件是参数为组件，返回值为新组件的函数。组件是将 props 转换为 UI，而高阶组件是将组件转换为另一个组件。

在 higherOrderComponent 组件中做一些公共的处理，例如生命周期，订阅消息等内容；
WrappedComponent 相当于继承其公共内容完成 UI 处理。

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
        data: selectData(DataSource, props),
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
        data: selectData(DataSource, this.props),
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
3. Refs 不会被传递，需要使用 React.forwardRef API 来 ref 转发

## Render Props

语 “render prop” 是指一种在 React 组件之间使用一个值为函数的 prop 共享代码的简单技术
具有 render prop 的组件接受一个函数，该函数返回一个 React 元素并调用它而不是实现自己的渲染逻辑。

在 DataProvider 组件中状态控制 data 值，通过 render prop 控制根据 data 状态值渲染内容

```jsx
<DataProvider render={(data) => <h1>Hello {data.target}</h1>} />
```

注：

- prop 参数名可以不为 render
- React.PureComponent 不可用于 render prop，因为该组件 props 是浅比较，render prop 函数总会是比较为 false 而重新 render，可以将 render prop 定义为一个实例函数解决

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
  const [fruit, setFruit] = useState("banana");
  const [todos, setTodos] = useState([{ text: "Learn Hooks" }]);
  // ...
}
```

数组解构的语法让我们在调用 useState 时可以给 state 变量取不同的名字。当然，这些名字并不是 useState API 的一部分。React 假设当你多次调用 useState 的时候，你能保证每次渲染时它们的调用顺序是不变的。

### Effect

它跟 class 组件中的 componentDidMount、componentDidUpdate 和 componentWillUnmount 具有相同的用途，只不过被合并成了一个 API。
数据获取，设置订阅以及手动更改 React 组件中的 DOM 都属于副作用，简称为“作用（Effect）”。

```js
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

对于有清除操作的 effect 同样适用 3. 如果想执行只运行一次的 effect（仅在组件挂载和卸载时执行），可以传递一个空数组（[]）作为第二个参数。这就告诉 React 你的 effect 不依赖于 props 或 state 中的任何值，所以它永远都不需要重复执行。

### 自定义 Hook

有时候我们会想要在组件之间重用一些状态逻辑。目前为止，有两种主流方案来解决这个问题：高阶组件和 render props。自定义 Hook 可以让你在不增加组件的情况下达到同样的目的。
即通过 State 和 Effec 的组合达到封装状态逻辑的目的。

```js
import React, { useState, useEffect } from "react";

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
- 只能在 React 的函数组件中调用 Hook。不要在其他 JavaScript 函数中调用（除了自定义 Hook）。
  使用 eslint-plugin-react-hooks ESLint 插件来强制执行这两条规则

- React 16.8.0，React Native 0.59 及以上版本支持 Hook

### FAQ

#### Hook 会替代 render props 和高阶组件吗？

通常，render props 和高阶组件只渲染一个子节点。我们认为让 Hook 来服务这个使用场景更加简单。这两种模式仍有用武之地，（例如，一个虚拟滚动条组件或许会有一个 renderItem 属性，或是一个可见的容器组件或许会有它自己的 DOM 结构）。但在大部分场景下，Hook 足够了，并且能够帮助减少嵌套。

## 调和 Diff 算法

diff 算法用于计算出两个 virtual dom 的差异，是 react 中开销最大的地方。
传统 diff 算法通过循环递归对比差异，算法复杂度为 O(n3)。
react diff 算法制定了三条策略，将算法复杂度从 O(n3)降低到 O(n)。

- WebUI 中 DOM 节点跨节点的操作特别少，可以忽略不计。
- 拥有相同类的组件会拥有相似的 DOM 结构。拥有不同类的组件会生成不同的 DOM 结构。
- 同一层级的子节点，可以根据唯一的`ID`来区分。

针对这三个策略，react diff 实施的具体策略是:

1. diff 对树进行分层比较，只对比两棵树同级别的节点。跨层级移动节点，将会导致节点删除，重新插入，无法复用。
2. diff 对组件进行类比较，类相同的递归 diff 子节点，不同的直接销毁重建。diff 对同一层级的子节点进行处理时，会根据 key 进行简要的复用。两棵树中存在相同 key 的节点时，只会移动节点。

另外，在对比同一层级的子节点时:
diff 算法会以新树的第一个子节点作为起点遍历新树，寻找旧树中与之相同的节点。
如果节点存在，则移动位置。如果不存在，则新建一个节点。
在这过程中，维护了一个字段 lastIndex，这个字段表示已遍历的所有新树子节点在旧树中最大的 index。
在移动操作时，只有旧 index 小于 lastIndex 的才会移动。
例如：
旧节点 key：1,2,3,4
新节点 key：2,1,4,3
则遍历 lastIndex：2,2,4,4
[图解](https://segmentfault.com/a/1190000015648248)
这个顺序优化方案实际上是基于一个假设，大部分的列表操作应该是保证列表基本有序的。
可以推导，倒序的情况下，子节点列表 diff 的算法复杂度为 O(n2)

### 优化策略 1:减少 Diff 次数

减少 diff 算法触发次数实际上就是减少 update 流程的次数。
正常进入 update 流程有三种方式：

#### 1.setState

setState 机制在正常运行时，由于批更新策略，已经降低了 update 过程的触发次数。
因此，setState 优化主要在于非批更新阶段中(timeout/Promise 回调)，减少 setState 的触发次数。
常见的业务场景即处理接口回调时，无论数据处理多么复杂，保证最后只调用一次 setState。

#### 2.父组件 render

父组件的 render 必然会触发子组件进入 update 阶段（无论 props 是否更新）。此时最常用的优化方案即为 shouldComponentUpdate 方法。
最常见的方式为进行 this.props 和 this.state 的浅比较来判断组件是否需要更新。或者直接使用 PureComponent，原理一致。
需要注意的是，父组件的 render 函数如果写的不规范，将会导致上述的策略失效。

```js
// Bad case
// 每次父组件触发render 将导致传入的handleClick参数都是一个全新的匿名函数引用。
// 如果this.list 一直都是undefined，每次传入的默认值[]都是一个全新的Array。
// hitSlop的属性值每次render都会生成一个新对象
class Father extends Component {
  onClick() {}
  render() {
    return (
      <Child
        handleClick={() => this.onClick()}
        list={this.list || []}
        hitSlop={{ top: 10, left: 10 }}
      />
    );
  }
}
```

#### 3.forceUpdate

其中 forceUpdate 方法调用后将会直接进入 componentWillUpdate 阶段，无法拦截，因此在实际项目中应该弃用。

#### 其他优化策略

1. shouldComponentUpdate
   使用 shouldComponentUpdate 钩子，根据具体的业务状态，增加判断条件，可以减少不必要的 props 变化导致的渲染。如一个不用于渲染的 props 导致的 update。
   另外， 也要尽量避免在 shouldComponentUpdate 中做一些比较复杂的操作， 比如超大数据的 pick 操作等。

2. 合理设计 state，不需要渲染的 state，尽量使用实例成员变量。
   不需要渲染的 props，合理使用 context 机制，或公共模块（比如一个单例服务）变量来替换。

### 优化策略 2:正确使用 diff 算法

- 不使用跨层级移动节点的操作（同时尽量少使用 ref 操作）。
- 对于条件渲染多个节点时，尽量采用隐藏等方式切换节点，而不是替换节点。
- 尽量避免将后面的子节点移动到前面的操作，当节点数量较多时，会产生一定的性能问题。

## 概念

#### 挂载

组件挂载（插入 DOM 树中）

#### super(props)

在调用方法之前，子类构造函数无法使用 **this** 引用 `super()` 。
在 ES6 中，在子类的 `constructor` 中必须先调用 `super` 才能引用 `this` 。
在 `constructor` 中可以使用 `this.props`
**使用 props：**

```js
class MyComponent extends React.Component {
  constructor(props) {
    super(props);
    console.log(this.props); // Prints { name: 'sudheer',age: 30 }
  }
}
```

**不使用 props：**

```js
class MyComponent extends React.Component {
  constructor(props) {
    super();
    console.log(this.props); // Prints undefined
    // But Props parameter is still available
    console.log(props); // Prints { name: 'sudheer',age: 30 }
  }

  render() {
    // No difference outside constructor
    console.log(this.props); // Prints { name: 'sudheer',age: 30 }
  }
}
```

上面的代码片段揭示了 this.props 行为仅在构造函数中有所不同。外部构造函数相同。

#### 受控组件

在 HTML 当中，像 `<input>` , `<textarea> `, 和 `<select>` 这类表单元素会维持自身状态，并根据用户输入进行更新。但在 React 中，可变的状态通常保存在组件的状态属性中，并且只能用 setState() 方法进行更新。

##### 非受控组件

非受控组件，即组件的状态不受 React 控制的组件

```jsx
return <input />;
```

在这个最简单的输入框组件里,我们并没有干涉 input 中的 value 展示,即用户输入的内容都会展示在上面。

##### 收控组件

同样的，受控组件就是组件的状态受 React 控制。上面提到过，既然通过设置 input 的 value 属性, 无法改变输入框值,那么我们把它和 state 结合在一起,再绑定 onChange 事件,实时更新 value 值就行了。

```jsx
handleChange(e) {
  this.setState({value: e.target.value})
}
render() {
  return (
  	<input value={this.state.value} onChange={e => this.handleChange(e)}/>
  )
}
```

#### [Ref](https://react.docschina.org/docs/refs-and-the-dom.html)

React 支持一个特殊的、可以附加到任何组件上的 `ref` 属性。此属性可以是一个由 [`React.createRef()` 函数](https://react.docschina.org/docs/react-api.html#reactcreateref)创建的对象、或者一个回调函数、或者一个字符串（遗留 API）。当 `ref` 属性是一个回调函数时，此函数会（根据元素的类型）接收底层 DOM 元素或 class 实例作为其参数。这能够让你直接访问 DOM 元素或组件实例。

谨慎使用 ref。如果你发现自己经常使用 ref 来在应用中“实现想要的功能”，你可以考虑去了解一下[自上而下的数据流](https://react.docschina.org/docs/lifting-state-up.html)。

#### 协调
当组件的 props 或 state 发生变化时，React 通过将最新返回的元素与原先渲染的元素进行比较，来决定是否有必要进行一次实际的 DOM 更新。当它们不相等时，React 才会更新 DOM。这个过程被称为“协调”。

#### Fiber

除了进程（Process）和线程（Thread）的概念，在计算机科学中还有一个概念叫做 Fiber，英文含义就是“纤维”，意指比 Thread 更细的线，也就是比线程(Thread)控制得更精密的并发处理机制。

React Fiber 并不是所谓的纤程（微线程、协程），而是一种基于浏览器的单线程调度算法，背后的支持 API 是大名鼎鼎的：requestIdleCallback。
Fiber 是一种将 recocilation （递归 diff），拆分成无数个小任务的算法；它随时能够停止，恢复。停止恢复的时机取决于当前的一帧（16ms）内，还有没有足够的时间允许计算。

React Fiber 把一个耗时长的任务分成很多小片，每一个小片的运行时间很短，虽然总时间依然很长，但是在每个小片执行完之后，都给其他任务一个执行的机会，这样唯一的线程就不会被独占，其他任务依然有运行的机会。
React Fiber 把更新过程碎片化，每执行完一段更新过程，就把控制权交还给 React 负责任务协调的模块，看看有没有其他紧急任务要做，如果没有就继续去更新，如果有紧急任务，那就去做紧急任务。

维护每一个分片的数据结构，就是 Fiber。

## 路由原理
说到 React 我们一定离不开和 Router 打交道。不管 Vue Router 和 React Router ，他们的原理都是差不多的。这篇文章会从一个简单的例子一直拓展到真正的 React Router。

什么是路由

路由（routing）是指分组从源到目的地时，决定端到端路径的网络范围的进程
上面就是百度百科对路由的定义。比如我想去某个地方，那这个东西就带我去那个地方，这个东西就叫路由。

一个例子

先来说说需求，假设我们有两个组件 Login 和 Register，和两个对应的按钮。点击 Login 按钮就显示 Login 组件，点击 Register 显示 Register 组件。

我们这里使用 Hooks API 来创建 App 组件的自身状态。UI 代表了当前显示的是哪个组件的名字。

```js
function Login() {
  return <div>Register</div>;
}

function Register() {
  return <div>Login</div>;
}

function App() {
  let [UI, setUI] = useState('Login');
  let onClickLogin = () => {
    setUI('Login')
  }
  let onClickRegister = () => {
    setUI('Register') 
  }
  let showUI = () => {
    switch(UI) {
      case 'Login':
        return <Login/>
      case 'Register':
        return <Register/>
    }
  }
  return (
    <div className="App">
      <button onClick={onClickLogin}>Login</button>
      <button onClick={onClickRegister}>Register</button>
      <div>
          {showUI()}
      </div>
    </div>
  );
}
```
这个其实就是路由的雏形了，每个页面对应着一个组件，然后在不同状态下去切换 。

### 使用 hash 来切换

hash 属性是一个可读可写的字符串，该字符串是 URL 的锚部分（从 # 号开始的部分）

当然我们更希望看到的是

不同 url -> 不同页面 -> 不同组件

我们先用 url 里的 hash 做尝试：

在进入页面的时候获取当前 url 的 hash 值，根据这个 hash 值去更新 UI 从而通过 showUI() 来切换到对应的组件
同时添加 onClick 事件点击不同按钮时，就在 url 设置对应的 hash，并切换对应的组件
这时候组件 App 可以写成这样：

```js
function App() {
  // 进入页面时，先初始化当前 url 对应的组件名
  let hash = window.location.hash
  let initUI = hash === '#login' ? 'login' : 'register'

  let [UI, setUI] = useState(initUI);
  let onClickLogin = () => {
    setUI('Login')
    window.location.hash = 'login'
  }
  let onClickRegister = () => {
    setUI('Register') 
    window.location.hash = 'register'
  }
  let showUI = () => {
    switch(UI) {
      case 'Login':
        return <Login/>
      case 'Register':
        return <Register/>
    }
  }
  return (
    <div className="App">
      <button onClick={onClickLogin}>Login</button>
      <button onClick={onClickRegister}>Register</button>
      <div>
          {showUI()}
      </div>
    </div>
  );
}
```

这样其实已经满足我们的要求了，如果我在地址栏里输入 localhost:8080/#login，就会显示 <Login/>。但是这个 “#” 符号不太好看，如果输入 localhost:8080/login 就完美了。

### 使用 pathname 切换

pathname 属性是一个可读可写的字符串，可设置或返回当前 URL 的路径部分。

如果要做得像上面说的那样，我们只能用 window.location.pathname 去修改 url 了。只要把上面代码里的 hash 改成 pathname 就好了，那么组件 App 可以写成这样：

```js
function App() {
  // 进入页面时，先初始化当前 url 对应的组件名
  let pathname = window.location.pathname
  let initUI = pathname === '/login' ? 'login' : 'register'

  let [UI, setUI] = useState(initUI);
  let onClickLogin = () => {
    setUI('Login')
    window.location.pathname = 'login'
  }
  let onClickRegister = () => {
    setUI('Register') 
    window.location.pathname = 'register'
  }
  let showUI = () => {
    switch(UI) {
      case 'Login':
        return <Login/>
      case 'Register':
        return <Register/>
    }
  }
  return (
    <div className="App">
      <button onClick={onClickLogin}>Login</button>
      <button onClick={onClickRegister}>Register</button>
      <div>
          {showUI()}
      </div>
    </div>
  );
}
```

但是这里有个问题，每次修改 pathname 的时候页面会刷新，这是完全不符合我们的要求的，还不如用 hash 好。

### 使用 history 切换

幸运的是 H5 提供了一个好用的 history API，使用 window.history.pushState() 使得我们即可以修改 url 也可以不刷新页面，一举两得。

现在只需要修改点击回调里的 window.location.pathname = 'xxx' 就可以了，用 window.history.pushState() 去代替。

```js
function App() {
  // 进入页面时，先初始化当前 url 对应的组件名
  let pathname = window.location.pathname
  let initUI = pathname === '/login' ? 'login' : 'register'

  let [UI, setUI] = useState(initUI);
  let onClickLogin = () => {
    setUI('Login')
    window.history.pushState(null, '', '/login')
  }
  let onClickRegister = () => {
    setUI('Register') 
    window.history.pushState(null, '', '/register')
  }
  let showUI = () => {
    switch(UI) {
      case 'Login':
        return <Login/>
      case 'Register':
        return <Register/>
    }
  }
  return (
    <div className="App">
      <button onClick={onClickLogin}>Login</button>
      <button onClick={onClickRegister}>Register</button>
      <div>
          {showUI()}
      </div>
    </div>
  );
}
```

到此，一个 Router 就已经被我们实现了。当然这个 Router 功能不多，不过这就是 Vue Router 和 React Router 的思想，他们是基于此来开发更多的功能而已。

### 约束

在前端使用路由要有个前提，那就是后端要将全部的路径都指向首页，即 index.html。否则后端会出现 404 错误。

什么叫全部路径都指向首页呢？我们想一下正常的多页网页是怎么样的：如果访问了一个不存在的路径，如 localhost:8080/fuck.html，那么后端会返回一个 error.html，里面内容显示 “找不到网页”，这种情况就是后端处理网页的路由了。因为正是后端根据不同 url 返回不同的 xxx.html 呀。

如果前端使用路由，那么后端将全部路径都指向 index.html。当我们访问到一个不存在路径时，如 localhost:8080/fuck，后端不管三七二十一返回 index.html。但是这个 index.html 里有我们写的 JS 代码（React 打包后的）呀，这 JS 代码其中就包含了我们做的路由。所以我们的路由发现不存在这个路径时，就切换到 Error 组件来充当 “找不到网页” 的 HTML 文件。这就叫前端控制路由。

### React Router

react-router 和 react-router-dom

- react-router: 实现了路由的核心功能。
- react-router-dom: 基于react-router，加入了在浏览器运行环境下的一些功能。
- react-router-native: 基于react-router，加入了在React Native 运行环境下的一些功能。

实际上React Native推荐使用基于原生路由的react-navigation

### 重构

使用了 React Router 之后代码就可以精简成下面这样了。

```js
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function Login() {
  return <div>Register</div>;
}

function Register() {
  return <div>Login</div>;
}

function App() {
  return (
    <Router>
        <div className="App">
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>

            <Route path="/login" component={Login}></Route>
            <Route path="/register" component={Register}></Route>
        </div>
    </Router>

  );
}
```

可以看到 React Router 帮我们做了很多的事。比如正则的匹配，路由的切换等等。

