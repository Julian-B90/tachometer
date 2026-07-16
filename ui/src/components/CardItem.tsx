import {
  Card,
  CardActionArea,
  CardContent,
  IconButton,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import ArticleIcon from "@mui/icons-material/Article";
import { Link } from "react-router-dom";
import { DockerStats } from "../hook/useStats";
import { useContainerActions } from "../hook/useContainerActions";
import LinearProgressWithLabel from "./LinearProgressWithLabel";
import { useEffect, useState } from "react";

export interface CardItemPorps {
  dockerStat: DockerStats;
}

const CardItem: React.FC<CardItemPorps> = ({ dockerStat }) => {
  const [maxCPU, setMaxCPU] = useState(0);
  const [maxMem, setMaxMem] = useState(0);
  const { execute } = useContainerActions();

  const cpuPerc = parseFloat(dockerStat?.CPUPerc ?? 0);
  const memPerc = parseFloat(dockerStat?.MemPerc ?? 0);
  const isWarning = cpuPerc > 90 || memPerc > 90;

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

  const handleAction = async (action: "stop" | "restart" | "pause" | "unpause", e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await execute(action, dockerStat.ID);
  };

  return (
    <Card
      key={dockerStat.ID}
      sx={{
        flex: "1 1 350px",
        border: isWarning ? "2px solid" : "none",
        borderColor: isWarning ? "error.main" : "transparent",
      }}
    >
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
      <Stack direction="row" spacing={1} sx={{ px: 1, pb: 1, justifyContent: "flex-end" }}>
        <Tooltip title="View Logs">
          <IconButton
            size="small"
            component={Link}
            to={`/logs/${dockerStat.ID}`}
            onClick={(e) => e.stopPropagation()}
          >
            <ArticleIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Stop">
          <IconButton size="small" color="error" onClick={(e) => handleAction("stop", e)}>
            <StopIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Restart">
          <IconButton size="small" color="warning" onClick={(e) => handleAction("restart", e)}>
            <RestartAltIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Pause">
          <IconButton size="small" color="info" onClick={(e) => handleAction("pause", e)}>
            <PauseIcon fontSize="small" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Resume">
          <IconButton size="small" color="success" onClick={(e) => handleAction("unpause", e)}>
            <PlayArrowIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>
    </Card>
  );
};

export default CardItem;
