function init3d (argument) {
  var body = document.querySelector('body');
}

function init3dElement (elem, depth) {
  var p = elem.parent;
  var box = document.createElement('div');
  var top = document.createElement('div');

  top.height = depth;
  top.width = elem.offsetWidth;

  box.style = 'width: ' + elem.offsetWidth + 'px; height: ' + depth + 'px; background: black; transform: rotateX(90deg) translateZ(' + depth/2 + 'px);'

  p.appendChild(box);
  box.appendChild(elem);
  box.appendChild(top);


}

function elemDepth (elem) {
  return elem.parentElement ? elemDepth(elem.parentElement) + 1 : 0;
}

var f = document.querySelector('.inspect3d-front');
console.log(elemDepth(f));
