import React from "react";
import Colors from "../../static/colors";
import { More } from "../../static/icons";
import Button from "../atoms/button";
import Svg from "../atoms/svg";
import DropDownItem from "./dropdown_item";

export type HeaderDropdownData = {
  label: string;
  onClick?: () => void;
};

type HeaderDropDownProps = {
  items: Array<HeaderDropdownData>;
};

class HeaderDropDown extends React.Component<HeaderDropDownProps, Record<string, never>> {
  render() {
    return (
      <button className="relative ml-2 text-sm focus:outline-none group">
        <Button hovercolor={Colors.THEME_2}>
          <Svg className="w-5 h-5 mx-auto" color={Colors.TEXT_2} path={More} />
        </Button>
        <div className="absolute right-0 flex-col items-start hidden w-40 mt-1 shadow-lg group-focus:flex">
          {this.props.items.map((item) => {
            return (
              <DropDownItem key={item.label} onClick={item.onClick}>
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
