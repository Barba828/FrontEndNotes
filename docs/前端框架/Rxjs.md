## 入门

### 概念

#### Observable 可观察的物件

- 代表一组未来即将产生的**事件资料**（被观察的物件，产生 Stream）

#### Observe 观察者物件

- 代表一个用来接收「观察结果」的物件（收到的就是事件资料）
- 观察者物件就是一个物件包含 3 个含有回调的属性（next，error，complete）

#### Subscription 订阅物件

- 代表正在执行 Observable/Observe 的执行个体（可用来取消订阅）

#### Operators 操作符

- 函数编程（纯函数，没有副作用）
- 处理一系列的事件资料集合
- 常见的操作符有 map，filter，concat，flatMap，switchMap...

#### Subject 主体物件

- 如同 EventEmitter 一样，主要用来**广播**收到的事件资料给多位 Observer（观察者）
- 本身也是 Observe

#### Schedules 调度器

- 用来集中管理与调度多种事件之间的资料，以控制事件并发的情况（control concurrency）

### 案例释义

```js
import * as rxjs from "rxjs";

rxjs
  .interval(500) // Observable 产生资料，每500ms产生一个number
  .pipe(rxjs.operators.take(4)) //Operators 「pipe建立操作符Creation」、「take过滤操作符Filtering」
  .subscribe((x) => {
    console.log(x); // Observe 观察者
  }); // Subscription 订阅
```

#### 订阅事件

**订阅 Observable 类似于调用函数**

- 建立可观察的 Observable 物件

```js
// 所有的在document里的「click 事件」通过「fromEvent 操作符」产生了一个可观察的「Observable 物件」
// 定义clicks只是可观察物件，不会主动触发观察「click 事件」行为（即不会主动输出流 Stream），必须受到观察者的订阅
const clicks$ = rxjs.fromEvent(document, "click");
```

- 建立观察者物件

```js
// 观察者为包含回调的属性，入参即为可观察的「Observable 物件」的输出Stream
// 观察者同样在订阅后才可观察到「click 事件」行为时，回调其事件
const observer = { next: (x) => console.log(x) };
```

- 建立订阅物件（订阅 Observable 物件，并传入 Observer 物件）

```js
// 观察者在subscrible后才执行Observables的操作，即观察「click 事件」行为
const subs$ = clicks$.subscrible(observer);
// 单纯的订阅环境，简化observer写法
const subs$ = clicks$.subscrible((x) => console.log(x));
```

- 取消订阅 Subscription 物件

```js
subs$.unsubscrible();
```

#### 过滤资料

- 建立可观察的 Observable 物件

```js
const clicks$ = rxjs.fromEvent(document, "click");
```

- 使用 filter 操作符

```js
const { filter } = rxjs.operators;

const subs$ = clicks$
  // 使用pipe Api 传入 「Operator 操作符」过滤，过滤点击事件x轴小于100px的事件
  .pipe(filter((x) => x.clientX < 100))
  .subscrible((x) => console.log(x));
```

pipe：接水管（函数式操作），给 Stream 流接不同的操作（Operator）水管，可以有多个
如：

```js
const { filter, take } = rxjs.operators;

const subs$ = clicks$
  // 组合Operators，符合过滤条件，且只取4个（take Api取完会自动取消订阅）
  .pipe(
    filter((x) => x.clientX < 100),
    take(4)
  )
  .subscrible((x) => console.log(x));
```

#### Subject

- 建立主体物件 Subject，之后靠 Subject 进行广播 「Observable 事件」

```js
const subject = new rxjs.Subject();
```

- 「Observable 事件」每次触发都会被广播到的多个观察者接收到

```js
const clicks$ = rxjs.fromEvent(document, "click");
clicks$ = clicks$.pipe(take(2));
clicks$.subscrible(subject); //「Subject」本身也是一个 「Observe」

// 每次clicks$产生资料都会被subs1和subs2订阅到
let subs1$ = subject.subscrible(console.log);
let subs2$ = subject.subscrible(console.log);
```

### 注

Observable is able to subscribe to the Observer.
因为只有 Observable 实例有 subscribe 方法，在 RxJS 中没有 Observer 对象，Observer 只是一个接口，Subscriber 实例算是真正与 Observable 建立数据管道后的 Observer。Subscription 是两者建立订阅关系后的实例，Operator 不只有过滤的功能，我们可以创建自己的 Operator，Operator 是一个无副作用的纯函数，函数式编程是 RxJS 的核心，通过给数据管道中传入的数据流 subscribe 一个内部的 Observer,再对导出的数据流数据进行操作并返回一个新的 Observable 对象传递给下一个 Operator，这个部分就是 Iterator 设计模式的实现，所有的 Operator 都是这个套这个模式，只不过内部的逻辑不一样，而 Subscriber 在这里就是起到一个引用返回的这个新的 Observable 对象数据桥梁的作用。

## 操作符

### 组合操作符


```js
// combineLatest 实际上是从每个 source 取最新的响应值然后返回有x个元素的数组。每个 source 对应一个元素
Rx.Observable.combineLatest([ source_1, ...  source_n])
// 业务场景是当你对每个 source 的最新值感兴趣，而对过往的值不感兴趣，当然你要有一个以上想要组合的 source

//组合后的 observable 接收了第一个 source 的所有值然后先将它们发出，然后再接收 source 2的所有值，所以说 concat() 操作符中的 source 顺序很重要
Rx.Observable.concat([ source_1,... sournce_n ])
//当遇到应该优先考虑某个 source 的情况时，就要使用 concat 操作符

//可以将多个流合并成一个
Rx.Observable.merge(source_1, ...  source_n)

//以列为基础连接值的。它将采用最小的共同标准
Rx.Observable.zip(source_1, ...  source_n)
// 如果你真正关心不同 sources 在同一个位置所发出值的区别，假设所有 sources 的第2个响应值，那么你需要 zip操作符
```

