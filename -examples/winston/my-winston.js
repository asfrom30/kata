/* eslint-disable no-console */
/* eslint-disable func-names */
const winston = require('winston');

const { format, transports, createLogger } = winston;

console.clear();

console.log('\r\n* default logger');
(function() {
  const logger = winston.createLogger();
  logger.info('default logger');
})();

console.log('\r\n* simple format');
(function() {
  const logger = winston.createLogger({ level: 'info', format: format.simple() });
  logger.info('simple format');
})();

// * label은 상위 옵션이 아니라 format.combine에 같이 묶어야 됨.

console.log('\r\n* simple format with timestamp and label');
(function() {
  const logger = createLogger({
    format: format.combine(
      format.label({ label: '[my-label]' }),
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss', // * format이 없으면 UTC타임으로 나오네.
      }),
      // * printf vs simple 있을때랑 없을때랑 다름
      // format.simple()
      format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [new transports.Console()],
  });

  logger.info('Hello there. How are you?');
})();

console.log('\r\n* splat');
(function() {
  const loggers = {
    splat: winston.createLogger({
      level: 'info',
      format: winston.format.combine(winston.format.splat(), winston.format.simple()),
      transports: [new winston.transports.Console()],
    }),
    simple: winston.createLogger({
      level: 'info',
      format: winston.format.simple(),
      transports: [new winston.transports.Console()],
    }),
  };

  const meta = {
    subject: 'Hello, World!',
    message: 'This message is a unique property separate from implicit merging.',
  };

  loggers.simple.info('email.message is hidden', meta);
  loggers.simple.info('email.message is hidden %j\n', meta);

  loggers.splat.info('This is overridden by meta', meta);
  loggers.splat.info('email.message is shown %j', meta);
})();

console.log('\r\n* replace text');
(function() {
  const logger = winston.createLogger({
    format: winston.format.printf((info) => {
      return JSON.stringify(info)
        .replace(/\{/g, '< wow ')
        .replace(/\:/g, ' such ')
        .replace(/\}/g, ' >');
    }),
    transports: [new winston.transports.Console()],
  });
})();

console.log('\r\n* colorize testing ');
(function() {
  const logger = winston.createLogger().add(
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        // winston.format.colorize({ all: true }), // * all : true or not
        winston.format.colorize({}), // * all : true or not
        winston.format.timestamp(),
        winston.format.align(), // * allign 좋네.
        winston.format.printf((info) => `${info.timestamp} [${info.level}] ${info.message}`)
      ),
    })
  );
  logger.info('colorized');
  console.log('hello'.toUpperCase());
})();

console.log('\r\n* custom pretty ');
(function() {
  const logger = winston.createLogger().add(
    new winston.transports.Console({
      level: 'info',
      format: winston.format.combine(
        winston.format.colorize({ all: true }), // * all : true or not
        winston.format.timestamp(),
        winston.format.align(),
        winston.format.printf((info) => `${info.timestamp} [${info.level}] ${info.message}`)
      ),
    })
  );
  logger.info({ a: { as: 'as' } });
})();

// Combine 땜에 달라지는게 아니라 logger.add() 문법이랑 winston.createLogger() default 값이 다르다.
console.log('\r\n* simple format with combine');
(function() {
  const logger = winston.createLogger();
  logger.add(new winston.transports.Console({ level: 'info', format: format.simple() }));
  logger.info('hi'); // expected output `info: hi`
})();

// describe('development', () => {
//   it('형식은 [2020-02-01 12:00:12][seeso.io][INFO] message', () => {});
//   it('object가 있는 경우 [Object object] 이렇게 나오면 안된다.', () => {});
// });

// describe('production', () => {
//   describe('File로 만들려면 색깔을 parsing해서 볼수 있는지...확인해서 colorize()나 decolorize()를 결정한다.', () => {
//     it('', () => {});
//   });

//   describe('Database에 보내는 용도로 만들기 위해서는, json으로 만들어서 보관하자..', () => {
//     it('', () => {});
//   });
// });

// describe('test', () => {
//   it('test에서는 info까지 켤까?', () => {});
// });
// 시간 측정.
// console.time();
// console.timeEnd();
/* eslint-enable no-console */
