import { Typography, Box, useTheme } from "@mui/material";

const Head: React.FC = () => {
  const { spacing } = useTheme();

  return (
    <Box sx={{ mb: 3 }}>
      <Typography
        variant="h1"
        sx={{ fontSize: spacing(2.875), mb: spacing(1.5) }}
      >
        Tachometer
      </Typography>
      <Box>Shows real-time cpu and memory usage of containers</Box>
    </Box>
  );
};

export default Head;
