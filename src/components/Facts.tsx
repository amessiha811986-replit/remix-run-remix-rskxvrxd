import { useFacts } from "../utils/facts";

export const Facts: () => React.JSX.Element = () => {
  const facts = useFacts();

  return (
    <ul>
      {facts().map((value, index) => (
        <li key={index}>{value}</li>
      ))}
    </ul>
  );
};