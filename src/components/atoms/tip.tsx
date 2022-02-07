import React from "react";

type TipProps = {
  color?: "gray" | "red" | "yellow" | "green" | "blue" | "indigo" | "purple";
};

class Tip extends React.Component<TipProps, Record<string, never>> {
  render() {
    const color: "gray" | "red" | "yellow" | "green" | "blue" | "indigo" | "purple" = this.props.color;
    return (
      <span className={`relative inline-block px-3 py-1 font-semibold text-${color}-900 leading-tight`}>
        <span aria-hidden="true" className={`absolute inset-0 bg-${color}-200 opacity-50 rounded-full`}></span>
        <span className="relative">{this.props.children}</span>
      </span>
    );
  }
}

export default Tip;
