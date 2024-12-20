export interface WithName {
  name?: string;
};

export type ImageProps = React.ComponentProps<"img"> & WithName;
export const Image: (props: ImageProps) => React.JSX.Element = (props: ImageProps) => {
  return (
    <figure>
      <img {...props} />
      <figcaption>{props.name as string}</figcaption>
    </figure>
  );
};