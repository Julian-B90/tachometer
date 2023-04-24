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
  Typography
} from "@mui/material";
import { Link } from "react-router-dom";
import { DockerStats } from "../hook/useStats";
import LinearProgressWithLabel from "./LinearProgressWithLabel";

export interface CardListPorps {
  dockerStats: DockerStats[];
}

const CardList: React.FC<CardListPorps> = ({ dockerStats }) => {
  return (
    <>
      {dockerStats?.map((item) => {
        return (
          <Card key={item.ID} sx={{ flex: "1 1 350px" }}>
            <CardActionArea component={Link} to={`details/${item.ID}`}>
              <CardContent>
                <Typography noWrap sx={{ fontSize: 14 }} color="text.secondary">
                  Container: {item?.Container}
                </Typography>
                <Tooltip title={item?.Name}>
                  <Typography noWrap variant="h5" component="div">
                    {item?.Name}
                  </Typography>
                </Tooltip>
                <Table component={Paper} sx={{ border: "none" }}>
                  <TableBody>
                    <TableRow>
                      <TableCell component="th" scope="row" width={30}>
                        CPU
                      </TableCell>
                      <TableCell>
                        <LinearProgressWithLabel
                          value={parseFloat(item?.CPUPerc)}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" width={30}>
                        MemPerc
                      </TableCell>
                      <TableCell>
                        <LinearProgressWithLabel
                          value={parseFloat(item?.MemPerc)}
                        />
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" width={30}>
                        MemUsage
                      </TableCell>
                      <TableCell>{item?.MemUsage}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" width={30}>
                        BlockIO
                      </TableCell>
                      <TableCell>{item?.BlockIO}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" width={30}>
                        NetIO
                      </TableCell>
                      <TableCell>{item?.NetIO}</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell component="th" scope="row" width={30}>
                        PIDs
                      </TableCell>
                      <TableCell>{item?.PIDs}</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })}
    </>
  );
};

export default CardList;
