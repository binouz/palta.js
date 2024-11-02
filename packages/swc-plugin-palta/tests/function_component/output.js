import Palta from "palta";

function Component() {
  const __$element$1 = Palta.createElement("h1", ["Hello, ", "", "!"]);
  const __$element$0 = Palta.createElement("div", [__$element$1]);
  let __$props = {};
  const __$update = ({ name }) => {
    __$props = { name };
    __$element$1.updateChild(1, () => {
      return name;
    });
  };
  let __$root = __$element$0;

  return {
    childrenElement: null,
    initialize: ({ name }) => {
      __$props = { name };
      __$element$1.updateChild(1, () => {
        return name;
      });
      __$element$1.initialize({});
      __$element$0.initialize({});
    },
    update: __$update,
    getRoot: () => __$root,
  };
}

export default Component;
