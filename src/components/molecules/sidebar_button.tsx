import React from "react";
import Button from "../atoms/button";
import Svg from "../atoms/svg";
import Colors from "../../static/colors";

type SidebarButtonProps = {
  path: string;
  onClick: () => void;
};

class SidebarButton extends React.Component<SidebarButtonProps, Record<string, never>> {
  render() {
    return (
      <Button className={`justify-center flex-shrink-0 w-10 h-10 mt-4`} hovercolor={Colors.THEME_2} onClick={this.props.onClick}>
        <Svg className={`h-6 w-6`} color={Colors.TEXT_2} path={this.props.path} />
      </Button>
    );
  }
}

export default SidebarButton;
