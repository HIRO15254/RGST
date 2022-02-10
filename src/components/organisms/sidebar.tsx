import React from "react";
import SidebarButton from "../molecules/sidebar_button";
import Logo from "../molecules/logo";
import Colors from "../../static/colors";
import Icons from "../../static/icons";

export type SidebarButtonData = {
  path: string;
  onClick: () => void;
};

type SidebarProps = {
  buttons: Array<SidebarButtonData>;
};

class Sidebar extends React.Component<SidebarProps, Record<string, never>> {
  render() {
    const buttons = this.props.buttons;
    return (
      <aside className={`flex flex-col items-center w-16 pb-4 overflow-auto border-r h-screen sticky top-0 ${Colors.THEME_2.toString("border")} ${Colors.THEME_1.toString("bg")}`}>
        <Logo path={Icons.HOME} />
        {buttons.map(function (button, index) {
          return <SidebarButton key={index} onClick={button.onClick} path={button.path} />;
        })}
      </aside>
    );
  }
}

export default Sidebar;
