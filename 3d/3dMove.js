/**
 * Returns a function for using the throttle
 * pattern
 * @param  {Function} fn
 * @param  {interger}   ms
 * @return {Function}
 */
function throttle (fn, ms) {
  if (!(fn && ms)) throw new Error('both args must be passed');

  var _last = new Date((new Date()).getTime() - ms);

  return function () {
    if ((_last.getTime() + ms) <= (new Date()).getTime())
      return (_last = new Date(), fn.apply(this, arguments));
  }
}


var container = document.querySelector('.container');
var _lastMove = {x: 0, y: 0};
var _lastTick = Date.now();
var _degs = {
  x: -34.0,
  y: -47.0
};

var on3dmove = throttle(function (e) {
  var now = Date.now();

  if (!container)
    container = document.querySelector('.container');

  if ((now - _lastTick) > 164)
    return (_lastMove.x = e.clientX,
            _lastMove.y = e.clientY,
            _lastTick = now);
  else
    _lastTick = now;

  if (!(e.buttons || e.which))
    return;

  _degs.x += (e.clientX - _lastMove.x);
  _degs.y += (e.clientY - _lastMove.y);

  container.style.transform = 'rotateY(' + _degs.x + 'deg)' +
                              ' rotateX(' + (-_degs.y) + 'deg)';

  console.log(e.clientX - _lastMove.x, e.clientY - _lastMove.y);

  _lastMove.x = e.clientX;
  _lastMove.y = e.clientY;
}, 100);

function enable3dMove () {
  document.querySelector('body').addEventListener('mousemove', on3dmove);
}

function disable3dMove () {
  document.querySelector('body').removeEventListener('mousemove', on3dmove);
}

var threedMove = {
  enable3dMove: enable3dMove,
  disable3dMove: disable3dMove
};

(function (root, factory) {
  if (typeof exports === 'object')
    module.exports = factory();
  else
    root.threedMove = factory();
}(this, function (b) {
  return threedMove;
}));
