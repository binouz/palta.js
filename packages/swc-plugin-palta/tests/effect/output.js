import Palta from "palta";

const Component = () => {
  const __$element$1 = Palta.createElement("h1", ["Hello, ", "", "!"]);
  const __$element$0 = Palta.createElement("div", [__$element$1]);
  let __$props = {};
  const __$effect$0 = {
    deps: null,
    callback: () => {
      console.log("Name has changed");
    },
    cleanup: null,
  };
  const __$update = ({ name }) => {
    __$props = { name };
    __$element$1.updateChild(1, () => {
      return name;
    });
    Palta.runEffect(__$effect$0, [name]);
  }
  let __$root = __$element$0;

  return {
    childrenElement: null,
    update: __$update,
    getRoot: () => __$root,
  };
};

export default Component;