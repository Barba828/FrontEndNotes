[基础语法]](https://juejin.cn/post/7018805943710253086#heading-38)
[在线编辑器](https://www.typescriptlang.org/zh/play/)
[ES6 语法](https://juejin.cn/post/7046217976176967711)

## Type & Interface

用 Type 描述**类型关系**
用 Interface 描述**数据结构**

在程序设计中，Interface 和 Type 主要起到类型的限制和规范的作用，它们不关心实现细节，只规定和限制类或变量必须提供对应的属性和方法。

Interface 和 Type 核心的区别是 Type 不可在定义后重新添加内容，而 Interface 则总是可以扩展新内容。相比 Interface，Type 并没有实际创建一个新的类型，而是创建一个引用某个类型的名字。

### 基础语法

#### Interface

```ts
interface User {
  name: string;
  age: number;
}

interface SetUser {
  (name: string, age: number): void;
}

interface People extends User {
  gender: string;
}

class Company implements People {}
```

#### Type

```ts
type User = {
  name: string;
  age: number;
};

type SetUser = (name: string, age: number) => void;

type People = User & { gender: string };

class Company implements People {}
```

Interface 的 extends 和 Type 的交叉类型有一些细微区别：extends 中的同名字段的类型必须是兼容的。而交叉类型中出现了同名字段且类型不同时，则类型一般是 never。

### 区别

- 由于 type 定义的实际是一个别名，所以 type 可以声明基本类型别名，联合类型，元组等类型

```ts
// 基本类型别名
type Name = string;

// 联合类型
interface Dog {}
interface Cat {}
type Pet = Dog | Cat;

// 元组类型
type PetList = [Dog, Pet]; // 具体定义数组每个位置的类型
```

其他操作

```ts
type OnlyChar = "a" | "b" | "c";
type StringOrNumber = string | number;
type Text = string | { text: string };
type NameLookup = Dictionary<string, Person>;
type Callback<T> = (data: T) => void;
type Pair<T> = [T, T];
type Coordinates = Pair<number>;
type Tree<T> = T | { left: Tree<T>; right: Tree<T> };
```

- type 语句中还可以使用 typeof 获取实例的 类型进行赋值

```ts
let div = document.createElement("div");
type B = typeof div; // HTMLDivElement

function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<typeof f>; // { x: number; y: number; }
```

- type 可以使用 in 关键字动态生成属性，而 interface 的索引值必须是 string 或 number 类型，所以 interface 并不支持动态生成属性。

```js
type Language = "JavaScript" | "Go";
type Projects = {
  [key in Language]?: string[];
};
```

- interface 可以重复定义，并将合并所有声明的属性为单个接口

```ts
interface Point {
  x: number;
}
interface Point {
  y: number;
}

let point: Point = { x: 1, y: 2 };
```

## 类型守卫

自定义守卫通过 `{形参} is {类型}` 的语法结构，来给上述返回布尔值的条件函数赋予类型守卫的能力。例如：

```js
function betterIsString (input: any): input is string { // 返回类型改为了 `input is string`
  return typeof input === 'string';
}
```

这样 `betterIsString` 便获得了与 `typeof input == 'string'` 一样的守卫效果，并具有更好的代码复用性。

自定义实例：

```js
class SuperHero { // 超级英雄
  readonly name: string;
}
class Batman extends SuperHero { // 蝙蝠侠继承自超级英雄
  private muchMoney: true; // 私有很多钱
}

function isBatman (man: any): man is Batman {
  return man && man.helmet && man.underwear && man.belt && man.cloak;
}

function isIronman (man: any): man is Ironman {
  return 'mark' in man;
}

function foo (hero: SuperHero) {
  if (isBatman(hero)) {
    // hero 是蝙蝠侠
  } else {
    // hero 是别的超级英雄
  }
}
```

## 范型 & 方法

### 索引类型

T[K]表示对象 T 的属性 K 所表示的类型

```ts
// 通过[]索引类型访问操作符, 我们就能得到某个索引的类型
interface UserInfo {
  id: string;
  name: string;
}
type UserName = UserInfo["name"]; //type UserName = string

// T[K][]表示变量T取属性K的值的数组
function getValues<T, K extends keyof T>(person: T, keys: K[]): T[K][] {
  return keys.map((key) => person[key]);
}

const person: Person = {
  name: "musion",
  age: 35,
};
getValues(person, ["name", "age"]); // ['musion', 35]
```

### 映射类型

根据旧的类型创建出新的类型, 我们称之为映射类型

```ts
interface TestInterface {
  name: string;
  age: number;
}
```

我们把上面定义的接口里面的属性全部变成可选

```ts
// 我们可以通过+/-来指定添加还是删除

// 可选（Partial）
type OptionalTestInterface<T> = {
  [p in keyof T]+?: T[p];
};

type newTestInterface = OptionalTestInterface<TestInterface>;
// 与上面等价
type newTestInterface = {
  name?: string;
  age?: number;
};

// 只读（readonly）
type OptionalTestInterface<T> = {
  +readonly [p in keyof T]+?: T[p];
};
```

### 方法

#### Partial

`Partial<T>` 将类型的属性变成可选

```ts
type Partial<T> = {
  [P in keyof T]?: T[P];
};
```

#### Required

`Required<T>` 将类型的属性变成必选

```ts
type Required<T> = {
  [P in keyof T]-?: T[P];
};
```

#### Readonly

`Readonly<T>` 的作用是将某个类型所有属性变为只读属性，也就意味着这些属性不能被重新赋值

```ts
type Required<T> = {
  readonly [P in keyof T]: T[P];
};
```

#### Pick

`Pick<T, K extends keyof T>` 从某个类型中挑出一些属性出来

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};
```

#### Record

`Record<K extends keyof any, T>` 的作用是将 K 中所有的属性的值转化为 T 类型

```ts
type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```

#### ReturnType

`ReturnType<function>` 用来得到一个函数的返回值类型
infer 在这里用于提取函数类型的返回值类型

```ts
type ReturnType<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => infer R
  ? R
  : any;
```

#### Exclude

`Exclude<T, U>` 的作用是将某个类型中属于另一个的类型移除掉

```ts
type Exclude<T, U> = T extends U ? never : T;
```

#### Extract

`Extract<T, U>` 的作用是从 T 中提取出 U。

```ts
type Extract<T, U> = T extends U ? T : never;
```

#### Omit

`Omit<T, K extends keyof any>` 的作用是使用 T 类型中除了 K 类型的所有属性，来构造一个新的类型

```ts
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
```

#### NonNullable

`NonNullable<T>` 的作用是用来过滤类型中的 null 及 undefined 类型

```ts
type NonNullable<T> = T extends null | undefined ? never : T;
```

#### Parameters

`Parameters<T> ` 的作用是用于获得函数的参数类型组成的元组类型

```ts
type Parameters<T extends (...args: any) => any> = T extends (
  ...args: infer P
) => any
  ? P
  : never;
```
