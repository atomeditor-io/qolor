'use strict';

// Minimal replacement for the deprecated `document.registerElement` v0 API.
//
// CoffeeScript 1.x compiles classes to ES5 constructor functions whose
// super-calls are incompatible with the custom elements constructor
// requirements, so a native `class` is created here and the CoffeeScript
// view's prototype members are grafted onto it. `new View()` keeps working
// because the native class properly chains to HTMLElement.

module.exports = {
  define: function (name, proto) {
    var existing = window.customElements && window.customElements.get(name);
    if (existing) return existing;

    var Element = class extends HTMLElement {};
    var descriptors = {};
    var keys = Object.getOwnPropertyNames(proto);
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i];
      if (key === 'constructor') continue;
      descriptors[key] = Object.getOwnPropertyDescriptor(proto, key);
    }
    Object.defineProperties(Element.prototype, descriptors);
    window.customElements.define(name, Element);
    return Element;
  }
};
