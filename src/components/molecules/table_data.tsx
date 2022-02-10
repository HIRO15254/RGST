import React from "react";
import Colors from "../../static/colors";
import Pallet from "../../script/UI/pallet";

type TableDataProps = {
  index: number;
  dataType?: "main" | "text" | "link";
  color?: Pallet;
  bgColor?: Pallet;
  onClick?: (index: number) => void;
};

class TableData extends React.Component<TableDataProps, Record<string, never>> {
  render() {
    const color = this.props.color;
    const bgColor = this.props.bgColor;
    let content: JSX.Element;
    if (this.props.dataType == "text" || this.props.dataType == undefined) {
      content = <p className="whitespace-no-wrap">{this.props.children}</p>;
    } else if (this.props.dataType == "main") {
      content = (
        <div className="flex items-center ml-3">
          <p className="whitespace-no-wrap">{this.props.children}</p>
        </div>
      );
    } else if (this.props.dataType == "link") {
      content = (
        <a onClick={this.onClick} className="hover:underline cursor-pointer">
          {this.props.children}
        </a>
      );
    }
    return <td className={`px-5 py-2 border-b text-sm ${color ? color.toString("text") : ""} ${bgColor ? bgColor.toString("bg") : ""} ${Colors.THEME_2.toString("border")}`}>{content}</td>;
  }

  onClick = () => {
    this.props.onClick(this.props.index);
  };
}

export default TableData;
