import Colors from "../../static/colors";
import React from "react";
import Button from "../atoms/button";

type InnerSidebarButtonProps = {
  icon?: JSX.Element;
  onClick: () => void;
};

class InnerSidebarButton extends React.Component<InnerSidebarButtonProps, Record<string, never>> {
  render() {
    return (
      <Button className="justify-start px-4 text-sm font-medium" hovercolor={Colors.THEME_2} onClick={this.props.onClick}>
        {this.props.children}
      </Button>
    );
  }
}

export default InnerSidebarButton;
