/**
 * Created by Paul on Jan 28.
 */
var service = require("ram/service/request");

describe("a RAM Microservice Template", () => {
  it("return a response from a registered action", () => {
    var response = request("template", {
      action: "add",
      left: 12, right: 22
    });
    response.then((packet) => {
      expect(packet.error).toBeUndefined();
      expect(packet.result).toBe(34)
    });
  });
  it("return an error if the service action throws an exception", () => {
    var response = service.request("template", {
      action: "divide",
      numerator: 12, denominator: 0
    });
    response.then((packet) => {
      expect(packet.error).toBeDefined();
      expect(packet.result).toBeUndefined();
    });
  });
  it("return an error if action is undefined or missing", () => {
    var response = service.request("template", {action: "not-an-action"});
    response.then((packet) => {
      expect(packet.error).toBeDefined();
      expect(packet.result).toBeUndefined();
    });
  });
  it("return an error if no JSON query packet provided", () => {
    var response = service.request("template");
    response.then((packet) => {
      expect(packet.error).toBeDefined();
      expect(packet.result).toBeUndefined();
    });
  });
});