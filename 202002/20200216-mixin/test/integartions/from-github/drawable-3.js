const assert = require('assert');

const flowPipe = (...fun) => (o) => {
  return fun.reduce((accumulator, func) => func(accumulator), o);
};

const withDisplayNone = (el) => (o) => {
  return Object.assign({}, o, {
    show() {
      o.show();
      el.displayNone = true;
    },
  });
};

const sliderble = (el) => ({
  show() {
    el.called = true;
  },
  getEl() {
    return el;
  },
});

// factory
const createSlider = (el) => flowPipe(withDisplayNone(el))(sliderble(el));

// 이렇게 하려면 sliderble을 nested function () => () => 으로 바꾸어 주어야한다...
// const createSlider = el => flowPipe(sliderble(el), withDisplayNone(el))({});

let obj;
(function() {
  const el = {
    called: false,
  };
  obj = createSlider(el);
})();

obj.show();
console.log(obj.getEl());

assert(obj.getEl().called === true);
