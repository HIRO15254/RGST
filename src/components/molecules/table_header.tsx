import React from "react";
import Colors from "../../static/colors";

type TableHeaderProps = {
  width?: number;
};

class TableHeader extends React.Component<TableHeaderProps, Record<string, never>> {
  render() {
    return (
      <th scope="col" className={`px-5 py-3 border-b text-left text-base font-normal ${this.props.width ? "w-" + this.props.width + "/12" : ""} ${Colors.TEXT_1.toString("border")}`}>
        {this.props.children}
      </th>
    );
  }
}

export default TableHeader;
