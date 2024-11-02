// @Palta.component
const Component = ({
  name,
  className,
}: {
  name: string;
  className: string;
}) => {
  return (
    <div>
      <h1 className={className}>Hello, {name}!</h1>
    </div>
  );
};

export default Component;
