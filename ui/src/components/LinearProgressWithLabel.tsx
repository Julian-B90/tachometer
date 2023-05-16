import {
  Box,
  LinearProgress,
  LinearProgressProps,
  Typography,
} from "@mui/material";

type LinearProgressWithLabelProps = LinearProgressProps & {
  value: number;
  max: number;
};

const LinearProgressWithLabel: React.FC<LinearProgressWithLabelProps> = (
  props
) => {
  return (
    <>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" {...props} />
        </Box>
        <Box sx={{ minWidth: 100 }}>
          <Typography
            variant="body2"
            color="text.secondary"
          >{`${props.value}%`} / {props.max} max</Typography>
        </Box>
      </Box>
    </>
  );
};

export default LinearProgressWithLabel;
