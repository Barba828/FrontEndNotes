[React Navigation 官网文档](https://reactnavigation.org/docs/)

## 普通路由
- name属性为路由对象名称
- component属性也可以是回调函数()=>{<View></View>}，返回React.Element
- 引入依赖，创建导航：
```js
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
const Stack = createStackNavigator();
```
- 使用导航：
```js
<NavigationContainer>
    <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
    </Stack.Navigator>
</NavigationContainer>
```
### 路由操作
#### 使用路由
```js
<Button
    title="Go to Details... again"
    onPress={() => navigation.push('Details')}
/>
```
#### 路由栈方法
```js
// 跳转
navigation.navigate('Details')
// 返回
navigation.goBack()
// push入栈
navigation.push('Details')
// pop 栈顶
navigation.popToTop()
```

#### 路由传值
```js
// 传值
<Button
    title="Go to Details"
    onPress={() => {
        /* 1. Navigate to the Details route with params */
        navigation.navigate('Details', {
            itemId: 86,
            otherParam: 'anything you want here',
        });
    }}
/>

// 取值
route.params.itemId;
route.params.otherParam;

// 设置值
navigation.setParams();
```

### 顶栏
#### 顶栏标题
- 普通文本设置
```js
function StackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'My home' }}
      />
    </Stack.Navigator>
  );
}
```
- 回调函数设置
```js
options={({ route }) => ({ title: route.params.name })}
```
##### 参数设置
```js
navigation.setOptions()
//例
<Button
  title="Update the title"
  onPress={() => navigation.setOptions({ title: 'Updated!' })}
/>
```
##### 样式设置
```js
//	单页面设置
<Stack.Screen
    name="Home"
    component={HomeScreen}
    options={{
        title: 'My home',	//标题文本
        headerStyle: {		//头部整体样式
        	backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',	//头部文字颜色
        headerTitleStyle: {			//头部文字样式
        	fontWeight: 'bold',
        },
    }}
/>
//	页面公共设置
<Stack.Navigator
    screenOptions={{	//该Navigator下公共设置
        headerStyle: {
            backgroundColor: '#f4511e',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
            fontWeight: 'bold',
        },
    }}
>
<Stack.Screen
    name="Home"
    component={HomeScreen}
    options={{ title: 'My home' }}
/>
</Stack.Navigator>
```
注：options.title属性也可以是React.Node（也可以是回调函数返回Node）

#### 顶栏按钮
```js
options={{
    headerTitle: props => <LogoTitle {...props} />,
    headerRight: () => (
        <Button
            onPress={() => alert('This is a button!')}
            title="Info"
            color="#fff"
        />
    ),
}}
```
注：
- 定义options内内容时，与该实例无关，即无法使用实例的setState()等方法（因为导航栏不属于该实例）
- 若需实例与导航顶栏交互，则需要使用setOptions()方法动态修改顶部参数

##### 自定义按钮
- headerBackTitle 返回按钮文本
- headerTruncatedBackTitle 返回按钮文本（小）
- headerBackImage 返回按钮
- headerLeft 自定义React Element，可重写onPress()

### Tab标签栏

基础用法

```js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
```

#### Navigator参数

组件接受以下道具：`Tab.Navigator`

##### [#](https://reactnavigation.org/docs/bottom-tab-navigator/#initialroutename)`initialRouteName`

要在导航器的第一个负载上呈现的路由的名称。

##### [#](https://reactnavigation.org/docs/bottom-tab-navigator/#screenoptions)`screenOptions`

用于导航器中屏幕的默认选项。

##### [#](https://reactnavigation.org/docs/bottom-tab-navigator/#backbehavior)`backBehavior`

后退按钮处理的行为。

- `initialRoute`返回到初始选项卡
- `order`返回到上一个选项卡（按选项卡栏中显示的顺序）
- `history`返回到上次访问选项卡
- `none`不处理后退按钮

##### [#](https://reactnavigation.org/docs/bottom-tab-navigator/#tabbar)`tabBar`

返回要显示为选项卡栏的 React 元素的函数。

##### [#](https://reactnavigation.org/docs/bottom-tab-navigator/#tabbaroptions)`tabBarOptions`

包含默认选项卡栏组件的道具的对象。如果使用自定义选项卡栏，这些选项卡栏将作为道具传递到选项卡栏，您可以处理它们。

#### Screen参数

```js
<Tab.Screen
	name="Home"
	component={Project}
	options={{
         tabBarLabel: '项目',
         tabBarIcon: ({color, size}) => (<Svg icon="tab-project" size={size} color={color} />),
         tabBarBadge: 3,
	}}
/>
```



以下[选项](https://reactnavigation.org/docs/screen-options)可用于配置导航器中的屏幕：

##### [#](https://reactnavigation.org/docs/bottom-tab-navigator/#title)`title`

可用作 和 的回退的泛型标题。`headerTitle``tabBarLabel`

##### [#](https://reactnavigation.org/docs/bottom-tab-navigator/#tabbarvisible)`tabBarVisible`

true`或 显示或隐藏选项卡栏，如果未设置，则默认为 。`false``true

##### [#](https://reactnavigation.org/docs/bottom-tab-navigator/#tabbaricon)`tabBarIcon`

给出的函数返回 React.Node，以显示在选项卡栏中。`{ focused: boolean, color: string, size: number }`

##### [#](https://reactnavigation.org/docs/bottom-tab-navigator/#tabbarlabel)`tabBarLabel`

选项卡栏或给出的函数中显示的选项卡的标题字符串返回 React.Node，以显示在选项卡栏中。未定义时，使用场景。若要隐藏，请参阅上一节。`{ focused: boolean, color: string }``title``tabBarOptions.showLabel`

##### [#](https://reactnavigation.org/docs/bottom-tab-navigator/#tabbarbadge)`tabBarBadge`

要在选项卡图标上的徽章中显示的文本。接受 或 。`string``number`

##### [#](https://reactnavigation.org/docs/bottom-tab-navigator/#tabbarbutton)`tabBarButton`

返回要渲染为选项卡栏按钮的 React 元素的函数。它包装图标和标签和实现 。默认情况下呈现。 将改为使用。`onPress``TouchableWithoutFeedback``tabBarButton: props => <TouchableOpacity {...props} />``TouchableOpacity`

##### [#](https://reactnavigation.org/docs/bottom-tab-navigator/#tabbaraccessibilitylabel)`tabBarAccessibilityLabel`

选项卡按钮的辅助功能标签。当用户点击选项卡时，屏幕阅读器将读取此内容。如果没有选项卡的标签，建议设置此选项。

##### [#](https://reactnavigation.org/docs/bottom-tab-navigator/#tabbartestid)`tabBarTestID`

用于在测试中找到此选项卡按钮的 ID。

##### [#](https://reactnavigation.org/docs/bottom-tab-navigator/#unmountonblur)`unmountOnBlur`

离开屏幕时是否应卸载此屏幕。取消安装屏幕将重置屏幕中的任何本地状态以及屏幕中嵌套导航器的状态。默认值为 。`false`

通常，我们不建议启用此道具，因为用户不希望在切换选项卡时丢失其导航历史记录。如果您启用此道具，请考虑这是否真的会为用户提供更好的体验。

### Drawer标签栏
```js
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
```

#### 抽屉方法

##### 开关

```js
// 打开抽屉
navigation.openDrawer();
// 关闭抽屉
navigation.closeDrawer();
// 切换抽屉
navigation.toggleDrawer();
```

##### 调度

```js
navigation.dispatch(DrawerActions.openDrawer());
navigation.dispatch(DrawerActions.closeDrawer());
navigation.dispatch(DrawerActions.toggleDrawer());
```

##### 状态

```js
import { useIsDrawerOpen } from '@react-navigation/drawer';
// 判断抽屉开关状态
const isDrawerOpen = useIsDrawerOpen();
```

### 生命周期

#### focus
路由聚焦时触发该监听函数
```js
navigation.addListener('focus', () => {
    // Screen was focused
    // Do something
});
```
#### blur
路由失焦时触发该监听函数
```js
navigation.addListener('blur', () => {
    // Screen was focused
    // Do something
});
```

