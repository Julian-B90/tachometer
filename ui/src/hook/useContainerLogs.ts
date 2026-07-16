import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createDockerDesktopClient } from "@docker/extension-api-client";

const useCreateDockerDesktopClient = () => useMemo(() => createDockerDesktopClient(), []);

export const useContainerLogs = (containerId: string | undefined) => {
  const [lines, setLines] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const bufferRef = useRef("");
  const client = useCreateDockerDesktopClient();

  const start = useCallback(async () => {
    if (!containerId || isStreaming) return;

    setLines([]);
    setIsStreaming(true);
    bufferRef.current = "";

    const result = client.docker.cli.exec("logs", [
      "--tail",
      "100",
      "-f",
      containerId,
    ], {
      stream: {
        onError(error) {
          console.error("Log stream error", error);
          setIsStreaming(false);
        },
        onOutput(data) {
          const raw = data.stdout ?? "";
          bufferRef.current += raw;
          const ansiRegex = /\x1b\[[0-9;]*[a-zA-Z]/g;
          const cleaned = bufferRef.current.replace(ansiRegex, "");
          const parts = cleaned.split("\n");
          bufferRef.current = parts.pop() ?? "";
          if (parts.length > 0) {
            setLines((prev) => [...prev, ...parts].slice(-500));
          }
        },
      },
    });

    return () => {
      result.close();
      setIsStreaming(false);
    };
  }, [containerId, client, isStreaming]);

  const stop = useCallback(() => {
    setIsStreaming(false);
  }, []);

  useEffect(() => {
    return () => {
      setIsStreaming(false);
    };
  }, []);

  return { lines, isStreaming, start, stop };
};
