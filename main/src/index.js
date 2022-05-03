import _ from 'lodash';
import './style.css';
// 此图像将被处理并添加到 output 目录，并且 MyImage 变量将包含该图像在处理后的最终 url。
import Icon from '../sources/icon.png';

import printMe from './print.js';

function component() {
  const element = document.createElement('div');
  const btn = document.createElement('button');

  // lodash 在当前 script 中使用 import 引入
  element.innerHTML = _.join(['Hello', 'webpack'], ' ');
  element.classList.add('hello');

  btn.innerHTML = 'Click me and check the console!';
  btn.onclick = printMe;

  element.appendChild(btn);

  // 将图像添加到我们已经存在的 div 中。
  const myIcon = new Image();
  myIcon.src = Icon;
  
  element.appendChild(myIcon);

  return element;
}

document.body.appendChild(component());