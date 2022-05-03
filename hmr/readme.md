### 定义
Webpack中的模块热替换指的就是在应用运行过程中实时替换某个模块，而应用的运行状态不受影响。

### HMR并非开箱即用
Webpack中的HMR需要手动通过代码处理热模块替换逻辑。
```
if (module.hot) {
  module.hot.accept([...path], function() {
    ...
  })
}
```
**为什么css样式不需要专门写逻辑？**
因为css文件的热更新有loader有处理，用新的样式直接替换旧的

### 修改了任何非module.hot.accept引入的js文件后，浏览器都会重新刷新
因为Webpack会监听当前项目下的文件，并在它们被修改后会重新编译。