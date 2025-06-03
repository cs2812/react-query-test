import "@testing-library/jest-dom";

/*
    console.warn
      ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future fl
ag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath.
*/

//warning solution
const originalWarn = console.warn;
beforeAll(() => {
  jest.spyOn(console, "warn").mockImplementation((msg, ...args) => {
    if (
      typeof msg === "string" &&
      msg.includes("React Router Future Flag Warning")
    ) {
      return;
    }
    originalWarn(msg, ...args);
  });
});
