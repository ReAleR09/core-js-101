/* eslint-disable no-underscore-dangle */
/* ************************************************************************************************
 *                                                                                                *
 * Plese read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectagle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;

  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  Object.setPrototypeOf(obj, proto);
  return obj;
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurences
 *
 * All types of selectors can be combined using the combinators ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string repsentation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const ONLY_ONE_TIME = 'Element, id and pseudo-element should not occur more then one time inside the selector';
const INCORRECT_ORDER = 'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element';

function Elementy() {
  this._element = false;
  this._id = false;
  this._classes = [];
  this._attr = false;
  this._pseudoClass = [];
  this._pseudoElement = false;
}

Elementy.prototype = {
  element(value) {
    if (this._element) {
      throw Error(ONLY_ONE_TIME);
    }
    if (this._id) {
      throw Error(INCORRECT_ORDER);
    }
    this._element = value;
    return this;
  },
  id(value) {
    if (this._id) {
      throw Error(ONLY_ONE_TIME);
    }
    if (this._classes.length > 0) {
      throw Error(INCORRECT_ORDER);
    }
    if (this._pseudoElement) {
      throw Error(INCORRECT_ORDER);
    }
    this._id = value;
    return this;
  },
  class(value) {
    if (this._attr) {
      throw Error(INCORRECT_ORDER);
    }
    this._classes.push(value);
    return this;
  },
  attr(value) {
    if (this._pseudoClass.length > 0) {
      throw Error(INCORRECT_ORDER);
    }
    this._attr = value;
    return this;
  },
  pseudoClass(value) {
    if (this._pseudoElement) {
      throw Error(INCORRECT_ORDER);
    }
    this._pseudoClass.push(value);
    return this;
  },
  pseudoElement(value) {
    if (this._pseudoElement) {
      throw Error(ONLY_ONE_TIME);
    }
    this._pseudoElement = value;
    return this;
  },
  stringify() {
    let result = '';
    if (this._element) {
      result += this._element;
    }
    if (this._id) {
      result += `#${this._id}`;
    }
    if (this._attr) {
      result += `[${this._attr}]`;
    }
    if (this._classes.length > 0) {
      result += `.${this._classes.join('.')}`;
    }
    if (this._pseudoClass.length > 0) {
      result += this._pseudoClass.map((cl) => `:${cl}`).join('');
    }
    if (this._pseudoElement) {
      result += `::${this._pseudoElement}`;
    }

    return result;
  },
};

const cssSelectorBuilder = {

  element(value) {
    const el = new Elementy();
    return el.element(value);
  },

  id(value) {
    const el = new Elementy();
    return el.id(value);
  },

  class(value) {
    const el = new Elementy();
    return el.class(value);
  },

  pseudoClass(value) {
    const el = new Elementy();
    return el.pseudoClass(value);
  },

  pseudoElement(value) {
    const el = new Elementy();
    return el.pseudoElement(value);
  },

  attr(value) {
    const el = new Elementy();
    return el.attr(value);
  },

  combine(selector1, combinator, selector2) {
    return {
      stringify: () => `${selector1.stringify()} ${combinator} ${selector2.stringify()}`,
    };
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
