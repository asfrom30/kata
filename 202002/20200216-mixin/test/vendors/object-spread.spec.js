const chocolate = { hasChocolate: () => true };
const caramelSwirl = { hasCaramelSwirl: () => true };
const pecans = { hasPecans: () => true };

const newObj = { ...chocolate, ...caramelSwirl, ...pecans };
console.log(newObj.hasCaramelSwirl());
