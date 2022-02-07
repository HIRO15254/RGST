import React from "react";

type TableHeaderProps = {
  width?: number;
};

class TableHeader extends React.Component<TableHeaderProps, Record<string, never>> {
  render() {
    return (
      <th scope="col" className={`px-5 py-3 border-b text-left text-sm font-normal ${this.props.width ? "w-" + this.props.width + "/12" : ""}`}>
        {this.props.children}
      </th>
    );
  }
}

export default TableHeader;
