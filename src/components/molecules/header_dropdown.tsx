import React from "react";
import Colors from "../../static/colors";
import Button from "../atoms/button";
import Svg from "../atoms/svg";
import DropDownItem from "./dropdown_item";
import Icons from "../../static/icons";

export type HeaderDropdownItemData = {
  label: string;
  onClick?: () => void;
};

type HeaderDropDownProps = {
  items: Array<HeaderDropdownItemData>;
};

class HeaderDropDown extends React.Component<HeaderDropDownProps, Record<string, never>> {
  render() {
    const items = this.props.items;
    return (
      <button className="relative ml-2 text-sm focus:outline-none group">
        <Button hovercolor={Colors.THEME_2}>
          <Svg className="w-5 h-5 mx-auto" color={Colors.TEXT_2} path={Icons.MORE} />
        </Button>
        <div className="absolute right-0 flex-col items-start hidden w-40 mt-1 shadow-lg group-focus:flex">
          {items.map((item, index) => {
            return (
              <DropDownItem key={index} onClick={item.onClick}>
                {item.label}
              </DropDownItem>
            );
          })}
        </div>
      </button>
    );
  }
}

export default HeaderDropDown;
