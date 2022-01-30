import Colors from "../../static/colors";
import React from "react";
import Button from "../atoms/button";
import Label from "../atoms/label";

type HeaderButtonProps = {
  addClass?: string;
  icon?: JSX.Element;
  onClick?: () => void;
};

class HeaderButton extends React.Component<HeaderButtonProps, Record<string, never>> {
  render() {
    return (
      <Button className={`flex-shrink-0 text-sm px-4 font-medium ${this.props.addClass}`} hovercolor={Colors.THEME_2} color={Colors.THEME_2} onClick={this.props.onClick}>
        <Label color={Colors.TEXT_2}>{this.props.children}</Label>
        {this.props.icon}
      </Button>
    );
  }
}

export default HeaderButton;
