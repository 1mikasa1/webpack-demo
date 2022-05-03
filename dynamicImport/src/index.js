async function getComponent() {
  const element = document.createElement('div');
  /**
   * 1. 动态导入chunk，返回一个promise
   * 2. 使用default是因为 webpack 4 在导入 CommonJS 模块时，将不再解析为 module.exports 的值，而是为 CommonJS 模块创建一个 artificial namespace 对象
   * */
  const { default: _ } = await import('lodash');

  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  return element;
}
getComponent().then((component) => {
  document.body.appendChild(component);
});