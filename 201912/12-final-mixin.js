<template>
  <div class="tg-drawer__root" @click.stop>
    <div class="tg-drawer__action-layout js-actions-target">
      <div class="tg-drawer__action-prepend">
        <slot name="chevron">
          <span>&lt;</span>
        </slot>
        <span @click.stop="onPin">
          <span v-if="state.pinned">O</span>
          <span v-else>X</span>
        </span>
      </div>
      <slot name="action"></slot>
    </div>
    <div class="tg-drawer__item-layout tg-drawer__animation js-items-target" style="margin-top: 10px">
      <slot name="item"></slot>
    </div>
  </div>
</template>

<script>
// [] 컴포넌트가 너무 Vuetify 의존적이다...
// [] 다른 방법을 찾아보자... js로 css를 계속 핸들링해야함.
// [] make transition time to constant
// [] select only one 만들기
// [] 선택 버튼 highlight 하기
// [] defaultSide = 'left'에 버그가 있는데 margin auto가 적용 되기전에 offsetWidth를 계산하므로..  width가 200px이 되버린다. settime out이후에 엘리먼트를 만들면 되긴 하는데 뭔가 좀 이상하네..
// [] 고정 핀 모드 만들기...

const defaultSide = 'right';

export default {
  methods: {
    onPin() {
      this.state.pinned = !this.state.pinned;
    },
  },
  data() {
    return {
      state: {
        pinned: false,
      },
    };
  },
  created() {
    console.clear();

    this.$options.side = defaultSide;
    this.$options.drawables = {
      action: undefined,
      items: [],
    };
  },
  mounted() {
    if (checkAttr(this.$attrs['right'])) this.$options.side = 'right';

    const side = this.$options.side;
    if (side === 'left') this.$el.style.left = 0;
    else if (side === 'right') this.$el.style.right = 0;
    else throw new Error('Side is not declared');

    // ACTIONS INIT
    const el = this.$el.querySelector('.js-actions-target');
    if (side === 'right') el.classList.add('tg-drawer__action-layout--right');
    else if (side === 'left') el.classList.add('tg-drawer__action-layout--left');
    const drawable = (this.$options.drawables.action = createSlider(el, side, { offset: 20 }));
    console.log(drawable);

    const state = this.state;
    function hide() {
      const { pinned } = state;
      if (pinned) return;
      drawable.hide();
    }
    function show() {
      drawable.show();
    }

    el.addEventListener('mouseenter', () => show());
    el.addEventListener('mouseleave', () => hide());

    this.$el.querySelector('.tg-drawer__action-prepend').addEventListener('click', () => {
      if (drawable.isShow) {
        hide();
      } else {
        show();
      }
    });
    this.$options.drawables.action.show();

    // ITEMS INIT
    const itemContainerEl = this.$el.querySelector('.js-items-target');
    if (side === 'right') itemContainerEl.classList.add('tg-drawer__item-layout--right');
    else itemContainerEl.classList.add('tg-drawer__item-layout--left');

    const actionEls = this.$slots.action.map((obj) => obj.elm);
    const itemEls = this.$slots.item.map((obj) => obj.elm);

    const allDrawables = [];
    for (let i = 0; i < actionEls.length; i++) {
      const actionEl = actionEls[i],
        itemEl = itemEls[i];

      const drawable = createSlider(itemEl, side, { displayNone: true });

      drawable.hide();
      allDrawables.push(drawable);

      actionEl.addEventListener('click', () => {
        allDrawables.filter((d) => d !== drawable).forEach((d) => d.hide());

        setTimeout(() => {
          if (drawable.isShow) {
            drawable.hide();
          } else {
            drawable.show();
          }
        }, 400);
      });

      itemEl.addEventListener('mouseleave', () => {
        drawable.hide();
      });
    }
  },
};

function checkAttr(attr) {
  if (attr === '' || attr === 'true' || attr === true) return true;
  else false;
}

// const pipe = (...fns) => (x) => fns.reduce((y, f) => f(y), x);

// mixin

// createFactory....

// const withPinnable = () => {};

const pipe = (...fns) => (x) => fns.reduce((y, f) => f(y), x);

const withDisplayNone = (el) => (mixin) => {
  const that = mixin;
  return {
    show() {
      el.style.display = 'initial';
      setTimeout(() => {
        that.show();
      }, 100);
    },
    hide() {
      that.hide();
      setTimeout(() => {
        el.style.display = 'none';
      }, 400);
    },
  };
};

// eslint-disable-next-line
const sliderable = (el, side, offset) => (mixin) => ({
  show() {
    // isShow = true;
    el.style.webkitTransform = el.style.transform = `translate(0px, 0px)`;
    el.setAttribute('data-x', `0`);
  },
  hide() {
    // isShow = false;
    el.style.webkitTransform = el.style.transform = `translate(${offset}px, 0px)`;
    el.setAttribute('data-x', `${offset}`);
  },
});

//with는 method hook 느낌이고,
// use able 느낌이네..
const createSlider = (el, side, options = {}) => {
  let { offset, displayNone } = options;

  offset = el.offsetWidth - (offset || 0);
  if (side === 'left') offset = -offset;
  displayNone = displayNone || false;
  // let isShow = true;

  // return Object.assign({ a: 'a' }, sliderable(el, side, offset), displayNone ? withDisplayNone(el) : {}); // 1. overriding problem
  // return withDisplayNone(Object.assign(sliderable(el, side, offset))); // 2. dont'. this is why pipe is needed....
  // 3. do use pipe, multiple arrow function, but get object....
  return pipe(
    sliderable(el, side, offset),
    displayNone ? withDisplayNone(el) : (mixin) => mixin
  )({ base: 'base' });
};
</script>

<style scoped>
.tg-drawer__root {
  position: absolute;
  top: 10px;
  display: flex;
  flex-direction: column;
  height: 0;
}

.tg-drawer__action-layout {
  --action-height: 40px;
  height: var(--action-height);
  display: flex;
  background-color: black;
  align-items: center;
  color: white;
  transition: transform 0.4s ease-in-out;
}

.tg-drawer__action-layout--right {
  margin-left: auto;
}

.tg-drawer__action-layout--left {
  margin-right: auto;
}

.tg-drawer__action-prepend {
  height: var(--action-height);
  width: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.tg-drawer__action-prepend span {
  font-size: 24px;
}

.tg-drawer__item-layout {
  display: flex;
  flex-direction: column;
}

.tg-drawer__item-layout--right {
  align-items: flex-end;
}

.tg-drawer__item-layout--left {
  align-items: flex-start;
}

.tg-drawer__animation >>> div {
  transition: transform 0.4s ease-in-out;
}
</style>
