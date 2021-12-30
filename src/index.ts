import {
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from '@jupyterlab/application';

import {
  MainAreaWidget,
  WidgetTracker
} from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

import { foobarIcon } from './icons';

import { FoobarWidget } from './widget';

import { requestAPI } from './handler';

/**
 * Initialization data for the @webds/sandbox extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: '@webds/sandbox:plugin',
  autoStart: true,
  requires: [ILauncher, ILayoutRestorer],
  activate: async (app: JupyterFrontEnd, launcher: ILauncher, restorer: ILayoutRestorer) => {
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

    const dataToSend = {data: 'boo!'};
    requestAPI<any>('foobar', {
      body: JSON.stringify(dataToSend),
      method: 'POST'
    }).then(data=> {
      console.log(data);
    }).catch(reason => {
      console.error(
        `Error on POST /webds-sandbox/foobar\n${reason}`
      );
    });

    let widget: MainAreaWidget;
    const {commands, shell} = app;
    const command: string = 'webds_sandbox_foobar:open';
    commands.addCommand(command, {
      label: 'Foobar',
      caption: 'Foobar',
      icon: (args: {[x: string]: any}) => {
        return args['isLauncher'] ? foobarIcon : undefined;
      },
      execute: () => {
        if (!widget || widget.isDisposed) {
          const content = new FoobarWidget();
          widget = new MainAreaWidget<FoobarWidget>({content});
          widget.id = 'webds_sandbox_foobar_widget';
          widget.title.label = 'Foobar';
          widget.title.icon = foobarIcon;
          widget.title.closable = true;
        }

        if (!tracker.has(widget))
          tracker.add(widget);

        if (!widget.isAttached)
          shell.add(widget, 'main');

        shell.activateById(widget.id);
      }
    });

    launcher.add({command, args: {isLauncher: true}, category: 'WebDS'});

    let tracker = new WidgetTracker<MainAreaWidget>({namespace: 'webds_sandbox_foobar'});
    restorer.restore(tracker, {command, name: () => 'webds_sandbox_foobar'});
  }
};

export default plugin;
