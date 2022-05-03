import _ from 'lodash';
import printMe from './print.js';
import test from './test.js'
import './style.css'
function component() {
  const element = document.createElement('div');
  const btn = document.createElement('button');
  const input = document.createElement('input')
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');

  btn.innerHTML = 'Click me and check the console!';
  btn.onclick = function() {
    test()
    printMe()
  };

  element.appendChild(btn);
  element.appendChild(input)
  return element;
}

// document.body.appendChild(component());
let element = component(); // 存储 element，以在 print.js 修改时重新渲染
document.body.appendChild(element);

if (module.hot) {
  console.log('更新', module.hot)
  module.hot.accept('./print.js', function() {
    console.log('Accepting the updated printMe module!');
    // printMe();
    document.body.removeChild(element);
    element = component(); // 重新渲染 "component"，以便更新 click 事件处理函数
    document.body.appendChild(element);
  })
}