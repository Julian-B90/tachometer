import {
  Card,
  CardContent,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import { DockerStats } from "../App";
import LinearProgressWithLabel from "./LinearProgressWithLabel";

interface CardListPorps {
  dockerStats: DockerStats[];
}

const CardList: React.FC<CardListPorps> = ({ dockerStats }) => {
  console.log("dockerStats", dockerStats);

  return (
    <>
      {dockerStats?.map((item) => (
        <Card key={item.ID} sx={{ width: 350 }}>
          <CardContent>
            <Typography noWrap sx={{ fontSize: 14 }} color="text.secondary">
              Container: {item?.Container}
            </Typography>
            <Tooltip title={item?.Name}>
              <Typography noWrap variant="h5" component="div">
                {item?.Name}
              </Typography>
            </Tooltip>
            <Table border={0}>
              <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row">
                    CPU
                  </TableCell>
                  <TableCell>
                    <LinearProgressWithLabel
                      value={parseFloat(item?.CPUPerc)}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    MemPerc
                  </TableCell>
                  <TableCell>
                    <LinearProgressWithLabel
                      value={parseFloat(item?.MemPerc)}
                    />
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    MemUsage
                  </TableCell>
                  <TableCell>{item?.MemUsage}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    BlockIO
                  </TableCell>
                  <TableCell>{item?.BlockIO}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    NetIO
                  </TableCell>
                  <TableCell>{item?.NetIO}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell component="th" scope="row">
                    PIDs
                  </TableCell>
                  <TableCell>{item?.PIDs}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default CardList;
