import React from "react";

type TableRowProps = Record<string, unknown>;

class TableRow extends React.Component<TableRowProps, Record<string, never>> {
  render() {
    return <tr>{this.props.children}</tr>;
  }
}

export default TableRow;
