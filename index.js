var elems = {
  RECT: document.querySelector('.dashed-lines rect'),
  ARROW: document.querySelector('.arrow'),
  LINES: [
    document.querySelector('.line-v1'),
    document.querySelector('.line-v2'),
    document.querySelector('.line-h1'),
    document.querySelector('.line-h2'),
  ]
};

/**
 * Given an element, create lines for its
 * surrounding.
 *
 * A box:
 * a________b
 *  |       |
 *  |_______|
 * c         d
 *
 *
 * A line:
 *
 * (x1, y1)         (x2, y2)
 * --------------------------
 *
 * Order of lines: v1, v2, h1, h2
 *
 * @param  {[type]} elem [description]
 * @param {[type]} [varname] [description]
 * @return {[type]}      [description]
 */
function updateLines (lines, elem) {
  var r = elem.getBoundingClientRect();

  var v1 = [[r.x, 0], [r.x, window.innerHeight]];
  var v2 = [[r.x + r.width, 0], [r.x + r.width, window.innerHeight]];
  var h1 = [[0, r.y], [window.innerWidth, r.y]];
  var h2 = [[0, r.y + r.height], [window.innerWidth, r.y + r.height]];

  var lds = [v1, v2, h1, h2];

  lines.forEach(function (line, i) {
    line.setAttribute('x1', lds[i][0][0]);
    line.setAttribute('y1', lds[i][0][1]);
    line.setAttribute('x2', lds[i][1][0]);
    line.setAttribute('y2', lds[i][1][1]);
  });

  return lines;
}

/**
 * Updates a SVG rect position and sizes given
 * an DOMElement
 * @param  {[type]} rect [description]
 * @param  {[type]} elem [description]
 * @return {[type]}      [description]
 */
function updateRect (rect, elem) {
  var r = elem.getBoundingClientRect();

  rect.setAttribute('x', r.x);
  rect.setAttribute('y', r.y);
  rect.setAttribute('width', r.width);
  rect.setAttribute('height', r.height);

  return rect;
}

/**
 * Updates the arrow div.
 * @param  {[type]} arrow [description]
 * @param  {[type]} elem  [description]
 * @return {[type]}       [description]
 */
function updateArrow (arrow, elem) {
  var r = elem.getBoundingClientRect();
  var ra = arrow.getBoundingClientRect();

  if (r.top < ra.height) {
    arrow.style.top = '0px';
    arrow.style.left = r.x + (r.width/2|0) - (ra.width/2|0) + 'px';
    arrow.className = 'arrow';
  } else {
    arrow.className = 'arrow show-arrow';
    arrow.style.top = r.y - ra.height - 10 + 'px';
    arrow.style.left = r.x + (r.width/2|0) - (ra.width/2|0) + 'px';
  }

  var spans = '';

  spans += '<span class="s-tag">' + elem.tagName.toLowerCase() + '</span> ';

  if (elem.id)
    spans += '<span class="s-id">#' + elem.id + '</span> ';

  if (elem.className)
    spans += '<span class="s-class">.' + elem.className + '</span> ';

  if (elem.dataset.text)
    spans += ' <span class="s-separator"> | </span> ' + elem.dataset.text + '</span>';

  arrow.children[0].innerHTML = spans;

  return arrow;
}

function updateAll () {
  updateLines(elems.LINES, elems._current);
  updateRect(elems.RECT, elems._current);
  updateArrow(elems.ARROW, elems._current);
}

/**
 * Setting a trigger for the change of _current
 * element.
 */
Object.defineProperty(elems, 'current', {
  set: function (val) {
    this._current = val;
    updateAll();
  }
});

/**
 * Triggering the first update
 */
elems.current = document.querySelector('h1');

// TODO fix reflow issues
window.onresize = updateAll;
document.querySelector('body').onmouseover = function (e) {
  elems.current = e.target;
};
