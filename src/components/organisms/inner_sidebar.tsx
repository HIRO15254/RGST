import Colors from "../../static/colors";
import React from "react";
import InnerSidebarButton from "../molecules/inner_sidebar_button";

export type InnerSidebarButtonData = {
  label: string;
  onClick: () => void;
};

type InnerSidebarProps = {
  buttons: Array<InnerSidebarButtonData>;
};

class InnerSidebar extends React.Component<InnerSidebarProps, Record<string, never>> {
  render() {
    const buttons = this.props.buttons;
    return (
      <div className={`flex flex-col w-56 border-r ${Colors.THEME_2.toString("border")} ${Colors.THEME_1.toString("bg")}`}>
        <div className="flex flex-col flex-grow p-4 overflow-auto">
          {buttons.map(function (button, index) {
            return (
              <InnerSidebarButton key={index} onClick={button.onClick}>
                {button.label}
              </InnerSidebarButton>
            );
          })}
        </div>
      </div>
    );
  }
}

export default InnerSidebar;
