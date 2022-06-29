import {
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from "@jupyterlab/application";

import { WidgetTracker } from "@jupyterlab/apputils";

import { ILauncher } from "@jupyterlab/launcher";

import { WebDSService, WebDSWidget } from "@webds/service";

import { foobarIcon } from "./icons";

import { SandboxWidget } from "./widget_container";

/**
 * Initialization data for the @webds/sandbox extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: "@webds/sandbox:plugin",
  autoStart: true,
  requires: [ILauncher, ILayoutRestorer, WebDSService],
  activate: async (
    app: JupyterFrontEnd,
    launcher: ILauncher,
    restorer: ILayoutRestorer,
    service: WebDSService
  ) => {
    console.log("JupyterLab extension @webds/sandbox is activated!");

    let widget: WebDSWidget;
    const { commands, shell } = app;
    const command: string = "webds_sandbox_foobar:open";
    commands.addCommand(command, {
      label: "Foobar",
      caption: "Foobar",
      icon: (args: { [x: string]: any }) => {
        return args["isLauncher"] ? foobarIcon : undefined;
      },
      execute: () => {
        if (!widget || widget.isDisposed) {
          const content = new SandboxWidget(service);
          widget = new WebDSWidget<SandboxWidget>({ content });
          widget.id = "webds_sandbox_foobar_widget";
          widget.title.label = "Foobar";
          widget.title.icon = foobarIcon;
          widget.title.closable = true;
        }

        if (!tracker.has(widget)) tracker.add(widget);

        if (!widget.isAttached) shell.add(widget, "main");

        shell.activateById(widget.id);
      }
    });

    launcher.add({ command, args: { isLauncher: true }, category: "WebDS" });

    let tracker = new WidgetTracker<WebDSWidget>({
      namespace: "webds_sandbox_foobar"
    });
    restorer.restore(tracker, { command, name: () => "webds_sandbox_foobar" });
  }
};

export default plugin;
