import { DockerStats } from "../hook/useStats";
import CardItem from "./CardItem";

export interface CardListPorps {
  dockerStats: DockerStats[];
}

const CardList: React.FC<CardListPorps> = ({ dockerStats }) => (
  <>
    {dockerStats.map((item) => (
      <CardItem dockerStat={item} key={item.ID} />
    ))}
  </>
);

export default CardList;
