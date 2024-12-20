import { useState } from "react";

export const images: Array<{ src: string, name: string }> = [
  {
    src: "https://cdn.vox-cdn.com/thumbor/pagpdCp4Ihn-d-A5fD7o8qlU_Vk=/0x0:4500x3000/920x613/filters:focal(1890x1140:2610x1860):format(webp)/cdn.vox-cdn.com/uploads/chorus_image/image/52855275/PorkSoupDumplings_DUMPLINGGALAXY.0.jpg",
    name: "Pork Soup Dumplings"
  },
  {
    src: "https://savvybites.co.uk/wp-content/uploads/2024/02/Easy-15-Minute-Chinese-Noodles-1.jpg",
    name: "Lo Mein Chinese Noodles"
  },
  {
    src: "https://dashofting.com/wp-content/uploads/2021/09/Easy-Chinese-Cucumber-Recipe-Horizontal-e1665872443758.jpg",
    name: "Chinese Cucumbers"
  },
  {
    src: "https://cdn.britannica.com/82/94382-050-20CF23DB/Great-Wall-of-China-Beijing.jpg",
    name: "Great Wall of China"
  },
  {
    src: "https://d3vonci41uckcv.cloudfront.net/old-images/original/67fe02ca-c71c-4868-9cf6-f646d102d56f.jpg",
    name: "Forbidden City"
  },
  {
    src: "https://ik.imagekit.io/tvlk/blog/2024/07/The-Modern-Shanghai-Tower.jpg?tr=q-70,w-625,dpr-2",
    name: "The Modern Shanghi Tower"
  },
  {
    src: "https://ik.imagekit.io/tvlk/blog/2023/09/eWOIa2dz-hangzhou-west-lake-1024x683.jpg?tr=q-70,w-625,dpr-2",
    name: "Tranquil West Lake"
  }
];

export function useImageByName(name: string) {
  const [image, setImage] = useState({
    src: "",
    name: "",
  });
  
  images.forEach((value) => {
    if (value.name === name) {
      setImage(value);
    };
  });

  return {
    image,
    usage: (
      <img {...image} />
    ) as React.JSX.Element
  };
};

export const useImages = () => () => images;