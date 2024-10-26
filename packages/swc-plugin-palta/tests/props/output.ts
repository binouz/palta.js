import Palta from "palta";

const Component = (): Palta.ComponentDefinition<{
  name: string;
}> => {
  const __$element$1 = Palta.createElement("h1", ["Hello, ", "", "!"]);
  const __$element$0 = Palta.createElement("div", [__$element$1]);
  let __$props: any = {};
  const __$update = ({ name }: { name: string }) => {
    __$props = { name };
    __$element$1.updateChild(1, () => {
      return name;
    });
    __$element$1.updateProps({ className: "main" });
  };
  let __$root = __$element$0;

  return {
    childrenElement: null,
    update: __$update,
    getRoot: () => __$root,
  };
};

export default Component;
