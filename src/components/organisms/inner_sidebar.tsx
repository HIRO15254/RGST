import Colors from "../../static/colors";
import React from "react";
import InnerSidebarButton from "../molecules/inner_sidebar_button";

type InnerSidebarProps = {
  className?: string;
};

class InnerSidebar extends React.Component<InnerSidebarProps, Record<string, never>> {
  render() {
    return (
      <div className={`flex flex-col w-56 border-r ${Colors.THEME_2.toString("border")}`}>
        <div className="flex flex-col flex-grow p-4 overflow-auto">
          <InnerSidebarButton>Item 1</InnerSidebarButton>
          <InnerSidebarButton>Item 2</InnerSidebarButton>
          <InnerSidebarButton>Item 3</InnerSidebarButton>
          <InnerSidebarButton>Item 4</InnerSidebarButton>
          <InnerSidebarButton>Item 5</InnerSidebarButton>
        </div>
      </div>
    );
  }
}

export default InnerSidebar;
