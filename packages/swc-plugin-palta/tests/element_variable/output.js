import Palta from "palta";

const Component = () => {
  const __$element$1 = Palta.createElement("div", [""]);
  const __$element$0 = Palta.createElement("h1", ["Hello, ", "", "!"]);
  let __$props = {};
  const __$update = ({ name }) => {
    __$props = { name };
    __$element$0.updateChild(1, () => {
      return name;
    });
    const content = __$element$0;
    __$element$1.updateChild(0, () => {
      return content;
    });
  };
  let __$root = __$element$1;

  return {
    childrenElement: null,
    initialize: ({ name }) => {
      __$props = { name };
      __$element$0.updateChild(1, () => {
        return name;
      });
      __$element$0.initialize({});
      const content = __$element$0;
      __$element$1.updateChild(0, () => {
        return content;
      });
      __$element$1.initialize({});
    },
    update: __$update,
    getRoot: () => __$root,
  };
};

export default Component;