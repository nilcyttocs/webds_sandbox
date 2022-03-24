import React, { useEffect, useState } from 'react';

import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material/styles';

import { requestAPI } from './handler';

const WORKSPACE_DIR = '%2Fhome%2Fpi%2Fjupyter%2Fworkspace';

export const FoobarMui = (props:any): JSX.Element => {
  const [workspaceDir, setWorkspaceDir] = useState<any>(null);

  const getWorkspaceDir = async () => {
    try {
      const dir = await requestAPI<any>('filesystem?dir=' + WORKSPACE_DIR);
      setWorkspaceDir(dir)
      console.log(dir);
    } catch (error) {
      console.error(`Error - GET /webds/filesystem?dir=${WORKSPACE_DIR}\n${error}`);
    }
  };

  useEffect(() => {
    getWorkspaceDir();
  }, []);

  let nodeID = 0;
  const generateTree = (node: any): JSX.Element => {
    nodeID += 1;
    return(
      <TreeItem nodeId={nodeID.toString()} label={node.name}>
        {Array.isArray(node.children) ? node.children.map((node: any) => generateTree(node)) : null}
      </TreeItem>
    );
  };

  return (
    <ThemeProvider theme={props.theme}>
      <div>
        <Typography
          variant='h5'
        >
          Foobar
        </Typography>
        {workspaceDir ? (
          <TreeView
            multiSelect
            defaultCollapseIcon={<ExpandMoreIcon/>}
            defaultExpandIcon={<ChevronRightIcon/>}
            sx={{height: 240, maxWidth: 400}}
          >
            {generateTree(workspaceDir)}
          </TreeView>
        ) : (
          null
        )}
      </div>
    </ThemeProvider>
  );
};
