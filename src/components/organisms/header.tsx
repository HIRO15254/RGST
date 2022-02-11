import Colors from "../../static/colors";
import React from "react";
import HeaderButton from "../molecules/header_button";
import HeaderDropDown, { HeaderDropdownItemData } from "../molecules/header_dropdown";

export type HeaderButtonData = {
  label: string;
  onClick: () => void;
};

type HeaderProps = {
  title: string;
  buttons: Array<HeaderButtonData>;
  dropdownItems: Array<HeaderDropdownItemData>;
};

class Header extends React.Component<HeaderProps, Record<string, never>> {
  render() {
    const title = this.props.title;
    const buttons = this.props.buttons;
    const dropdownItems = this.props.dropdownItems;
    return (
      <div className={`flex items-center flex-shrink-0 h-16 px-8 border-b sticky top-0 z-50 ${Colors.THEME_2.toString("border")} ${Colors.THEME_1.toString("bg")}`}>
        <h1 className="text-lg font-medium">{title}</h1>
        {buttons.map(function (button, index) {
          return (
            <HeaderButton addClass={index == 0 ? "ml-auto" : "ml-2"} key={index} onClick={button.onClick}>
              {button.label}
            </HeaderButton>
          );
        })}
        <HeaderDropDown items={dropdownItems} />
      </div>
    );
  }
}

export default Header;
