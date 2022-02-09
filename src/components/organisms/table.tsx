import React from "react";
import Colors from "../../static/colors";
import TableData from "../molecules/table_data";
import TableHeader from "../molecules/table_header";
import TableRow from "../molecules/table_row";
import Pallet from "../../script/UI/pallet";

export type TableHeaderData = {
  [key: string]: {
    headerType: "main" | "text" | "link";
    width?: number;
  };
};

export type TableDataData = {
  [key: string]: {
    text: string;
    color?: Pallet;
    bgColor?: Pallet;
    onClick?: () => void;
  };
};

type TableProps = {
  headers: TableHeaderData;
  datas: Array<TableDataData>;
};

class Table extends React.Component<TableProps, Record<string, never>> {
  render() {
    const headers = this.props.headers;
    const datas = this.props.datas;
    return (
      <div className={`container mx-auto px-4 sm:px-8 ${Colors.TEXT_2.toString("text")}`}>
        <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
          <div className={`inline-block w-full shadow rounded-lg overflow-hidden ${Colors.THEME_1.toString("bg")}`}>
            <table className="min-w-full leading-normal">
              <thead>
                <tr>
                  {Object.keys(headers).map((header, index) => (
                    <TableHeader key={index} width={headers[header].width}>
                      {header}
                    </TableHeader>
                  ))}
                </tr>
              </thead>
              <tbody>
                {datas.map((data, index) => (
                  <TableRow key={index}>
                    {Object.keys(headers).map((header, index) => (
                      <TableData key={index} dataType={headers[header].headerType} onClick={data[header].onClick} color={data[header].color} bgColor={data[header].bgColor}>
                        {data[header].text}
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
