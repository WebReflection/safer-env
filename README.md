# safer-env

<sup>**Social Media Photo by [freestocks.org](https://unsplash.com/@freestocks) on [Unsplash](https://unsplash.com/)**</sup>

[![Build Status](https://travis-ci.com/WebReflection/safer-env.svg?branch=master)](https://travis-ci.com/WebReflection/safer-env) [![Coverage Status](https://coveralls.io/repos/github/WebReflection/safer-env/badge.svg?branch=master)](https://coveralls.io/github/WebReflection/safer-env?branch=master) ![WebReflection status](https://offline.report/status/webreflection.svg)

The whole environment as frozen namespace.


### Background

There is a [get-originals](https://github.com/domenic/get-originals) proposal which aim is to ensure developers they can trust the method, class, or value they expect, without ever being bothered by possible wraps, polyfill, patches, malicious attacks, and so on and so fort.

This module basically delivers the same proposal but through a one-off crawling of the environment it's running into.

Bear in mind the crawling might be expensive, so use this module, on top of any other, and only if you need it.

The only module that might make sense to include upfront is the [@ungap/global-this](https://www.npmjs.com/package/@ungap/global-this) one.


# The Exported Env

The object is frozen in all its level, and it contains native version, or better, the version encountered when it's imported, which is why it should be imported before anything else, of pretty much everything.

```js
// points at the native Object
// since returning Function for every constructor
// was kinda useless anyway
env.Object.constructor;

// points at the native Object.prototype
env.Object.prototype.toString;

// simulate safer-function
let {call} = env.Function.prototype;
const bind = call.bind(call.bind);
const apply = bind(call, call.apply);
call = bind(call, call);

call(env.Object.prototype.toString, '');
// [object String]
```


## Getters and Setters

Everything is stored either directly or through an object that might expose `{get}`, `{set}`, or both `{get, set}`.

As example, `Element.prototype.innerHTML.set` is the setter able to add HTML content to a node.


## About performance and usage

It's unfortunately useless to lazy load anything through proxies or getters, because the purpose is to be sure that whatever is encountered when the module is included, will be frozen forever within the module content.

This makes it mandatory to include this module ASAP on top of your project, and put the script on top of any other script, otherwise there's nothing really safer in using this module.

Due absence of lazily crawled namespaces, classes, and prototypes, one off creation performance might vary from device in device so please test on target browsers and common hardware too.


## The Future Is Bright

The day `std:global` and _get originals_ proposal will land, the refactoring should be straight forward:

```js
// before
const { apply } = env.Reflect;

// after
import { apply } from "std:global/Reflect";
```

A simple RegExp might already be enough to change that in the future.

```js
script.replace(
  /\b(const)\b(\s+\{.+?}\s*)(=)(\s*)(env\.)(.+)?;/g,
  ($0, $1, $2, $3, $4, $5, $6) => `import${$2}from${$4}"std:global/${$6}";`
);
```

