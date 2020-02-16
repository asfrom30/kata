const { expect } = require('chai');

describe('Consider pure function first', () => {
  function quack() {
    return 'quack!!';
  }

  function flying() {
    return 'flying';
  }

  it('quack()', () => {
    expect(quack()).to.be.equal('quack!!');
  });

  it('flying()', () => {
    expect(flying()).to.be.equal('flying');
  });
});
