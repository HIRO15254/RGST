import React from "react";
import Colors from "../../static/colors";
import Pallet from "../../script/UI/pallet";

type TableDataDropdownProps = {
  color?: Pallet;
  bgColor?: Pallet;
  onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value: string;
  dropdownItem: Array<string>;
};

class TableDataDropdown extends React.Component<TableDataDropdownProps, Record<string, never>> {
  render() {
    const color = this.props.color;
    const bgColor = this.props.bgColor;
    const value = this.props.value;
    const dropdownItem = this.props.dropdownItem;
    return (
      <td className={`px-2 py-2 border-b text-sm ${color ? color.toString("text") : ""} ${bgColor ? bgColor.toString("bg") : ""} ${Colors.THEME_2.toString("border")}`}>
        <select value={value} onChange={this.handleChange} className={`w-full px-2 py-1 rounded ${Colors.THEME_2.toString("bg")}`}>
          {dropdownItem.map((item, index) => {
            return (
              <option key={index} value={item}>
                {item}
              </option>
            );
          })}
        </select>
      </td>
    );
  }

  handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.props.onChange(e);
  };
}

export default TableDataDropdown;
