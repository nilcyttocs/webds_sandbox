import { ReactWidget } from '@jupyterlab/apputils';
import React from 'react';

import { WebDSService } from '@webds/service';

import { FoobarMui } from './widget_mui';

const FoobarContainer = (props: any): JSX.Element => {
  const webdsTheme = props.service.ui.getWebDSTheme();

  return (
    <div className='jp-webds-widget-body'>
      <FoobarMui theme={webdsTheme}/>
    </div>
  );
};

export class FoobarWidget extends ReactWidget {
  service: WebDSService|null = null;

  constructor(service: WebDSService) {
    super();
    this.service = service;
  }

  render(): JSX.Element {
    return (
      <div className='jp-webds-widget'>
        <FoobarContainer service={this.service}/>
      </div>
    );
  }
}
