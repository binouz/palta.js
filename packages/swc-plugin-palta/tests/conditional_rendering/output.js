import Palta from "palta";

const Component = () => {
  const __$element$2 = Palta.createElement("span", ["closed"]);
  const __$element$1 = Palta.createElement("span", ["opened"]);
  const __$element$0 = Palta.createElement("div", [""]);
  let __$props = {};
  const __$update = ({ open }) => {
    __$props = { open };
    __$element$0.updateChild(0, () => {
      return open ? __$element$1 : __$element$2;
    });
  };
  let __$root = __$element$0;

  return {
    childrenElement: null,
    initialize: ({ open }) => {
      __$props = { open };
      __$element$1.initialize({});
      __$element$2.initialize({});
      __$element$0.updateChild(0, () => {
        return open ? __$element$1 : __$element$2;
      });
      __$element$0.initialize({});
    },
    update: __$update,
    getRoot: () => __$root,
  };
};

export default Component;
