## 核心功能
将各种类型的资源，包括图片、css、js等，转译、组合、拼接、生成 JS 格式的 bundler 文件。
## 过程分析
**1.初始化参数**
  1. 初始化参数:从配置文件、 配置对象、Shell 参数中读取，与默认配置结合得出最终的参数
    具体分析：
      a.**命令参数+配置文件得到用户配置** 将 process.args + webpack.config.js 合并成用户配置
      b.**参数校验** 调用 validateSchema 校验配置
      c.**结合webpack默认配置** 调用 getNormalizedWebpackOptions + applyWebpackOptionsBaseDefaults 合并出最终配置
  2. 创建编译器对象：用上一步得到的参数创建 **Compiler** 对象
    > Compiler是webpack编译管理器，webpack 启动后会创建 compiler 对象，该对象一直存活知道结束退出，可以通过CLI或Node API传递的所有参数创建出一个Compiler 实例，调用该实例的run方法触发所有编译工作，所有的加载(loading)/打包(bundling)/写入(writing)工作均委托给各种插件。常用的方法和属性有run()、watch()、hooks、context等。
  3. 初始化编译环境：包括注入内置插件、注册各种模块工厂、初始化 RuleSet 集合、加载配置的插件等
    a.遍历用户定义的 plugins 集合，执行插件的 apply 方法
    b.**加载内置插件** 调用 new WebpackOptionsApply().process 方法
  4. 开始编译：执行 compiler 对象的 run 方法
  5. 确定入口：根据配置中的 entry 找出所有的入口文件，调用 compilition.addEntry 将入口文件转换为 **dependence** 对象
    > dependence为依赖对象，webpack 基于该类型记录模块间依赖关系

**2.构建阶段：**
  1. 编译模块(make)：根据 entry 对应的 dependence 创建 module 对象，调用 **loader** 将模块转译为标准 JS 内容，调用 JS 解释器将内容转换为 **AST** 对象，随后开始遍历AST，通过识别 require/ import 之类的导入语句找出该模块依赖的模块，再递归本步骤直到所有入口依赖的文件都经
  过了本步骤的处理。
  2. 完成模块编译：上一步递归处理所有能触达到的模块后，得到了每个模块被翻译后的内容以及它们之间的 依赖关系图(ChunkGraph)

**3.生成阶段：**
  1. 输出资源(触发compilation.seal函数)：根据入口和模块之间的依赖关系，组装成一个个包含多个模块的 Chunk，再把每个 Chunk 转换成一个单独的文件加入到输出列表
  > Compilation：单次编辑过程的管理器，运行过程中只有一个 compiler 但每次文件变更触发重新编译时(watch = true)，都会创建一个新的 compilation 对象
  **主要作用**：将module按**entry/动态引入**的规则分配给不同的 Chunk 对象，entry还有entry中引入的模块，组成了一个chunk，动态引入的模块，形成了一个新的chunk
  2. 写入文件系统(compilation.emitAssets)：在确定好输出内容后，根据配置确定输出的路径和文件名,生成assets集合，把文件内容写入到文件系统

## 插件
### 定义
一个带有apply函数的类，apply函数能接收到compiler作为参数，从而获取到compiler.hooks的各种钩子回回调，添加自己的处理函数事件。
### 常用钩子
compiler.hooks.compilation ：
  时机：启动编译创建出 compilation 对象后触发
  参数：当前编译的 compilation 对象
  示例：获取 compilation 实例
compiler.hooks.make：
  时机：正式开始编译时触发
  参数：同样是当前编译的 compilation 对象
  示例：webpack 内置的 EntryPlugin 基于此钩子实现 entry 模块的初始化
compilation.hooks.optimizeChunks ：
  时机：seal 函数中，chunk 集合构建完毕后触发
  参数：chunks 集合与 chunkGroups 集合
  示例：SplitChunksPlugin 插件基于此钩子实现 chunk 拆分优化
compiler.hooks.done：
  时机：编译完成后触发
  参数：stats 对象，包含编译过程中的各类统计信息
  示例：webpack-bundle-analyzer 插件基于此钩子实现打包分析