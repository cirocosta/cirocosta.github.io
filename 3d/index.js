function throttle (fn, ms) {
  if (!(fn && ms)) throw new Error('both args must be passed');

  var _last = new Date((new Date()).getTime() - ms);

  return function () {
    if ((_last.getTime() + ms) <= (new Date()).getTime())
      return (_last = new Date(), fn.apply(this, arguments));
  }
}

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

var container = document.querySelector('.container');

var _lastMove = {x: 0, y: 0};
var _lastTick = Date.now();
var _degs = {
  x: 0.0,
  y: 0.0,
  z: 0.0
};

document.querySelector('body').addEventListener('mousemove', throttle(function (e) {
  var now = Date.now();

  if ((now - _lastTick) > 164)
    return (_lastMove.x = e.clientX,
            _lastMove.y = e.clientY,
            _lastTick = now);
  else
    _lastTick = now;

  if (!e.buttons)
    return;

  _degs.x += (e.clientX - _lastMove.x);
  _degs.y += (e.clientX - _lastMove.x);

  container.style = 'transform: rotateY(' + _degs.x + 'deg)' +
                              ' rotateX(' + _degs.y + 'deg)';

  _lastMove.x = e.clientX;
  _lastMove.y = e.clientY;
}, 100));
