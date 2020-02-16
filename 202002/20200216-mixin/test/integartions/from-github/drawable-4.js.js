const assert = require('assert');

console.clear();

describe('OO ways', () => {
  let el;
  before(() => {
    el = {
      _status: false,
      _displayNone: false,
    };

    class ElWrapper {
      constructor(el) {
        this.el = el;
      }

      show() {
        this.el._status = true;
        this.el._displayNone = true;
      }
    }

    const o = new ElWrapper(el);
    o.show();
  });

  it('change els attribute each', () => {
    assert(el._status === true);
    assert(el._displayNone === true);
  });
});

describe('Can suppport mixed function', () => {
  describe('Capture Closure way', () => {
    let el;
    before(() => {
      // arrange
      el = {
        _status: false,
        _displayNone: false,
      };
      const statusChangable = (_el) => {
        return {
          show() {
            _el._status = true;
          },
        };
      };
      const displayChangable = (_el) => {
        return {
          show() {
            _el._displayNone = true;
          },
        };
      };

      // action
      const o = Object.assign({}, statusChangable(el), displayChangable(el));
      o.show();
    });
    it('assert', () => {
      assert(el._status === false);
      assert(el._displayNone === true);
    });
  });

  describe('Pipe and reduce way', () => {
    let el;
    before(() => {
      el = {
        _status: false,
        _displayNone: false,
      };
      const statusChangable = (_el) => (ctx) => {
        return {
          show() {
            _el._status = true;
          },
        };
      };
      const displayChangable = (_el) => (ctx) => {
        return {
          show() {
            ctx.show();
            _el._displayNone = true;
          },
        };
      };
      const flowPipe = function(...mixins) {
        const obj = mixins.reduce((acc, mixin) => {
          return mixin(acc);
        }, {});
        return obj;
      };
      const mixedObject = Object.assign({}, flowPipe(statusChangable(el), displayChangable(el)));
      mixedObject.show();
    });

    it('', () => {});
  });
});
