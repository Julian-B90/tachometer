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
        let buffer = "";

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
                buffer += data.stdout ?? "";
                const ansiRegex = /\x1b\[[0-9;]*[a-zA-Z]/g;
                const cleaned = buffer.replace(ansiRegex, "");
                const lines = cleaned.split("\n");
                buffer = lines.pop() ?? "";
                const parsed: DockerStats[] = [];
                for (const line of lines) {
                  const trimmed = line.trim();
                  if (trimmed) {
                    parsed.push(JSON.parse(trimmed));
                  }
                }
                if (parsed.length > 0) {
                  setResponse(parsed);
                }
              },
            },
          }
        );
    
        return () => {
          result.close();
        };
      }, [ddClient, container]);

      return response;
}