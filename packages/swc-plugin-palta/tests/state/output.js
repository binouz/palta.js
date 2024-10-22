import Palta from "palta";
import { $state } from "palta";

const Component = () => {
  const __$element$1 = Palta.createElement("h1", ["Hello, ", "", "!"]);
  const __$element$0 = Palta.createElement("div", [__$element$1]);
  let __$props = {};
  let name = "World";
  const setName = (value) => {
    name = typeof value === "function" ? value(name) : value;
    Palta.componentUpdate(() => __$update(__$props));
  };
  const __$update = ({}) => {
    __$props = {};
    __$element$1.updateChild(1, () => {
      return name;
    });
  };
  let __$root = __$element$0;

  return {
    childrenElement: null,
    update: __$update,
    getRoot: () => __$root,
  };
};

export default Component;
