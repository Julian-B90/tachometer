import React, { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import { createDockerDesktopClient } from "@docker/extension-api-client";
import {
  Card,
  CardContent,
  CircularProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CardList from "./components/CardList";

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const client = createDockerDesktopClient();

function useDockerDesktopClient() {
  return client;
}

export interface DockerStats {
  BlockIO: string;
  CPUPerc: string;
  Container: string;
  ID: string;
  MemPerc: string;
  MemUsage: string;
  Name: string;
  NetIO: string;
  PIDs: string;
}

export function App() {
  const [response, setResponse] = useState<DockerStats[]>();
  const [test, setTest] = useState<any>();
  const [loading, setLoading] = useState(false);
  const ddClient = useDockerDesktopClient();

  const handelFetch = async () => {
    // setLoading(true);
    // fetchAndDisplayResponse();
  };

  useEffect(() => {
    let newData: DockerStats[] = [];
    const result = ddClient.docker.cli.exec(
      "stats",
      [
        // "--no-stream",
        "--no-trunc",
        "--format",
        "{{ json . }}",
        // '{"container_id":"{{.ID}}", "container_name":"{{.Name}}", "cpu":"{{.CPUPerc}}", "mem":"{{.MemUsage}}", "net_io":"{{.NetIO}}", "block_io":"{{.BlockIO}}", "mem_percent":"{{.MemPerc}}"}'
      ],
      {
        stream: {
          onError(error) {
            console.error("error", error);
          },
          onOutput(data) {
            if (data.stdout?.includes("[2J[H")) {
              setResponse(newData);
              newData = [];
              newData.push(
                JSON.parse(data.stdout.replace("[2J[H", "").replace("\x1B", ""))
              );
            } else {
              newData.push(JSON.parse(data.stdout ?? ""));
            }
          },
          onClose(exitCode: number): void {
            console.log("onClose with exit code " + exitCode);
          },
          splitOutputLines: true,
        },
      }
    );

    return () => {
      console.debug("Clean up!");
      result.close();
      newData = [];
    };
  }, []);

  return (
    <>
      <Stack direction="row" alignItems="start" spacing={2} sx={{ mt: 4 }}>
        {response && <CardList dockerStats={response} />}
      </Stack>
    </>
  );
}
