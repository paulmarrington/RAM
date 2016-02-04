var service = require("ram/register.js");

service.register({
  plus: (packet) => {
    return { result:  packet.left + packet.right }
  },
  divide: (packet) => {
    return { result:  packet.numerator / packet.denominator }
  }
});
