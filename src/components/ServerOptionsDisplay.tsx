import React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";

interface ServerOptionsProps {
  serverOptions: Array<string>;
  sx?: object;
}

const ServerOptionsDisplay: React.FC<ServerOptionsProps> = ({ serverOptions, sx }) => {
  return (
    <Box>
      <h2>Server Model Options</h2>
      {
        serverOptions.length > 0 
        ? (
          <List sx={{ listStyleType: "disc" , pl: 4 }}>
            {serverOptions.map((option) => (
              <ListItem sx={{display: "list-item"}} key={option}>{option}</ListItem>
            ))}
          </List>
        )
        : (
          <p>No options available</p>
        )
      }
    </Box>
  );
}

export default ServerOptionsDisplay;
