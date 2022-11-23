import { GnosisDelegation } from "../src";

test("Instantiate GnosisDelegation successfully", () => {
  expect(() => {
    const server = new GnosisDelegation();
  }).not.toThrowError();
});
