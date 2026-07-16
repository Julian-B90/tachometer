import { useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useContainerLogs } from "../hook/useContainerLogs";
import Head from "./Head";

export function Logs() {
  const { id } = useParams();
  const { lines, isStreaming, start } = useContainerLogs(id);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    start();
  }, [start]);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  return (
    <>
      <Head />
      <Button sx={{ mb: 2 }} component={Link} to="/">
        Back
      </Button>
      <Stack direction="column" spacing={1}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Typography variant="subtitle1">
            Logs for {id?.slice(0, 12)}
          </Typography>
          {isStreaming && (
            <Typography variant="caption" color="success.main">
              Streaming...
            </Typography>
          )}
        </Stack>
        <Paper
          ref={containerRef}
          sx={{
            p: 1,
            height: "70vh",
            overflow: "auto",
            fontFamily: "monospace",
            fontSize: 12,
            lineHeight: 1.6,
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#0d1117" : "#f6f8fa",
            color: (theme) =>
              theme.palette.mode === "dark" ? "#c9d1d9" : "#24292f",
          }}
        >
          {lines.length === 0 && (
            <Typography variant="body2" color="text.secondary">
              Waiting for logs...
            </Typography>
          )}
          {lines.map((line, i) => (
            <Box key={i} sx={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>
              {line}
            </Box>
          ))}
        </Paper>
      </Stack>
    </>
  );
}
