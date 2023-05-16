import {
  Card,
  CardActionArea,
  CardContent,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { DockerStats } from "../hook/useStats";
import LinearProgressWithLabel from "./LinearProgressWithLabel";
import { useEffect, useState } from "react";

export interface CardItemPorps {
  dockerStat: DockerStats;
}

const CardItem: React.FC<CardItemPorps> = ({ dockerStat }) => {
  const [maxCPU, setMaxCPU] = useState(0);
  const [maxMem, setMaxMem] = useState(0);

  const cpuPerc = parseFloat(dockerStat?.CPUPerc ?? 0);
  const memPerc = parseFloat(dockerStat?.MemPerc ?? 0);

  useEffect(() => {
    if (cpuPerc > maxCPU) {
      setMaxCPU(cpuPerc);
    }
  }, [cpuPerc]);
  useEffect(() => {
    if (memPerc > maxMem) {
      setMaxMem(memPerc);
    }
  }, [memPerc]);

  return (
    <Card key={dockerStat.ID} sx={{ flex: "1 1 350px" }}>
      <CardActionArea component={Link} to={`details/${dockerStat.ID}`}>
        <CardContent>
          <Typography noWrap sx={{ fontSize: 14 }} color="text.secondary">
            Container: {dockerStat?.Container}
          </Typography>
          <Tooltip title={dockerStat?.Name}>
            <Typography noWrap variant="h5" component="div">
              {dockerStat?.Name}
            </Typography>
          </Tooltip>
          <Table component={Paper} sx={{ border: "none" }}>
            <TableBody>
              <TableRow>
                <TableCell component="th" scope="row" width={25}>
                  CPU
                </TableCell>
                <TableCell>
                  <LinearProgressWithLabel value={cpuPerc} max={maxCPU} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" width={25}>
                  MemPerc
                </TableCell>
                <TableCell>
                  <LinearProgressWithLabel value={memPerc} max={maxMem} />
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" width={25}>
                  MemUsage
                </TableCell>
                <TableCell>{dockerStat?.MemUsage}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" width={25}>
                  BlockIO
                </TableCell>
                <TableCell>{dockerStat?.BlockIO}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" width={25}>
                  NetIO
                </TableCell>
                <TableCell>{dockerStat?.NetIO}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" width={25}>
                  PIDs
                </TableCell>
                <TableCell>{dockerStat?.PIDs}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CardItem;
