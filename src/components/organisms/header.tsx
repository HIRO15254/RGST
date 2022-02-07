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
      return (
        <HeaderButton addClass={index == 0 ? "ml-auto" : "ml-2"} key={button.id} onClick={button.onClick}>
          {button.label}
        </HeaderButton>
      );
    });
    return (
      <div className={`flex items-center flex-shrink-0 h-16 px-8 border-b sticky top-0 z-50 ${Colors.THEME_2.toString("border")} ${Colors.THEME_1.toString("bg")}`}>
        <h1 className="text-lg font-medium">{this.props.title}</h1>
        {buttons}
      </div>
    );
  }
}

export default Header;
