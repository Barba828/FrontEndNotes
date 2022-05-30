## MutationObserver

MutationObserver 接口提供了监视对 DOM 树所做更改的能力, MutationObserver()创建并返回一个新的 MutationObserver 它会在指定的 DOM 发生变化时被调用。

```js
// 选择需要观察变动的节点
const targetNode = document.getElementById("some-id");

// 观察器的配置（需要观察什么变动）
const config = { attributes: true, childList: true, subtree: true };

// 当观察到变动时执行的回调函数
const callback = function (mutationsList, observer) {
  // Use traditional 'for loops' for IE 11
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      console.log("A child node has been added or removed.");
    } else if (mutation.type === "attributes") {
      console.log("The " + mutation.attributeName + " attribute was modified.");
    }
  }
};

// 创建一个观察器实例并传入回调函数
const observer = new MutationObserver(callback);

// 以上述配置开始观察目标节点
observer.observe(targetNode, config);

// 之后，可停止观察
observer.disconnect();
```

## requestAnimationFrame

每一帧开始时执行

## requestIdleCallback

每一帧结束时还有空余时间执行（实验性方法），并不一定会执行，因为一帧 16ms 内没有执行之前的任务完毕，就会进入下一帧

## unhandledrejection

Promise 的 reject 异常上报，这可能发生在 window 下，但也可能发生在 Worker 中。
unhandledrejection 继承自 PromiseRejectionEvent，而 PromiseRejectionEvent 又继承自 Event。因此 unhandledrejection 含有 PromiseRejectionEvent 和 Event 的属性和方法。

```js
window.addEventListener("unhandledrejection", (event) => {
  console.warn(`UNHANDLED PROMISE REJECTION: ${event.reason}`);
});
```
