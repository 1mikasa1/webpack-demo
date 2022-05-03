import _ from 'lodash';
import a from './obj'

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

  a.value+=1
  console.log('a', a)
  return element;
}

document.body.appendChild(component());