const { expect } = require('chai');

const User = require('../../src/User');

describe('Second consideration option is Factory', () => {
  describe('makeQuackable()', () => {
    function makeQuackable(obj) {
      Object.assign(obj, {
        quack() {
          return 'quack!!';
        },
      });
      return obj;
    }

    const user = new User();
    const quack = makeQuackable(user);

    it('should indicate same object', () => {
      expect(quack).to.be.equal(user);
    });
    it('should return quack!!', () => {
      expect(user.quack()).to.be.equal('quack!!');
    });
  });

  describe('make Quackable() with closure', () => {
    const makeQuackable = (param) => (o) =>
      Object.assign({}, o, {
        quack: () => param,
      });

    it('method exist check', () => {
      expect(makeQuackable('Quack x 2')(new User()).quack).to.be.a('function');
    });

    it('method exist check', () => {
      expect(makeQuackable('Quack x 2')(new User()).quack()).to.be.equal('Quack x 2');
    });
  });
});
