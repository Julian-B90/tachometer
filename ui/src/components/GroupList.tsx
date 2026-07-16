import { Box, Chip, Collapse, Stack, Typography } from "@mui/material";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { DockerStats } from "../hook/useStats";
import CardItem from "./CardItem";

interface GroupListProps {
  stats: DockerStats[];
  labels: Record<string, Record<string, string>>;
}

interface Group {
  name: string;
  containers: DockerStats[];
}

function groupContainers(stats: DockerStats[], labels: Record<string, Record<string, string>>): Group[] {
  const groups = new Map<string, DockerStats[]>();

  for (const s of stats) {
    const containerLabels = labels[s.ID] ?? {};
    const groupName = containerLabels["com.docker.compose.project"] ?? "ungrouped";
    const existing = groups.get(groupName) ?? [];
    existing.push(s);
    groups.set(groupName, existing);
  }

  return Array.from(groups.entries()).map(([name, containers]) => ({
    name,
    containers,
  }));
}

const GroupList: React.FC<GroupListProps> = ({ stats, labels }) => {
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const groups = groupContainers(stats, labels);
  const hasGroups = groups.length > 1 || (groups.length === 1 && groups[0].name !== "ungrouped");

  if (!hasGroups) {
    return (
      <Stack direction="row" spacing={2} useFlexGap sx={{ alignItems: "flex-start", flexWrap: "wrap", justifyContent: "center" }}>
        {stats.map((s) => (
          <CardItem dockerStat={s} key={s.ID} />
        ))}
      </Stack>
    );
  }

  const toggle = (name: string) => {
    setCollapsed((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <Stack spacing={3}>
      {groups.map((group) => (
        <Box key={group.name}>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: "center", cursor: "pointer", mb: 1 }}
            onClick={() => toggle(group.name)}
          >
            <Typography variant="h6" sx={{ textTransform: "capitalize" }}>
              {group.name}
            </Typography>
            <Chip size="small" label={group.containers.length} color="primary" variant="outlined" />
            {collapsed[group.name] ? <ExpandMoreIcon /> : <ExpandLessIcon />}
          </Stack>
          <Collapse in={!collapsed[group.name]}>
            <Stack direction="row" spacing={2} useFlexGap sx={{ alignItems: "flex-start", flexWrap: "wrap" }}>
              {group.containers.map((s) => (
                <CardItem dockerStat={s} key={s.ID} />
              ))}
            </Stack>
          </Collapse>
        </Box>
      ))}
    </Stack>
  );
};

export default GroupList;
