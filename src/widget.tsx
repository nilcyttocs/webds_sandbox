import { ReactWidget } from '@jupyterlab/apputils';
import React from 'react';

export class FoobarWidget extends ReactWidget {
  render(): JSX.Element {
    return <h1>Welcome</h1>;
  }
}
