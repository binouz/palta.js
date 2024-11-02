import Palta from "palta";

const Component = () => {
  const __$element$1 = Palta.createElement("h1", ["Hello, ", "", "!"]);
  const __$element$0 = Palta.createElement("div", [__$element$1]);
  let __$props = {};
  const __$update = ({ name, className }) => {
    __$props = { name, className };
    __$element$1.updateChild(1, () => {
      return name;
    });
    __$element$1.updateProps({ className: className });
  };
  let __$root = __$element$0;

  return {
    childrenElement: null,
    initialize: ({ name, className }) => {
      __$props = { name, className };
      __$element$1.updateChild(1, () => {
        return name;
      });
      __$element$1.initialize({ className: className });
      __$element$0.initialize({});
    },
    update: __$update,
    getRoot: () => __$root,
  };
};

export default Component;
