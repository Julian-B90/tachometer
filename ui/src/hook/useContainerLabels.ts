import { useCallback, useEffect, useMemo, useState } from "react";
import { createDockerDesktopClient } from "@docker/extension-api-client";

const useCreateDockerDesktopClient = () => useMemo(() => createDockerDesktopClient(), []);

export const useContainerLabels = () => {
  const [labels, setLabels] = useState<Record<string, Record<string, string>>>({});
  const client = useCreateDockerDesktopClient();

  const fetchLabels = useCallback(async () => {
    try {
      const result = await client.docker.cli.exec("ps", [
        "--no-trunc",
        "--format",
        "{{.ID}} {{.Names}}",
      ]);
      const output = result.stdout?.trim();
      if (!output) return;

      const containerIds = output
        .split("\n")
        .map((line) => line.trim().split(" ")[0])
        .filter(Boolean);

      if (containerIds.length === 0) return;

      const inspectResult = await client.docker.cli.exec("inspect", containerIds);
      const containers = JSON.parse(inspectResult.stdout);

      const parsed: Record<string, Record<string, string>> = {};
      for (const container of containers) {
        parsed[container.Id] = container.Config?.Labels ?? {};
      }
      setLabels(parsed);
    } catch (err) {
      console.error("Failed to fetch container labels", err);
    }
  }, [client]);

  useEffect(() => {
    fetchLabels();
    const interval = setInterval(fetchLabels, 30000);
    return () => clearInterval(interval);
  }, [fetchLabels]);

  return labels;
};
