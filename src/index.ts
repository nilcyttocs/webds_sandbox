import {
  ILayoutRestorer,
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from "@jupyterlab/application";

import { WidgetTracker } from "@jupyterlab/apputils";

import { ILauncher } from "@jupyterlab/launcher";

import { WebDSService, WebDSWidget } from "@webds/service";

import { sandboxIcon } from "./icons";

import { SandboxWidget } from "./widget_container";

namespace Attributes {
  export const command = "webds_sandbox:open";
  export const id = "webds_sandbox_widget";
  export const label = "Sandbox";
  export const caption = "Sandbox";
  export const category = "DSDK - Applications";
  export const rank = 999;
}

/**
 * Initialization data for the @webds/sandbox extension.
 */
const plugin: JupyterFrontEndPlugin<void> = {
  id: "@webds/sandbox:plugin",
  autoStart: true,
  requires: [ILauncher, ILayoutRestorer, WebDSService],
  activate: (
    app: JupyterFrontEnd,
    launcher: ILauncher,
    restorer: ILayoutRestorer,
    service: WebDSService
  ) => {
    console.log("JupyterLab extension @webds/sandbox is activated!");

    let widget: WebDSWidget;
    const { commands, shell } = app;
    const command = Attributes.command;
    commands.addCommand(command, {
      label: Attributes.label,
      caption: Attributes.caption,
      icon: (args: { [x: string]: any }) => {
        return args["isLauncher"] ? sandboxIcon : undefined;
      },
      execute: () => {
        if (!widget || widget.isDisposed) {
          const content = new SandboxWidget(Attributes.id, service);
          widget = new WebDSWidget<SandboxWidget>({ content });
          widget.id = Attributes.id;
          widget.title.label = Attributes.label;
          widget.title.icon = sandboxIcon;
          widget.title.closable = true;
        }

        if (!tracker.has(widget)) tracker.add(widget);

        if (!widget.isAttached) shell.add(widget, "main");

        shell.activateById(widget.id);

        widget.setShadows();
      }
    });

    launcher.add({
      command,
      args: { isLauncher: true },
      category: Attributes.category,
      rank: Attributes.rank
    });

    let tracker = new WidgetTracker<WebDSWidget>({
      namespace: Attributes.id
    });
    restorer.restore(tracker, { command, name: () => Attributes.id });
  }
};

export default plugin;
