/**
 * Creates a string given an object that
 * represents classes of an HTMLElement
 * @param  {Object} classes
 * @return {string}
 */
function cx (classes) {
  return typeof classes !== 'object' ?
  Array.prototype.join.call(arguments, ' ') :
  Object.keys(classes).filter(function (className) {
    return classes[className];
  }).join(' ');
}

/**
 * Calculates the depth of a given element.
 * @param  {HTMLElement} elem
 * @return {number}
 */
function elemDepth (elem) {
  return elem.parentElement ? elemDepth(elem.parentElement) + 1 : 0;
}

/**
 * Obtains full dimension (width,height + margins + padding)
 * @param  {[type]} elem [description]
 * @return {[type]}      [description]
 */
function getFullDim (elem) {
  var styles = window.getComputedStyle(elem);
  var height = elem.offsetHeight +
               parseFloat(styles['marginTop']) +
               parseFloat(styles['marginBottom']);

  var width = elem.offsetWidth +
               parseFloat(styles['marginLeft']) +
               parseFloat(styles['marginRight']);

  return {
    width: width,
    height: height
  };
}

/**
 * Encapsulates CSS style generators
 * @type {Object}
 */
var changeStyle = {
  _change: function (elem, styles) {
    for (var style in styles)
      elem.style[style] = styles[style];
  },

  front: function (elem, width, height, depth) {
    return (this._change(elem, {
      width: width + 'px',
      height: height + 'px',
      position: 'relative',

      transform: 'translateZ(' + (depth/2) + 'px)'
    }), elem);
  },

  top: function (elem, width, height, depth) {
    return (this._change(elem, {
      width: width + 'px',
      height: depth + 'px',

      transform: 'rotateX(90deg) translateZ(' + (height + (depth/2)) + 'px)'
    }), elem);
  },

  right: function (elem, width, height, depth) {
    return (this._change(elem, {
      width: depth + 'px',
      height: height + 'px',

      transform: 'rotateY(90deg) translateZ(' + (width - (depth/2)) + 'px) translateY(' + (-height) + 'px)'
    }), elem);
  },

  left: function (elem, width, height, depth) {
    return (this._change(elem, {
      width: depth + 'px',
      height: height + 'px',

      transform: 'rotateY(90deg) translateZ(' + (-(depth/2)) + 'px) translateY(' + (-height) + 'px)'
    }), elem);
  },

  bottom: function (elem, width, height, depth) {
    return (this._change(elem, {
      width: width + 'px',
      height: depth + 'px',

      transform: 'rotateX(90deg) translateZ(' + (depth/2) + 'px)'
    }), elem);
  },
};

/**
 * Traverses the DOM
 * @param  {HTMLElement}   node
 * @param  {Function} fn
 */
function traverse (node, fn) {
  fn(node);

  if (node.childNodes.length)
    for (var i = 0; i < node.childNodes.length; i++)
      traverse(node.childNodes[i], fn);
}

/**
 * Adds a big container that has a particular
 * perspective to the root, encapsulating all
 * the rest
 * @param  {HTMLElement} root
 * @return {HTMLElement} container
 */
function initRoot (root) {
  var stack = [];
  var container = document.createElement('div');
  container.className = 'container';

  for (var i = 0; i < root.children.length; i++)
    container.appendChild(root.children[i]);

  root.appendChild(container);

  traverse(container, function (node) {
    if (node.localName && node.localName !== 'script')
      stack.push(node);
  });

  for (var i = 1; i < stack.length; i++)
    initElement(stack[i], elemDepth(stack[i]) - 3);

  setTimeout(function () {
    container.className = 'container container-active';
  }, 300);
}

/**
 * Initializes an HTMLElement as a 3D box
 * @param  {HTMLElement} elem
 * @param  {number} depth
 * @return {void}
 */
function initElement (elem, depth) {
  var parent = elem.parentNode;
  var div = document.createElement('div');

  var top = document.createElement('div');
  var right = document.createElement('div');
  var left = document.createElement('div');
  var bottom = document.createElement('div');

  depth *= 10;

  top.className = 'inspect3d inspect3d-top';
  right.className = 'inspect3d inspect3d-right';
  left.className = 'inspect3d inspect3d-left';
  bottom.className = 'inspect3d inspect3d-bottom';
  elem.className = "inspect3d inspect3d-front";

  div.className = "box";

  parent.appendChild(div);
  parent.removeChild(elem);
  div.appendChild(elem);

  // var dim = elem.getBoundingClientRect();
  var dim = {
    width: elem.scrollWidth,
    height: elem.scrollHeight
  };

  changeStyle.front(elem, dim.width, dim.height, depth);
  changeStyle.top(div.appendChild(top), dim.width, dim.height, depth);
  changeStyle.right(div.appendChild(right), dim.width, dim.height, depth);
  changeStyle.left(div.appendChild(left), dim.width, dim.height, depth);
  changeStyle.bottom(div.appendChild(bottom), dim.width, dim.height, depth);
}

var threed = {
  initRoot: initRoot,
  initElement: initElement,
  _traverse: traverse,
  _elemDepth: elemDepth
};



(function (root, factory) {
  if (typeof exports === 'object')
    module.exports = factory();
  else
    root.threed = factory();
}(this, function (b) {
  return threed;
}));
