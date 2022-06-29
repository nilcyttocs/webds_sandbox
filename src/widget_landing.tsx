import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const WIDTH = 800;
const HEIGHT_TITLE = 70;
const HEIGHT_CONTENT = 450;
const HEIGHT_CONTROLS = 120;

export const Landing = (props: any): JSX.Element => {
  return (
    <>
      <Stack spacing={2}>
        <Box
          sx={{
            width: WIDTH + "px",
            height: HEIGHT_TITLE + "px",
            position: "relative",
            bgcolor: "section.main"
          }}
        >
          <Typography
            variant="h5"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)"
            }}
          >
            Extension Title
          </Typography>
          <Button
            variant="text"
            sx={{
              position: "absolute",
              top: "50%",
              left: "8px",
              transform: "translate(0%, -50%)"
            }}
          >
            <Typography variant="body2" sx={{ textDecoration: "underline" }}>
              Help
            </Typography>
          </Button>
        </Box>
        <Box
          sx={{
            width: WIDTH + "px",
            height: HEIGHT_CONTENT + "px",
            position: "relative",
            bgcolor: "section.main"
          }}
        >
          <Typography
            variant="h1"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)"
            }}
          >
            Content
          </Typography>
        </Box>
        <Box
          sx={{
            width: WIDTH + "px",
            height: HEIGHT_CONTROLS + "px",
            position: "relative",
            bgcolor: "section.main"
          }}
        >
          <Typography
            variant="h3"
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)"
            }}
          >
            Controls
          </Typography>
        </Box>
      </Stack>
    </>
  );
};
