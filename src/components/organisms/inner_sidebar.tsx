import Colors from "../../static/colors";
import React from "react";
import InnerSidebarButton from "../molecules/inner_sidebar_button";

export type InnerSidebarButtonData = {
  id: string;
  label: string;
  onClick: () => void;
};

type InnerSidebarProps = {
  className?: string;
  buttons: Array<InnerSidebarButtonData>;
};

class InnerSidebar extends React.Component<InnerSidebarProps, Record<string, never>> {
  render() {
    const buttons = this.props.buttons.map(function (button) {
      return (
        <InnerSidebarButton key={button.id} onClick={button.onClick}>
          {button.label}
        </InnerSidebarButton>
      );
    });
    return (
      <div className={`flex flex-col w-56 border-r ${Colors.THEME_2.toString("border")} ${Colors.THEME_1.toString("bg")}`}>
        <div className="flex flex-col flex-grow p-4 overflow-auto">{buttons}</div>
      </div>
    );
  }
}

export default InnerSidebar;
