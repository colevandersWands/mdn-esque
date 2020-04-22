const itShould = (() => {

  const assertions = {

    ok: function (x, message) {
      const assertion = {
        message, type: 'ok',
        pass: Boolean(x),
        actual: x,
      };
      if (this.config.console) {
        privateFunctions.renderToConsole(assertion);
      };
      this.report.log.push(assertion);
      return assertion.pass;
    },

    notOk: function (x, message) {
      const assertion = {
        message, type: 'notOk',
        pass: !Boolean(x),
        actual: x,
      };
      if (this.config.console) {
        privateFunctions.renderToConsole(assertion);
      };
      this.report.log.push(assertion);
      return assertion.pass;
    },

    strictEqual: function (x, y, message) {
      const assertion = {
        message, type: 'strictEqual',
        pass: x === y,
        actual: x, expected: y,
      };
      if (this.config.console) {
        privateFunctions.renderToConsole(assertion);
      };
      this.report.log.push(assertion);
      return assertion.pass;
    },

    notStrictEqual: function (x, y, message) {
      const assertion = {
        message, type: 'notStrictEqual',
        pass: x !== y,
        actual: x, expected: y,
      };
      if (this.config.console) {
        privateFunctions.renderToConsole(assertion);
      };
      this.report.log.push(assertion);
      return assertion.pass;
    },

    deepStrictEqual: function (x, y, message) {
      const assertion = {
        message, type: 'deepStrictEqual',
        pass: privateFunctions.equiv(x, y),
        actual: x, expected: y,
      };
      if (this.config.console) {
        privateFunctions.renderToConsole(assertion);
      };
      this.report.log.push(assertion);
      return assertion.pass;
    },

    notDeepStrictEqual: function (x, y, message) {
      const assertion = {
        message, type: 'notDeepStrictEqual',
        pass: !privateFunctions.equiv(x, y),
        actual: x, expected: y,
      };
      if (this.config.console) {
        privateFunctions.renderToConsole(assertion);
      };
      this.report.log.push(assertion);
      return assertion.pass;
    },

    throws: function (func, expected, message) {
      if (typeof func !== 'function') {
        throw new TypeError('first argument must be a function');
      };

      const assertion = {
        message, type: 'throws',
        pass: null,
        actual: null,
        uncaught: null, source: func.toString()
      };
      if (arguments.length > 1) {
        assertion.expected = expected;
      }

      try {
        func();
        assertion.uncaught = false;
      } catch (thrown) {
        assertion.actual = thrown;
        assertion.uncaught = true;
      };

      if (!assertion.uncaught) {
        assertion.pass = false;
        if (this.config.console) {
          privateFunctions.renderToConsole(assertion);
        };
        this.report.log.push(assertion);
        return assertion.pass;
      };

      let actualPasses = true;
      if (expected === undefined || expected === null) {
        actualPasses = true;
      } else if (typeof expected !== 'object') {
        actualPasses = assertion.actual === expected;
      } else if (typeof assertion.actual !== 'object') {
        actualPasses === false;
      } else {
        if (expected.name) {
          actualPasses = actualPasses && assertion.actual.name === expected.name;
        };
        if (expected.message) {
          actualPasses = actualPasses && assertion.actual.message === expected.message;
        };
      };
      assertion.pass = actualPasses;

      if (this.config.console) {
        privateFunctions.renderToConsole(assertion);
      };
      this.report.log.push(assertion);
      return assertion.pass;
    },

    exit: function (exitMessage) {
      const report = {
        message: arguments.length === 0
          ? 'forced exit'
          : arguments.length === 1
            ? exitMessage
            : Array.from(arguments),
        type: 'exit',
        // does not influence pass/fail
      };
      this.report.log.push(report);
      throw report.message;
    },

    log: function () {
      const args = Array.from(arguments);
      args.forEach(arg => this.report.log.push(arg));
      return args;
    },

  };

  const privateFunctions = {

    renderToConsole: (r) => {
      const { pass, actual, expected, type, message, uncaught } = r;

      const pOrF = pass ? '%cPASS:' : '%cFAIL:';
      const consoleMessage = message || type || '';
      let ac1 = ac2 = ex1 = ex2 = '';
      if (r.hasOwnProperty('uncaught') && !pass) {
        ac1 = uncaught ? '\n   THREW:   ' : '\n   DID NOT THROW';
        ac2 = (uncaught && r.hasOwnProperty('actual'))
          ? ((typeof actual === 'object' && actual !== null)
            ? { name: actual.name, message: actual.message } : actual)
          : '';
        ex1 = r.hasOwnProperty('expected') ? '\n   EXPECTED:' : '';
        ex2 = r.hasOwnProperty('expected')
          ? ((expected instanceof Error)
            ? { name: expected.name, message: expected.message } : expected)
          : '';
      } else if (!pass || !message) {
        if (r.hasOwnProperty('actual')) {
          ac1 = '\n   ACTUAL:  ';
          ac2 = (actual instanceof Error)
            ? actual.name + ': ' + actual.message
            : actual;
        };
        if (r.hasOwnProperty('expected')) {
          ex1 = '\n   EXPECTED:';
          ex2 = expected;
        };
      } else if (pass && !message) {
        if (r.hasOwnProperty('expected')) {
          ex1 = '\n   EXPECTED:';
          ex2 = expected;
        };
      };
      if (pass) {
        console.info(pOrF, 'font-weight:bold;', consoleMessage, ac1, ac2, ex1, ex2);
      } else {
        console.error(pOrF, 'font-weight:bold;', consoleMessage, ac1, ac2, ex1, ex2);
      };
    },

    // Authors: Philippe Rathé <prathe@gmail.com>, David Chan <david@troi.org>
    // https://github.com/qunitjs/qunit/blob/master/src/equiv.js
    // objectType included from: https://github.com/qunitjs/qunit/blob/master/src/core/utilities.js
    equiv: function () { var n = [], t = Object.getPrototypeOf || function (n) { return n.__proto__ }; function r(n, t) { return "object" == typeof n && (n = n.valueOf()), "object" == typeof t && (t = t.valueOf()), n === t } function e(n) { if (void 0 === n) return "undefined"; if (null === n) return "null"; var t = toString.call(n).match(/^\[object\s(.*)\]$/), r = t && t[1]; switch (r) { case "Number": return isNaN(n) ? "nan" : "number"; case "String": case "Boolean": case "Array": case "Set": case "Map": case "Date": case "RegExp": case "Function": case "Symbol": return r.toLowerCase(); default: return typeof n } } function o(n) { return "flags" in n ? n.flags : n.toString().match(/[gimuy]*$/)[0] } function u(t, r) { return t === r || (-1 === ["object", "array", "map", "set"].indexOf(e(t)) ? a(t, r) : (n.every(n => n.a !== t || n.b !== r) && n.push({ a: t, b: r }), !0)) } var c = { string: r, boolean: r, number: r, null: r, undefined: r, symbol: r, date: r, nan: function () { return !0 }, regexp: function (n, t) { return n.source === t.source && o(n) === o(t) }, function: function () { return !1 }, array: function (n, t) { var r, e; if ((e = n.length) !== t.length) return !1; for (r = 0; r < e; r++)if (!u(n[r], t[r])) return !1; return !0 }, set: function (t, r) { var e, o = !0; return t.size === r.size && (t.forEach(function (t) { o && (e = !1, r.forEach(function (r) { var o; e || (o = n, i(r, t) && (e = !0), n = o) }), e || (o = !1)) }), o) }, map: function (t, r) { var e, o = !0; return t.size === r.size && (t.forEach(function (t, u) { o && (e = !1, r.forEach(function (r, o) { var c; e || (c = n, i([r, o], [t, u]) && (e = !0), n = c) }), e || (o = !1)) }), o) }, object: function (n, r) { var e, o = [], c = []; if (!1 === function (n, r) { var e = t(n), o = t(r); return n.constructor === r.constructor || (e && null === e.constructor && (e = null), o && null === o.constructor && (o = null), null === e && o === Object.prototype || null === o && e === Object.prototype) }(n, r)) return !1; for (e in n) if (o.push(e), (n.constructor === Object || void 0 === n.constructor || "function" != typeof n[e] || "function" != typeof r[e] || n[e].toString() !== r[e].toString()) && !u(n[e], r[e])) return !1; for (e in r) c.push(e); return a(o.sort(), c.sort()) } }; function a(n, t) { var r = e(n); return e(t) === r && c[r](n, t) } function i(t, r) { var e, o; if (arguments.length < 2) return !0; for (n = [{ a: t, b: r }], e = 0; e < n.length; e++)if ((o = n[e]).a !== o.b && !a(o.a, o.b)) return !1; return 2 === arguments.length || i.apply(this, [].slice.call(arguments, 1)) } return (...t) => { const r = i(...t); return n.length = 0, r } }()
  };

  const itShould = (testName, testFunction, userConfig) => {
    if (typeof testName !== 'string') {
      throw new TypeError('first argument must be a string');
    };
    if (typeof testFunction !== 'function') {
      throw new TypeError('second argument must be a function');
    };
    if (userConfig && typeof userConfig !== 'object') {
      throw new TypeError('third argument must be an object');
    };

    const config = {
      debug: false,
      console: true,
      before: null,
      after: null,
    };
    if (userConfig) {
      for (let key in config) {
        if (userConfig.hasOwnProperty(key)) {
          config[key] = userConfig[key];
        };
      };
    };

    const report = {
      describe: testName,
      pass: false,
      exit: undefined,
      returned: undefined,
      uncaught: undefined,
      source: testFunction.toString(),
      log: [],
    };

    const hiddenConfigReport = { report, config };
    const test = {};
    for (let key in assertions) {
      test[key] = assertions[key].bind(hiddenConfigReport);
    };

    Object.freeze(test);

    console.group(testName);
    if (config.debug) {
      debugger;
    }
    if (typeof config.before === 'function') {
      try { config.before(report); }
      catch (err) {
        console.log('%cError in pre-test callback', 'font-weight:bold;');
        console.error(err);
      };
    }
    try {
      report.returned = testFunction(test);
    } catch (thrown) {
      const lastLogEntry = report.log
        .slice(report.log.length - 1)[0];
      const forced = lastLogEntry && lastLogEntry.type === 'exit';
      if (forced) {
        report.exit = thrown;
      } else {
        report.uncaught = thrown;
      }
    };

    report.pass = report.uncaught ? false
      : report.log
        .map(loggedItem => (loggedItem && loggedItem.hasOwnProperty('pass'))
          ? loggedItem.pass
          : true)
        .reduce((and, next) => and && next, true);

    if (report.exit) {
      console.log('%cEXIT:', 'font-weight:bold;', report.exit);
    } else if (report.uncaught) {
      console.log('%cUNCAUGHT:', 'font-weight:bold;', report.uncaught);
    } else if (report.returned) {
      console.log('%cRETURNED:', 'font-weight:bold;', report.returned);
    };

    if (typeof config.after === 'function') {
      try { config.after(report); }
      catch (err) {
        console.log('%cError in post-test callback', 'font-weight:bold;');
        console.error(err);
      };
    }
    console.log('\n');
    console.groupEnd(testName);


    itShould.log(report);

    return report;

  };


  // why not fun stuff, making itShould an assertion object

  { // in block scope so toBind does not appear closed in debugger
    const toBind = {
      report: {
        describe: 'it should ...',
        get pass() {
          return this.log
            .map(loggedItem => (loggedItem && loggedItem.hasOwnProperty('pass'))
              ? loggedItem.pass
              : true)
            .reduce((and, next) => and && next, true);
        },
        log: []
      },
      config: {
        debug: false,
        console: false,
        before: null,
        after: null,
      }
    };

    for (let key in assertions) {
      if (key === 'exit') { continue; };
      itShould[key] = assertions[key].bind(toBind);
    };

    Object.defineProperty(itShould, 'report', {
      get() { return JSON.parse(JSON.stringify(toBind.report)) },
    });

  };


  Object.freeze(itShould);

  return itShould;

})();
