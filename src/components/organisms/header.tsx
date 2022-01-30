import Colors from "../../static/colors";
import React from "react";
import HeaderButton from "../molecules/header_button";

export type HeaderButtonData = {
  id: string;
  label: string;
  onClick: () => void;
};

type HeaderProps = {
  className?: string;
  title: string;
  buttons: Array<HeaderButtonData>;
};

class Header extends React.Component<HeaderProps, Record<string, never>> {
  render() {
    const buttons = this.props.buttons.map(function (button, index) {
      if (index == 0) {
        return (
          <HeaderButton addClass="ml-auto" key={button.id} onClick={button.onClick}>
            {button.label}
          </HeaderButton>
        );
      } else {
        return (
          <HeaderButton addClass="ml-2" key={button.id} onClick={button.onClick}>
            {button.label}
          </HeaderButton>
        );
      }
    });
    return (
      <div className={`flex items-center flex-shrink-0 h-16 px-8 border-b ${Colors.THEME_2.toString("border")}`}>
        <h1 className="text-lg font-medium">{this.props.title}</h1>
        {buttons}
      </div>
    );
  }
}

export default Header;
