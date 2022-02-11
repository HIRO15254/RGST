import React from "react";
import Colors from "../../static/colors";
import TableHeader from "../molecules/table_header";
import TableRow from "../molecules/table_row";
import Pallet from "../../script/UI/pallet";
import TableDataText from "../atoms/table_data_text";
import TableDataLink from "../atoms/table_data_link";
import TableDataInput from "../atoms/table_data_input";
import TableDataDropdown from "../atoms/table_data_dropdown";

export type TableHeaderData = {
  [key: string]: {
    dataType?: "text" | "link" | "input" | "dropdown";
    width?: number;
  };
};

export type TableDataData = {
  [key: string]: {
    text: string;
    index?: number;
    dataType?: "text" | "link" | "input" | "dropdown";
    inputType?: string;
    dropdownItem?: Array<string>;
    color?: Pallet;
    bgColor?: Pallet;
    onClick?: (index: number) => void;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => void;
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
            <table className="min-w-full leading-normal table-fixed">
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
                    {Object.keys(headers).map((header, index_2) => {
                      const dataType = data[header].dataType ? data[header].dataType : headers[header].dataType;
                      const datum = data[header];
                      if (dataType == "text" || !dataType) {
                        return (
                          <TableDataText key={index_2} color={datum.color} bgColor={datum.bgColor}>
                            {datum.text}
                          </TableDataText>
                        );
                      } else if (dataType == "link") {
                        return (
                          <TableDataLink key={index_2} index={index} color={datum.color} bgColor={datum.bgColor} onClick={datum.onClick}>
                            {datum.text}
                          </TableDataLink>
                        );
                      } else if (dataType == "input") {
                        return <TableDataInput key={index_2} inputType={datum.inputType} color={datum.color} bgColor={datum.bgColor} value={datum.text} onChange={datum.onChange} />;
                      } else if (dataType == "dropdown") {
                        return <TableDataDropdown key={index_2} color={datum.color} bgColor={datum.bgColor} value={datum.text} onChange={datum.onChange} dropdownItem={datum.dropdownItem} />;
                      }
                    })}
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
