// Import stylesheets
import './style.css';

// Write Javascript code!
const appDiv = document.getElementById('app');

var body = document.body;

// var out = document.getElementById('console');
// out.log = function (message) {
//   var node = document.createElement('li');
//   var textnode = document.createTextNode(message);
//   node.appendChild(textnode);
//   out.appendChild(node);
// };

var pnrTexts = ['pnr', 'ticket', 'number'];
var nameTexts = ['email', 'last', 'name'];

var pnrContext = { texts: pnrTexts, type: 'pnr' };
var nameContext = { texts: nameTexts, type: 'name' };

var pnrBox = undefined;
var nameBox = undefined;

var exit = false;
var exitEle = undefined;
function walkChild(element, ref, texts) {
  if (exit) {
    return { success: true, ele: exitEle };
  }
  var children = element.childNodes;
  Array.from(children).forEach(function (child) {
    if (child.nodeType === 1) {
      var result = walkChild(child, ref, texts);
      if (result.success) {
        return { success: true, ele: result.child };
      }
    } else if (child.nodeType === 3) {
      if (child.nodeValue) {
        var match = 0;
        Array.from(texts).forEach(function (text) {
          if (child.nodeValue.toLowerCase().includes(text)) {
            match = match + 1;
          }
        });

        if (match >= 1) {
          exit = true;
          exitEle = child.parentNode;
          return { success: true, ele: exitEle };
        }
      }
    }
  });

  return { success: false };
}

function walkParent(element, ref, texts) {
  if (element === document.body) {
    return { success: false };
  }

  var result = { success: false };
  var parent = element.parentNode;
  if (parent) {
    result = walkChild(parent, ref, texts);
    if (!result.success) {
      result = walkParent(parent, ref, texts);
    }
  }
  return result;
}

function findClosestBox(element) {
  if (!element || element === document.body) {
    return undefined;
  }

  if (element.nodeType === 3) {
    element = element.parentNode;
  }

  var box = undefined;
  if (element.hasChildNodes()) {
    var inputs = element.getElementsByTagName('input');

    if (inputs && inputs.length > 0) {
      box = inputs[0];
      return box;
    } else {
      var parent = element.parentNode;
      return findClosestBox(parent);
    }
  }

  return undefined;
}

var candidates = [];
var body = document.body;
var inputs = body.getElementsByTagName('input');

// Find candidates
// TODO: Check if type is not present as attribute
Array.from(inputs).forEach(function (candidate) {
  var typeAttribute = candidate.getAttribute('type');
  if (typeAttribute.toLowerCase() === 'text') {
    //var box = { ref: candidate, checked: false };
    candidates.push(candidate);
  }
});

try {
  [pnrContext, nameContext].forEach(function (context) {
    var result = null;
    var toRemove = null;
    exit = false;
    exitEle = null;
    Array.from(candidates).forEach(function (candidate) {
      if (!result) {
        result = walkParent(candidate, candidate, context.texts);

        if (result.success) {
          if (context.type === 'pnr') {
            pnrBox = findClosestBox(result.ele);
          } else {
            nameBox = findClosestBox(result.ele);
          }

          toRemove = candidate;
        }
      } else if (result.success) {
        result = null;
      }
    });

    var index = candidates.indexOf(toRemove);
    if (index !== -1) {
      candidates.splice(index, 1);
    }
  });
} catch (e) {
  console.log(e.message);
}

if (pnrBox) {
  pnrBox.value = 'ABCD';
}

if (nameBox) {
  nameBox.value = 'Kumar Gaurav';
}

var VM = {
  Specs: [
    {
      title: 'Only Two Input Elements',
      description: 'SG uses this approach.',
      index: 0,
    },
    {
      title: 'Many Input Elements',
      description: 'Vistara uses this',
      index: 1,
    },
  ],
  Rules: [{ id: 'Found exact two', confidence: 0.5 }],
  Renderer: {
    renderSpecs: function () {
      var template = $('#tmpl-spec').html();
      var templateScript = Handlebars.compile(template);

      Specs.forEach(function (spec) {
        var html = templateScript(spec);
        // Insert the HTML code into the page
        $('.list-group').append(html);
      });
    },
  },
};

function execIfJQ() {
  console.log(window.$);
  if (window.$) {
    console.log('got it');
    VM.Renderer.renderSpecs();
  } else {
    setTimeout(function () {
      execIfJQ();
    }, 5000);
  }
}

execIfJQ();
