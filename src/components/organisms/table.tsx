import React from "react";
import Colors from "../../static/colors";
import TableData from "../molecules/table_data";
import TableHeader from "../molecules/table_header";
import TableRow from "../molecules/table_row";

export type TableHeaderData = {
  [key: string]: {
    headerType: "main" | "text" | "link";
    width?: number;
    onClick?: () => void;
  };
};

type TableProps = {
  headers: TableHeaderData;
  datas: { [key: string]: string }[];
};

class Table extends React.Component<TableProps, Record<string, never>> {
  render() {
    console.log(this.props.datas);
    return (
      <div className={`container mx-auto px-4 sm:px-8 ${Colors.TEXT_1.toString("text")} ${Colors.THEME_2.toString("border")}`}>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className={`inline-block w-full shadow rounded-lg overflow-hidden ${Colors.THEME_1.toString("bg")}`}>
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  {Object.keys(this.props.headers).map((header, index) => (
                    <TableHeader key={index} width={this.props.headers[header].width}>
                      {header}
                    </TableHeader>
                  ))}
                </tr>
              </thead>
              <tbody>
                {this.props.datas.map((data, index) => (
                  <TableRow key={index}>
                    {Object.keys(this.props.headers).map((header, index) => (
                      <TableData key={index} dataType={this.props.headers[header].headerType} onClick={this.props.headers[header].onClick}>
                        {data[header] != undefined ? data[header] : header}
                      </TableData>
                    ))}
                  </TableRow>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

export default Table;
