var cmInitContent = '';

function initializeDemo(code) {
  cmInitContent = code;
  cmEditor.setValue(code);
  applyCode();
};

var editor = document.getElementById("editor");
var output = document.getElementById("output");

var inHere = document.getElementById("in-here");
var inConsole = document.getElementById("in-console");
var inDebugger = document.getElementById("in-debugger");
var inJsTutor = document.getElementById("in-js-tutor");
var reset = document.getElementById("reset");

var cmOptions = {
  mode: "javascript",
  theme: "eclipse",
  lineNumbers: true,
  showCursorWhenSelecting: true,
  styleActiveLine: true
}

var cmEditor = CodeMirror(editor, cmOptions);
cmEditor.setSize("100%", 250);
cmEditor.focus();

const stringifyForDOM = item => {
  if (typeof item === 'function') {
    return item.toString();
  } else if (item instanceof Error) {
    return item.name + ': ' + item.message;
  } else {
    const hackUndefined = '!#^$%26425984y0fhp!##%$#^%&GF@@das87go2d3x2';
    const stringified = JSON.stringify(
      item,
      (k, v) => v === undefined ? hackUndefined : v,
      '');
    const deHacked = stringified
      .split(`"${hackUndefined}"`).join('undefined');
    return deHacked;
  };
};

function applyCode() {

  var code = cmEditor.doc.getValue();

  const logs = [];
  const nativeConsole = Object.assign({}, console);
  for (let key in console) {
    console[key] = function () {
      const args = Array.from(arguments);
      // nativeConsole[key](...args);
      const DOMableArgs = args.map(stringifyForDOM);
      logs.push(DOMableArgs.join(', '));
    };
  }
  try {
    var result = eval(code);
  } catch (e) {
    console.error(e);
    var result = '';
  };
  console = nativeConsole;

  output.classList.add("fade-in");
  let newInnerHtml = '';
  logs.forEach(log => {
    // newInnerHtml += '&gt; ' + log + '<br>';
    newInnerHtml += '> ' + log + '\n';
  });
  newInnerHtml += '\n' + result;

  output.innerText = newInnerHtml;

  output.firstChild.addEventListener("animationend", (e) => {
    e.target.parentNode.classList.remove("fade-in");
  });
};

reset.addEventListener("click", function () {
  cmEditor.doc.setValue(cmInitContent);
  cmEditor.focus();
  applyCode();
});

inHere.addEventListener("click", function () {
  applyCode();
});

inConsole.addEventListener("click", function () {
  eval(cmEditor.getValue());
});

inDebugger.addEventListener("click", function () {
  eval('debugger; \n\n' + cmEditor.getValue());
});

