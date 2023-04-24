import { useCallback, useEffect, useMemo, useState } from "react";
import { createDockerDesktopClient } from "@docker/extension-api-client";

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

export const useStats = (container?: string) => {
    const [response, setResponse] = useState<DockerStats[]>();

    const ddClient = useDockerDesktopClient();

    useEffect(() => {
        let newData: DockerStats[] = [];

        const options = ["--no-trunc", "--format", "{{ json . }}"];

        if (container) {
            options.push(container);
        }

        const result = ddClient().docker.cli.exec(
          "stats",
          options,
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
      }, [ddClient, container]);

      return response;
}