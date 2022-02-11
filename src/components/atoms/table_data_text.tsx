import React from "react";
import Colors from "../../static/colors";
import Pallet from "../../script/UI/pallet";

type TableDataTextProps = {
  color?: Pallet;
  bgColor?: Pallet;
};

class TableDataText extends React.Component<TableDataTextProps, Record<string, never>> {
  render() {
    const color = this.props.color;
    const bgColor = this.props.bgColor;
    return (
      <td className={`px-5 py-2 border-b text-sm ${color ? color.toString("text") : ""} ${bgColor ? bgColor.toString("bg") : ""} ${Colors.THEME_2.toString("border")}`}>
        <p className="whitespace-no-wrap">{this.props.children}</p>
      </td>
    );
  }
}

export default TableDataText;
