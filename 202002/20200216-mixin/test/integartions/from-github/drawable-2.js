const sliderable = (el, side, offset) => ({
  show() {
    // isShow = true; // do not save state.... in object
    el.style.webkitTransform = el.style.transform = `translate(0px, 0px)`;
    el.setAttribute('data-x', `0`);
  },
  hide() {
    // isShow = false; // do not save state.. in object...
    el.style.webkitTransform = el.style.transform = `translate(${offset}px, 0px)`;
    el.setAttribute('data-x', `${offset}`);
  },
});

const withDisplayNone = (el) =>
  function() {
    const that = this;
    return {
      show() {
        setTimeout(() => {
          that.show();
        }, 100);
        el.style.display = 'initial';
      },
      hide() {
        that.hide();
        setTimeout(() => {
          el.style.display = 'none';
        }, 400);
      },
    };
  };

const createSlider = (el, side, options = {}) => {
  let { offset, displayNone } = options;

  offset = el.offsetWidth - (offset || 0);
  if (side === 'left') offset = -offset;
  displayNone = displayNone || false;
  // let isShow = true;

  return Object.assign({}, sliderable(el, side, offset), displayNone ? withDisplayNone(el) : {});
};
