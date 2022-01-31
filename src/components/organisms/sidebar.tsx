import React from "react";
import SidebarButton from "../molecules/sidebar_button";
import Logo from "../molecules/logo";
import Colors from "../../static/colors";

export type SidebarButtonData = {
  id: string;
  path: string;
  onClick: () => void;
};

type SidebarProps = {
  buttons: Array<SidebarButtonData>;
};

class Sidebar extends React.Component<SidebarProps, Record<string, never>> {
  render() {
    const buttons = this.props.buttons.map(function (button) {
      return <SidebarButton key={button.id} onClick={button.onClick} path={button.path} />;
    });
    return (
      <div className={`flex flex-col items-center w-16 pb-4 overflow-auto border-r ${Colors.THEME_2.toString("border")}`}>
        <Logo path="M12 5.69l5 4.5V18h-2v-6H9v6H7v-7.81l5-4.5M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z" />
        {buttons}
      </div>
    );
  }
}

export default Sidebar;
