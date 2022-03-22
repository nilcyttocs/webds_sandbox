import React from 'react';

import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';

export const FoobarMui = (props:any): JSX.Element => {
  return (
    <ThemeProvider theme={props.theme}>
      <div>
        <Typography
          variant='h5'
        >
          Foobar
        </Typography>
      </div>
    </ThemeProvider>
  );
};
