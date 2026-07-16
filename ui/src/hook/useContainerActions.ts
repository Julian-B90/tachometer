import { useCallback, useMemo } from "react";
import { createDockerDesktopClient } from "@docker/extension-api-client";

const useCreateDockerDesktopClient = () => useMemo(() => createDockerDesktopClient(), []);

export type ContainerAction = "stop" | "restart" | "pause" | "unpause";

export const useContainerActions = () => {
  const client = useCreateDockerDesktopClient();

  const execute = useCallback(
    async (action: ContainerAction, containerId: string) => {
      const args: Record<ContainerAction, string[]> = {
        stop: [containerId],
        restart: [containerId],
        pause: [containerId],
        unpause: [containerId],
      };
      await client.docker.cli.exec(action, args[action]);
    },
    [client]
  );

  return { execute };
};
