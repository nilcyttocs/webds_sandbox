import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import { requestAPI } from './handler';

/**
 * Initialization data for the @webds/sandbox extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: '@webds/sandbox:plugin',
  autoStart: true,
  activate: async (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension @webds/sandbox is activated!');

    requestAPI<any>('get_example')
    .then(data => {
      console.log(data);
    })
    .catch(reason => {
      console.error(
        `The webds_sandbox server extension appears to be missing.\n${reason}`
      );
    });

    const eventHandler = (event: any) => {
      let jsonObject = JSON.parse(event.data);
      console.log(jsonObject.num);
    }
    let source = new window.EventSource("/webds-sandbox/foobar?query=fib");
    source.addEventListener('fib', eventHandler, false);
    source.onmessage = function(event) {
      console.log(event);
      if (event.lastEventId == 'stop') {
        source.close();
      }
    };

    await new Promise(r => setTimeout(r, 1000));

    const dataToSend = { data: 'boo!' };
    requestAPI<any>('foobar', {
      body: JSON.stringify(dataToSend),
      method: 'POST'
    }).then(data=> {
      console.log(data);
    }).catch(reason => {
      console.error(
        `Error on POST /webds-sandbox/foobar ${dataToSend}.\n${reason}`
      );
    });
  }
};

export default plugin;
