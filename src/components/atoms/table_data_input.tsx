import React from "react";
import Colors from "../../static/colors";
import Pallet from "../../script/UI/pallet";

type TableDataInputProps = {
  color?: Pallet;
  bgColor?: Pallet;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  inputType: string;
  value: string;
};

class TableDataInput extends React.Component<TableDataInputProps, Record<string, never>> {
  render() {
    const color = this.props.color;
    const bgColor = this.props.bgColor;
    const inputType = this.props.inputType;
    const value = this.props.value;
    return (
      <td className={`px-2 py-2 border-b text-sm ${color ? color.toString("text") : ""} ${bgColor ? bgColor.toString("bg") : ""} ${Colors.THEME_2.toString("border")}`}>
        <input type={inputType} className={`w-full px-2 py-1 rounded ${Colors.THEME_2.toString("bg")}`} value={value} onChange={this.handleChange} />
      </td>
    );
  }
  handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.props.onChange(e);
  };
}

export default TableDataInput;
