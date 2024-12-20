import { useImages } from '../utils/fetchImage';
import { Image } from './Image';

export const Collage: () => React.JSX.Element = () => {
  const images = useImages();

  return (
    <>
      {images().map((value, index) => (
        <Image 
          {...value} 
          alt={value.name} 
          key={index} 
        />
      ))}
    </>
  );
};