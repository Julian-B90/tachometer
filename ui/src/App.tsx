import { createDockerDesktopClient } from "@docker/extension-api-client";
import { CircularProgress, Stack } from "@mui/material";
import { useCallback, useEffect, useMemo, useState } from "react";
import CardList from "./components/CardList";

// Note: This line relies on Docker Desktop's presence as a host application.
// If you're running this React app in a browser, it won't work properly.
const useCreateDockerDesktopClient = () => useMemo(() => createDockerDesktopClient(), []);

const useDockerDesktopClient = () => {
  const client = useCreateDockerDesktopClient();
  return useCallback(() => client, [client]);
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
  const ddClient = useDockerDesktopClient();

  useEffect(() => {
    let newData: DockerStats[] = [];
    const result = ddClient().docker.cli.exec(
      "stats",
      ["--no-trunc", "--format", "{{ json . }}"],
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
          splitOutputLines: true,
        },
      }
    );

    return () => {
      console.debug("Clean up!");
      result.close();
      newData = [];
    };
  }, [ddClient]);

  return (
    <>
      {!response && (
        <Stack
          sx={{ height: "100vh" }}
          direction="column"
          alignItems="center"
          justifyContent="center"
        >
          <CircularProgress />
        </Stack>
      )}
      {response && (
        <Stack
          direction="row"
          alignItems="start"
          justifyContent="center"
          spacing={2}
          sx={{ mt: 4 }}
          useFlexGap
          flexWrap="wrap"
        >
          <CardList dockerStats={response} />
        </Stack>
      )}
    </>
  );
}
