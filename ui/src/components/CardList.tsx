import { DockerStats } from "../hook/useStats";
import CardItem from "./CardItem";

export interface CardListPorps {
  dockerStats: DockerStats[];
}

const CardList: React.FC<CardListPorps> = ({ dockerStats }) => {
  return (
    <>
      {dockerStats?.map((item) => (
        <CardItem dockerStat={item} />
      ))}
    </>
  );
};

export default CardList;
