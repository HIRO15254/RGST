import React from "react";
import Colors from "../../static/colors";
import Header, { HeaderButtonData } from "../organisms/header";
import InnerSidebar, { InnerSidebarButtonData } from "../organisms/inner_sidebar";
import Sidebar, { SidebarButtonData } from "../organisms/sidebar";
import { HomeIcon } from "../../static/icons";
import { HeaderDropdownData } from "../molecules/header_dropdown";

type PageProps = {
  title: string;
  HeaderButtons: Array<HeaderButtonData>;
  HeaderDropDownButtons: Array<HeaderDropdownData>;
  InnerSidebarButtons: Array<InnerSidebarButtonData>;
};

class Page extends React.Component<PageProps, Record<string, never>> {
  render() {
    const sidebarButtons: Array<SidebarButtonData> = [
      {
        id: "home",
        path: HomeIcon,
        onClick: function () {
          console.log("ホームボタンが押されました");
        },
      },
    ];
    return (
      <div className={`flex w-screen h-screen ${Colors.THEME_2.toString("bg")} ${Colors.TEXT_2.toString("text")}`}>
        <Sidebar buttons={sidebarButtons} />
        <InnerSidebar buttons={this.props.InnerSidebarButtons} />
        <div className="flex flex-col flex-grow overflow-y-scroll">
          <Header title={this.props.title} buttons={this.props.HeaderButtons} dropdownitems={this.props.HeaderDropDownButtons} />
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Page;
