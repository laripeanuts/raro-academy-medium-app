import { faker } from "@faker-js/faker";
import { ArticleThumbnailProps } from "../../components/ArticleThumbnail/ArticleThumbnail.types";

export const geraArtigos = (quantidade: number): ArticleThumbnailProps[] => {
  return Array.from(new Array(quantidade)).map((_,index) => ({
    id: index,
    imagem: faker.image.imageUrl(),
    titulo: faker.lorem.sentence(),
    resumo: faker.lorem.paragraph(),
    dataPublicacao: faker.date.past(),
    tempoLeitura: `${faker.datatype.number({ min: 1, max: 10 })} min`,
    autor: {
      nome: faker.name.firstName(),
      avatar: faker.image.avatar(),
    },
  }));
};
