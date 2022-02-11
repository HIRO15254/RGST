import React from "react";
import Colors from "../../static/colors";
import Pallet from "../../script/UI/pallet";

type TableDataLinkProps = {
  color?: Pallet;
  bgColor?: Pallet;
  onClick?: (index: number) => void;
  index: number;
};

class TableDataLink extends React.Component<TableDataLinkProps, Record<string, never>> {
  render() {
    const color = this.props.color;
    const bgColor = this.props.bgColor;
    return (
      <td className={`px-5 py-2 border-b text-sm ${color ? color.toString("text") : ""} ${bgColor ? bgColor.toString("bg") : ""} ${Colors.THEME_2.toString("border")}`}>
        <a onClick={this.onClick} className="hover:underline cursor-pointer">
          {this.props.children}
        </a>
      </td>
    );
  }

  onClick = () => {
    this.props.onClick(this.props.index);
  };
}

export default TableDataLink;
