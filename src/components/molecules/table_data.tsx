import React from "react";
import Pallet from "../../script/UI/pallet";

type TableDataProps = {
  dataType?: "main" | "text" | "link";
  color?: Pallet;
  onClick?: () => void;
};

class TableData extends React.Component<TableDataProps, Record<string, never>> {
  render() {
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
        <a href="#" className="text-indigo-600 hover:text-indigo-900" onClick={this.props.onClick}>
          {this.props.children}
        </a>
      );
    }
    return <td className={`px-5 py-2 border-b text-sm ${this.props.color ? this.props.color.toString("text") : ""}`}>{content}</td>;
  }
}

export default TableData;
