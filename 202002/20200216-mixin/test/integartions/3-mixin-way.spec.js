const { expect } = require('chai');
const User = require('../../src/User');

describe('Third way is mixin', () => {
  describe('Object.assign way', () => {
    it('Object mixin', () => {
      const user = new User();
      Object.assign(user, {
        quack: () => 'qauck!!',
      });
      expect(user.quack()).to.be.a('string');
    });
    it('Class mixin', () => {});
  });

  describe('Object spread', () => {
    it('Object spread', () => {
      const quackable = {
        quack: () => 'qauck!!',
      };
      const user = new User();

      const quackableUser = { ...user, ...quackable };
      expect(quackableUser.quack()).to.be.a('string');
    });
  });

  describe('pipe', () => {
    const quacking = (word) => (o) => Object.assign({}, o, { quack: () => word });
    const flying = (o) =>
      Object.assign({}, o, {
        fly: () => 'fly',
      });

    describe('Old way', () => {
      // Factory 방식은, 가독성이 너무 떨어짐...
      const createDuck = (quack) => quacking(quack)(flying(new User()));
      const duck = createDuck('Quack!');
      it('name should be equal', () => {
        expect(duck.name).to.be.equal('ethan');
      });

      it('should have fly function', () => {
        expect(duck.fly).to.be.a('function');
      });

      it('should have quack function', () => {
        expect(duck.quack).to.be.a('function');
        expect(duck.quack()).to.be.equal('Quack!');
      });
    });

    describe('reduce() way', () => {
      const pipe = (...fns) => (x) => fns.reduce((y, f) => f(y), x);
      const duck = pipe(quacking('Quack from ethan'), flying)(new User());

      it('name should be equal', () => {
        expect(duck.name).to.be.equal('ethan');
      });

      it('should have fly function', () => {
        expect(duck.fly).to.be.a('function');
      });

      it('should have quack function', () => {
        expect(duck.quack).to.be.a('function');
        expect(duck.quack()).to.be.equal('Quack from ethan');
      });
    });

    describe('compose() way', () => {
      it('not yet impl', () => {});
    });
  });

  describe('implicity vs explicity, most case is using this', () => {
    describe('묵시적 방법 : default case : using this', () => {
      const withConfig = (config) => (o) =>
        Object.assign({}, o, {
          get(key) {
            return config[key] === undefined ? this.log(`Missing Config Key :${key}`) : config[key];
          },
        });

      it('log', () => {
        // 묵시적 방법 : 위에 this.log를 보면 this.log가 있다고 생각하고 사용한 것이다.
        const config = { server_key: 'a' };
        const userWithConfig = withConfig(config)(new User());

        expect(() => userWithConfig.get('server_key')).not.to.throw();
        expect(() => userWithConfig.get('client_key')).to.throw(); // TypeError: this.log is not a function
      });
    });

    describe('명시적 방법: pipe와 모듈 의존성을 사용해서...', () => {
      //   const withConfig = ({ initialConfig, logger }) => o =>
      //   pipe(
      //     withLogging(logger),
      //     addConfig(initialConfig)
      //   )(o)
      // ;
    });

    describe('명시적 방법 : Context나 Obj를 전달.', () => {
      // 명시적 방법 :
      // 인자를 전달할때 Quack을 주는 것이 아니라. context 객체 또는 모체가 되는 객체를 전달하면서.
      // this.log 되신 o.log 또는 ctx.log를 사용?
    });

    describe('더 고급진 방법인줄 알았는데 아닌듯...', () => {
      // 더 고급지게 .. 근데 이건 고급이 아니야 왜냐면 더 똑똑해지기 위해서 할일을 더하는 것 뿐
      // 이렇게 안할려고 mixin을 쓰는건데..
      // 둘중에 하나 선택 this.log가 없으면 default 값 바인딩.
      const withConfig = (config) => (o = { log: (text = '') => console.log(text) }) =>
        Object.assign({}, o, {
          get(key) {
            return config[key] == undefined ? this.log(`Missing config key: ${key}`) : config[key];
          },
        });

      it('', () => {});
    });
  });
});
