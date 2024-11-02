// @Palta.component
const Component = ({ name }: { name: string }) => {
  const content = <h1>Hello, {name}!</h1>;
  return <div>{content}</div>;
};

export default Component;
