### 定义
构建时删除导出但未引用的代码

### 实现前提
依赖ESM规范，导入导出语句只能位于模块顶层，从而在静态分析中即可确认哪些模块未被使用过。

### 原理
先**标记**出模块导出值中哪些没有被用过，然后使用 **Terser 删掉**这些没被用到的导出语句。
> optimization.usedExports = true

1. 构建阶段(make)， 收集模块导出变量并记录到模块依赖关系图ModuleGraph 变量中
2. 生成阶段(seal)， 遍历 ModuleGraph 标记模块导出变量有没有被使用
3. 生成产物时，若变量没有被其它模块使用则删除对应的导出语句 