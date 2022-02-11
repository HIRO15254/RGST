import React from "react";
import Pallet from "../../script/UI/pallet";
import Colors from "../../static/colors";

type DropDownItemProps = {
  color?: Pallet;
  hovercolor?: Pallet;
  className?: string;
  onClick?: () => void;
};

class DropDownItem extends React.Component<DropDownItemProps, Record<string, never>> {
  render() {
    const color = this.props.color ? this.props.color : Colors.THEME_1;
    const hovercolor = this.props.hovercolor ? this.props.hovercolor : Colors.THEME_2;
    return (
      <a className={`w-full px-4 py-2 text-left ${color ? color.toString("bg") : ""} ${hovercolor ? hovercolor.toString("bg", "hover") : ""}`} onClick={this.props.onClick}>
        {this.props.children}
      </a>
    );
  }
}

export default DropDownItem;
