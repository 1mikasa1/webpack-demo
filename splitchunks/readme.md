## 定义
多入口打包存在公共模块或动态引入模块时，将公共模块提取成一个单独chunk

## 原理
作用于webpack生成阶段，compilation.seal函数会在第四阶段触发一个optimizeChunks钩子，此时能得到chunks集合，通过splitChunks的配置规则实现新增chunk
```
compilation.seal函数作用：
1. 遍历 compilation.modules ，记录下模块与 chunk 关系
2. 触发各种模块优化钩子，这一步优化的主要是模块依赖关系
3. 遍历 module 构建 chunk 集合
4. 触发各种优化钩子
```