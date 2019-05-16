var env = (function (Object) {'use strict';
  /*! (c) Andrea Giammarchi - ISC */
  var proto = Object.prototype;
  var freeze = Object.freeze;
  var dP = Object.defineProperty;
  var gOPD = Object.getOwnPropertyDescriptor;
  var gOPN = Object.getOwnPropertyNames;
  var gOPS = Object.getOwnPropertySymbols;
  var gPO = Object.getPrototypeOf;
  var hOP = Object.hasOwnProperty;
  var known = [global];
  if ('parent' in global)
    known.push(parent);
  if ('top' in global)
    known.push(top);
  return loop({globalThis: global}, global, true);
  function constructor(root, key, value) {
    var Class = loop({}, value, false);
    define(Class, 'constructor', value);
    if (value.prototype)
      define(Class, 'prototype', loop({}, value.prototype, true));
    define(root, key, freeze(Class));
  }
  function define(object, key, value) {
    dP(object, key, {enumerable: true, value: value});
  }
  function keys(obj) {
    return gOPN(obj).concat(gOPS(obj));
  }
  function loop(root, nmsp, secured) {
    for (var
      desc, value, k,
      key = keys(nmsp),
      i = 0, length = key.length; i < length; i++
    ) {
      k = key[i];
      switch (true) {
        case k === 'prototype':
        case k === '__proto__':
        case hOP.call(root, k):
          break;
        case typeof k === 'symbol':
          define(root, k, value);
          break;
        default:
          desc = gOPD(nmsp, k);
          if ('value' in desc) {
            value = desc.value;
            if (value == null)
              continue;
            switch (typeof value) {
              case 'symbol':
                define(root, k, value);
                break;
              case 'function':
                if (known.indexOf(value) < 0) {
                  known.push(value);
                  (/^[A-Z]/.test(k) ? constructor : define)(root, k, value);
                }
                break;
              case 'object':
                if (known.indexOf(value) < 0) {
                  known.push(value);
                  define(root, k, {});
                  do {
                    loop(root[k], value, false);
                  } while ((value = gPO(value)) && value != proto);
                  freeze(root[k]);
                }
                break;
              default:
                define(root, k, value);
                break;
            }
          } else {
            define(root, k, {});
            if (desc.get)
              define(root[k], 'get', desc.get);
            if (desc.set)
              define(root[k], 'set', desc.set);
            freeze(root[k]);
          }
          break;
      }
    }
    return secured ? freeze(root) : root;
  }
}(Object));
module.exports = env;
