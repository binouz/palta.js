// @Palta.component
const Component = ({ name, className }) => {
  return (
    <div>
      <h1 className={className}>Hello, {name}!</h1>
    </div>
  );
};

export default Component;
