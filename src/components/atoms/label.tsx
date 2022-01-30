import Pallet from "../../script/UI/pallet";
import React from "react";

type LabelProps = {
  className?: string;
  color?: Pallet;
};

class Label extends React.Component<LabelProps, Record<string, never>> {
  render() {
    const classname = this.props.className;
    return <span className={`leading-none ${classname} ${this.props.color ? this.props.color.toString("text") : ""}`}>{this.props.children}</span>;
  }
}

export default Label;
