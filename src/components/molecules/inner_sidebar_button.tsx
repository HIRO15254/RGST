import Colors from "../../static/colors";
import React from "react";
import Button from "../atoms/button";

type InnerSidebarButtonProps = {
  onClick: () => void;
};

class InnerSidebarButton extends React.Component<InnerSidebarButtonProps, Record<string, never>> {
  render() {
    const onClick = this.props.onClick;
    return (
      <Button className="justify-start px-4 text-sm font-medium" hovercolor={Colors.THEME_2} onClick={onClick}>
        {this.props.children}
      </Button>
    );
  }
}

export default InnerSidebarButton;
