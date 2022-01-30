import Pallet from "../../script/UI/pallet";
import React from "react";

type SvgProps = {
  className?: string;
  color?: Pallet;
  strokewidth?: number;
  path: string;
};

class Svg extends React.Component<SvgProps, Record<string, never>> {
  render() {
    const classname = this.props.className;
    const color = this.props.color;
    return (
      <svg className={`${classname ? classname : ""} ${color ? color.toString("text") : ""}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentcolor">
        <path d={this.props.path} strokeWidth={this.props.strokewidth} />
      </svg>
    );
  }
}

export default Svg;
