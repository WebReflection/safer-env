let env = require('../cjs');

console.assert(Object.isFrozen(env));
console.assert(Object.isFrozen(env.Object));

delete require.cache[require.resolve('../cjs')];

global.parent = global;
global.top = global;

Object.defineProperty(global, 'setter', {set: Object});

env = require('../cjs');

console.assert(env.setter.set === Object);
