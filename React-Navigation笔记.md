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
