import React from "react";
import Pallet from "../../script/UI/pallet";

type ButtonProps = {
  color?: Pallet;
  hovercolor?: Pallet;
  className?: string;
  onClick?: () => void;
};

class Button extends React.Component<ButtonProps, Record<string, never>> {
  render() {
    const color = this.props.color;
    const hovercolor = this.props.hovercolor;
    const classname = this.props.className;
    return (
      <a className={`flex items-center rounded cursor-pointer h-10 px-2 ${classname ? classname : ""} ${color ? color.toString("bg") : ""} ${hovercolor ? hovercolor.toString("bg", "hover") : ""}`} onClick={this.props.onClick}>
        {this.props.children}
      </a>
    );
  }
}

export default Button;
