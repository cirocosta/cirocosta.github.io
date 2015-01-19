var jsdom = require('mocha-jsdom');
var assert = require('assert');
var threed = require('../3d/3d');

function genTree () {
  var body = document.createElement('body');
  var main = document.createElement('main');
  var div = document.createElement('div');
  var div2 = document.createElement('div');

  main.appendChild(div);
  main.appendChild(div2);
  body.appendChild(main);

  return body;
}

describe('3d', function() {
  jsdom();

  describe('initRoot', function() {
    it('should mutate the three', function() {
      var b = genTree();

      threed.initRoot(b);

      assert(b.children[0].nodeName == 'DIV');
      assert(b.children[0].className == 'container');
    });
  });

  describe('initElement', function() {
    it('encapsulate the element', function() {
      var b = genTree();
      var div = b.children[0].children[0];

      threed.initElement(div);

      assert(div.parentNode.className == 'box',
             'should have parent w/ class="box"');
      assert(div.className == 'inspect3d inspect3d-front',
             'should have class="inspect3d-front"');
    });

    it('create siblings for the encapsulated element', function() {
      var b = genTree();
      var div = b.children[0].children[0];

      threed.initElement(div);

      assert(div.nextSibling.className === 'inspect3d inspect3d-top');

      assert(div.nextSibling
                .nextSibling.className === 'inspect3d inspect3d-right');

      assert(div.nextSibling
                .nextSibling
                .nextSibling.className === 'inspect3d inspect3d-left');

      assert(div.nextSibling
                .nextSibling
                .nextSibling
                .nextSibling.className === 'inspect3d inspect3d-bottom');

    });
  });

  describe('traverse', function() {
    it('traverse all the three', function() {
      var b = genTree();
      var stack = [];
      var expectedStack = ['body', 'main', 'div', 'div'];

      threed._traverse(b, function (node) {
        stack.push(node.localName);
      });


      assert(!stack.some(function (curr, i) {
        return curr !== expectedStack[i];
      }));
    });
  });

  describe('elemDepth', function() {
    it('give a certain element the correct depth', function() {
      var b = genTree();

      assert(threed._elemDepth(b.children[0]), 2);
    });
  });
});
