# React Fiber

Fiber 是 React 16 中采用的新协调（reconciliation）引擎，主要目标是支持虚拟 DOM 的渐进式渲染。

Fiber 将原有的 Stack Reconciler 替换为 Fiber Reconciler，提高了复杂应用的可响应性和性能。主要通过以下方式达成目标：

- 对大型复杂任务的分片。
- 对任务划分优先级，优先调度高优先级的任务。
- 调度过程中，可以对任务进行挂起、恢复、终止等操作。

Fiber 对现有代码的影响： 由于 Fiber 采用了全新的调度方式，任务的更新过程可能会被打断，这意味着在组件更新过程中，render 及其之前的生命周期函数可能会调用多次。因此，在下列生命周期函数中不应出现副作用。

- shouldComponentUpdate
- React 16 中已经声明废弃的钩子
  - componentWillMount（UNSAFE_componentWillMount）
  - componentWillReceiveProps（UNSAFE_componentWillReceiveProps）
  - componentWillUpdate（UNSAFE_componentWillUpdate）

## 1.React 是如何工作的 ​

```js
import React from "react";
import ReactDOM from "react-dom";

function App() {
  return <div>Hello, HZFE.</div>;
}

ReactDOM.render(<App />, document.getElementById("root"));
```

上面代码中我们引入的两个包，分别代表了 React 的 core API 层和渲染层，在这背后还有一层被称为协调器（Reconcilers）的层次。（协调器在 `react-reconciler` 中实现）

一个 React 组件的渲染主要经历两个阶段：

- 调度阶段（Reconciler）：用新的数据生成一棵新的树，然后通过 Diff 算法，遍历旧的树，快速找出需要更新的元素，放到更新队列中去，得到新的更新队列。
- 渲染阶段（Renderer）：遍历更新队列，通过调用宿主环境的 API，实际更新渲染对应的元素。宿主环境如 DOM，Native 等。

对于调度阶段，新老架构中有不同的处理方式：

React 16 之前使用的是 Stack Reconciler（栈协调器），使用递归的方式创建虚拟 DOM，递归的过程是不能中断的。如果组件树的层级很深，递归更新组件的时间超过 16ms（以 60Hz 频率的显示器为例，浏览器绘制一帧的最小时间间隔为 1/60s 约等于 16ms），这时会发生俗称的掉帧现象，帧率不稳定时，用户就会感觉到卡顿。
![stack](https://user-images.githubusercontent.com/4338052/127518991-bea34058-35fc-4712-94d7-a3fc8df21df4.png)

React 16 及以后使用的是 Fiber Reconciler（纤维协调器），将递归中无法中断的更新重构为迭代中的异步可中断更新过程，这样就能够更好的控制组件的渲染。
![fiber](https://user-images.githubusercontent.com/4338052/127519057-56e3a47a-19b4-42b0-9ad6-02b543c633cc.png)

## 2.Fiber Reconciler 如何工作

由于浏览器中 JS 的运行环境是单线程的，因此，一旦有任务耗时过长，就会阻塞其他任务的执行，导致浏览器不能及时响应用户的操作，从而使用户体验下降。为解决这个问题，React 推出了 Fiber Reconciler 架构。

在 Fiber 中，会把一个耗时很长的任务分成很多小的任务片，每一个任务片的运行时间很短。虽然总的任务执行时间依然很长，但是在每个任务小片执行完之后，都会给其他任务一个执行机会。这样，唯一的线程就不会被独占，其他任务也能够得到执行机会。

为了实现渐进渲染的目的，Fiber 架构中引入了新的数据结构：Fiber Node，Fiber Node Tree 根据 React Element Tree 生成，并用来驱动真实 DOM 的渲染。

#### Fiber 节点的大致结构：

fiber 中最为重要的是 return、child、sibling 指针，连接父子兄弟节点以构成一颗单链表 fiber 树，其扁平化的**单链表结构**的特点将以往递归遍历改为了循环遍历，实现深度优先遍历。

之前的栈协调器是也是深度优先遍历，但是在树递归过程中不能中断，否则即使保存下中断的树节点也只能继续遍历该节点的子孙节点（传统树只有指向子节点指针，靠递归返回父节点），无法递归回父节点。而 fiber 结构保存了父子、兄弟节点的信息，可以通过指针连接，实现中断/恢复树遍历（实际上遍历顺序还是后序遍历：左右根）

```js
{
    tag: TypeOfWork, // 标识 fiber 类型
    type: 'div', // 和 fiber 相关的组件类型
    return: Fiber | null, // 父节点
    child: Fiber | null, // 子节点
    sibling: Fiber | null, // 同级节点
    alternate: Fiber | null, // diff 的变化记录在这个节点上
    ...
}
```

![节点树](https://pic2.zhimg.com/80/v2-d59b7d1d117625cf78a91d79a38a402d_1440w.jpg)
注：原来的节点树中断后无法继续遍历完整棵树

![Fiber树](https://pic4.zhimg.com/80/v2-516c085ca68b11b8c856fb8c9999bee7_1440w.jpg)
注：Fiber 树中断父子、兄弟节点的指针恢复遍历（本质上是一个链表）

#### Fiber 的主要工作流程：

这种数据结构之所以被叫做 fiber，因为 fiber 的翻译是纤程，它被认为是协程的一种实现形式。协程是比线程更小的调度单位：它的开启、暂停可以被程序员所控制。具体来说，react fiber 是通过 requestIdleCallback 这个 api 去控制的组件渲染的“进度条”。

1. ReactDOM.render() 引导 React 启动或调用 setState() 的时候开始创建或更新 Fiber 树。

2. reconciliation 阶段：从根节点开始遍历 Fiber Node Tree， 并且构建 workInProgress Tree。

   - 本阶段可以暂停、终止、和重启，会导致 react 相关生命周期重复执行。
   - React 会生成两棵树，一棵是代表当前状态的 current tree，一棵是待更新的 workInProgress tree。
   - 遍历 current tree，重用或更新 Fiber Node 到 workInProgress tree，workInProgress tree 完成后会替换 current tree。
   - 为每个节点创建更新任务。

3. 将创建的更新任务加入任务队列，等待调度。

   - 调度由 scheduler 模块完成，其核心职责是执行回调。
   - scheduler 模块实现了跨平台兼容的 requestIdleCallback。
   - 每处理完一个 Fiber Node 的更新，可以中断、挂起，或恢复。

4. commit 阶段：递归遍历 Fiber 树进行更新，通过 subtreeFlags 做遍历时的优化，将所有变更一次性更新到 DOM 上
   - 这一阶段的工作会导致用户可见的变化。因此该过程不可中断，必须一直执行直到更新完成。

注：
之前是在 reconciliation 阶段通过 EffectList 创建更新任务，commit 阶段遍历 Effect List 来更新到 DOM（已弃用 https://github.com/facebook/react/pull/19673 ）

注：
requestIdleCallback：宏任务，空闲时触发回调（即一帧 16ms 完成浏览器任务后后还有富余时间， 相对应的是 requestAnimationFrame，在每一帧任务开始都会执行），是浏览器实验性功能，react 里使用的是 scheduler 自己实现的 polyfill 版 requestIdleCallback（浏览器 requestIdleCallback 有兼容性问题，且触发时间 50ms 不满足性能需求）

![fiber](https://user-images.githubusercontent.com/4338052/127530996-23513132-f3ef-4a3e-8553-8bfef2e3669b.png)
注：空闲时间即开始 React schedule 的 requestIdleCallback

##### current 与 workInProgress

- React 在 render 第一次渲染时，会通过 React.createElement 创建一颗 Element 树，可以称之为 Virtual DOM Tree，由于要记录上下文信息，加入了 Fiber，每一个 Element 会对应一个 Fiber Node，将 Fiber Node 链接起来的结构成为 Fiber Tree。它反映了用于渲染 UI 和映射应用状态。这棵树通常被称为 current 树（当前树，记录当前页面的状态）。

- workInProgress 树当 React 经过 current 当前树时，对于每一个先存在的 fiber 节点，它都会创建一个替代（alternate）节点，这些节点组成了 workInProgress 树。这个节点是使用 render 方法返回的 React 元素的数据创建的。一旦更新处理完以及所有相关工作完成，React 就有一颗替代树来准备刷新屏幕。一旦这颗 workInProgress 树渲染（render）在屏幕上，它便成了当前树。下次进来会把 current 状态复制到 WIP 上，进行交互复用，而不用每次更新的时候都创建一个新的对象，消耗性能。这种同时缓存两棵树进行引用替换的技术被称为双缓冲技术。

- alternate fiber 可以理解为一个 fiber 版本池，用于交替记录组件更新（切分任务后变成多阶段更新）过程中 fiber 的更新，因为在组件更新的各阶段，更新前及更新过程中 fiber 状态并不一致，在需要恢复时（如发生冲突），即可使用另一者直接回退至上一版本 fiber。
  Dan 在 Beyond React 16 演讲中用了一个非常恰当的比喻，那就是 Git 功能分支，你可以将 WIP 树想象成从旧树中 Fork 出来的功能分支，你在这新分支中添加或移除特性，即使是操作失误也不会影响旧的分支。当你这个分支经过了测试和完善，就可以合并到旧分支，将其替换掉。

# 组件复用

HOC / Render Props / Hooks 三种写法都可以提高代码的复用性，但实现方法不同：HOC 是对传入的组件进行增强后，返回新的组件给开发者；Render Props 是指将一个返回 React 组件的函数，作为 prop 传给另一个 React 组件的共享代码的技术；Hooks 是 React 提供的一组 API，使开发者可以在不编写 class 的情况下使用 state 和其他 React 特性。

## 1.HOC (Higher Order Component 高阶组件)

HOC 是 React 中复用代码的编程模式。具体来说，高阶组件是一个纯函数，它接收一个组件并返回一个新的组件。常见例子：React Redux 的 connect，将 Redux Store 和 React 组件联系起来。

```js
// react-redux connect 例子
const ConnectedMyComponent = connect(mapState)(MyComponent);
```

```js
// 实现一个简单的 HOC 例子
function logProps(WrappedComponent) {
  return class extends React.Component {
    componentDidUpdate(prevProps) {
      console.log("Current props: ", this.props);
      console.log("Previous props: ", prevProps);
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  };
}
```

ts js react 代码 1hour

leader 面试

hr 面试

## 2.Render Props​

Render Props 是 React 中复用代码的编程模式。主要解决组件逻辑相同而渲染规则不同的复用问题。常见例子：React Router 中，自定义 render 函数，按需使用 routeProps 来渲染业务组件。

```js
ReactDOM.render(
  <Router>
    <Route
      path="/home"
      render={(routeProps) => (
        <div>Customize HZFE's {routeProps.location.pathname}</div>
      )}
    />
  </Router>,
  node
);
```

## 3.React Hooks​

React Hooks 是 React 16.8 引入的一组 API。开发者可以在不使用 class 写法的情况下，借助 Hooks 在纯函数组件中使用状态和其他 React 功能。

```jsx
function Example() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}
```

## HOC vs Render Props vs Hooks​

#### 痛点 ​

在实际业务快速迭代过程中，组件常出现大量重复性工作，少量个性化定制的需求，如果不遵循 DRY（Don't Repeat Yourself）的规则，会造成项目臃肿和难以维护的问题。较早的方案是使用 HOC / Render Props 进行重构，然而这两种方案都会改变组件层级，容易形成“嵌套地狱”，使得代码的可读性下降。而 React Hooks 则很好地解决了这个问题。

#### 方案优劣 ​

为辅助理解，可参考以下图片。图中所示为下拉列表功能的三种不同实现，相比于使用一个 Class 来书写下拉列表的所有功能，这三种方案都对组件进行了功能拆解，提高了代码的复用性。

![code](https://user-images.githubusercontent.com/17002181/125330248-194da900-e379-11eb-8bab-4fdcec795fb1.png)

# Hooks 原理

Hooks 是 React 16.8 的新增特性。它可以让你在不编写 class 的情况下使用 state 以及其他的 React 特性。

Hooks 主要是利用闭包来保存状态，使用链表保存一系列 Hooks，将链表中的第一个 Hook 与 Fiber 关联。在**Fiber 树更新**时，就能从 Hooks 中计算出最终输出的状态和执行相关的副作用。

使用 Hooks 的注意事项：

不要在循环，条件或嵌套函数中调用 Hooks。
只在 React 函数中调用 Hooks。

## 简化实现 ​

主要是通过闭包保存状态数组

### 状态 Hook​

模拟的 useState 实现中，通过闭包，将 state 保存在 memoizedState[cursor]。memoizedState 是一个数组，可以按顺序保存 hook 多次调用产生的状态。

```js
let memoizedState = [];
let cursor = 0;
function useState(initialValue) {
  // 初次调用时，传入的初始值作为 state，后续使用闭包中保存的 state
  let state = memoizedState[cursor] ?? initialValue;
  // 对游标进行闭包缓存，使得 setState 调用时，操作正确的对应状态
  const _cursor = cursor;
  const setState = (newValue) => (memoizedState[_cursor] = newValue);
  // 游标自增，为接下来调用的 hook 使用时，引用 memoizedState 中的新位置
  cursor += 1;
  return [state, setState];
}
```

实际的 useState 实现经过多方面的综合考虑，React 最终选择将 Hooks 设计为顺序结构，这也是 Hooks 不能条件调用的原因。

```js
function mountState<S>(
  initialState: (() => S) | S
): [S, Dispatch<BasicStateAction<S>>] {
  // 创建 Hook，并将当前 Hook 添加到 Hooks 链表中
  const hook = mountWorkInProgressHook();
  // 如果初始值是函数，则调用函数取得初始值
  if (typeof initialState === "function") {
    initialState = initialState();
  }
  hook.memoizedState = hook.baseState = initialState;
  // 创建一个链表来存放更新对象
  const queue = (hook.queue = {
    pending: null,
    dispatch: null,
    lastRenderedReducer: basicStateReducer,
    lastRenderedState: initialState,
  });
  // dispatch 用于修改状态，并将此次更新添加到更新对象链表中
  const dispatch: Dispatch<BasicStateAction<S>> = (queue.dispatch =
    (dispatchAction.bind(null, currentlyRenderingFiber, queue): any));
  return [hook.memoizedState, dispatch];
}
```

### 副作用 Hook​

模拟的 useEffect 实现，同样利用了 memoizedState 闭包来存储依赖数组。依赖数组进行浅比较，默认的比较算法是 Object.is。

```js
function useEffect(cb, depArray) {
  const oldDeps = memoizedState[cursor];
  let hasChange = true;
  if (oldDeps) {
    // 对比传入的依赖数组与闭包中保存的旧依赖数组，采用浅比较算法
    hasChange = depArray.some((dep, i) => !Object.is(dep, oldDeps[i]));
  }
  if (hasChange) cb();
  memoizedState[cursor] = depArray;
  cursor++;
}
```

实际的 useEffect 实现：

```js
function mountEffect(
  create: () => (() => void) | void,
  deps: Array<mixed> | void | null
): void {
  return mountEffectImpl(
    UpdateEffect | PassiveEffect, // fiberFlags
    HookPassive, // hookFlags
    create,
    deps
  );
}
function mountEffectImpl(fiberFlags, hookFlags, create, deps): void {
  // 创建 hook
  const hook = mountWorkInProgressHook();
  const nextDeps = deps === undefined ? null : deps;
  // 设置 workInProgress 的副作用标记
  currentlyRenderingFiber.flags |= fiberFlags; // fiberFlags 被标记到 workInProgress
  // 创建 Effect, 挂载到 hook.memoizedState 上
  hook.memoizedState = pushEffect(
    HookHasEffect | hookFlags, // hookFlags 用于创建 effect
    create,
    undefined,
    nextDeps
  );
}
```

## Hooks 如何与 Fiber 共同工作 ​

在了解如何工作之前，先看看 Hook 与 Fiber 的部分结构定义：

```js
export type Hook = {
  memoizedState: any, // 最新的状态值
  baseState: any, // 初始状态值
  baseQueue: Update<any, any> | null,
  queue: UpdateQueue<any, any> | null, // 环形链表，存储的是该 hook 多次调用产生的更新对象
  next: Hook | null, // next 指针，之下链表中的下一个 Hook
};
```

```js
export type Fiber = {
  updateQueue: mixed, // 存储 Fiber 节点相关的副作用链表
  memoizedState: any, // 存储 Fiber 节点相关的状态值
  flags: Flags, // 标识当前 Fiber 节点是否有副作用
};
```

与上节中的模拟实现不同，真实的 Hooks 是一个单链表的结构，React 按 Hooks 的执行顺序依次将 Hook 节点添加到链表中。下面以 useState 和 useEffect 两个最常用的 hook 为例，来分析 Hooks 如何与 Fiber 共同工作。

在每个状态 Hook（如 useState）节点中，会通过 queue 属性上的循环链表记住所有的更新操作，并在 update 阶段依次执行循环链表中的所有更新操作，最终拿到最新的 state 返回。

![state](https://user-images.githubusercontent.com/4338052/130256374-80a453a4-2084-4bb8-bfba-2344f25100c4.png)

在每个副作用 Hook（如 useEffect）节点中，创建 effect 挂载到 Hook 的 memoizedState 中，并添加到环形链表的末尾，该链表会保存到 Fiber 节点的 updateQueue 中，在 commit 阶段执行。

![effect](https://user-images.githubusercontent.com/4338052/130258719-4a2ad7d5-3a0b-4f9c-b278-1f35a0b96843.png)
