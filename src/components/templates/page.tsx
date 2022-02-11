import React from "react";
import Colors from "../../static/colors";
import Header, { HeaderButtonData } from "../organisms/header";
import InnerSidebar, { InnerSidebarButtonData } from "../organisms/inner_sidebar";
import Sidebar, { SidebarButtonData } from "../organisms/sidebar";
import { HeaderDropdownItemData } from "../molecules/header_dropdown";
import Icons from "../../static/icons";

type PageProps = {
  title: string;
  headerButtons: Array<HeaderButtonData>;
  headerDropdownItems: Array<HeaderDropdownItemData>;
  innerSidebarButtons: Array<InnerSidebarButtonData>;
};

class Page extends React.Component<PageProps, Record<string, never>> {
  render() {
    const title = this.props.title;
    const headerButtons = this.props.headerButtons;
    const headerDropdownItems = this.props.headerDropdownItems;
    const InnerSidebarButtons = this.props.innerSidebarButtons;
    const sidebarButtons: Array<SidebarButtonData> = [
      {
        path: Icons.HOME,
        onClick: function () {
          console.log("ホームボタンが押されました");
        },
      },
    ];
    return (
      <div className={`flex w-screen h-screen ${Colors.THEME_2.toString("bg")} ${Colors.TEXT_2.toString("text")}`}>
        <Sidebar buttons={sidebarButtons} />
        <InnerSidebar buttons={InnerSidebarButtons} />
        <div className="flex flex-col flex-grow overflow-y-scroll">
          <Header title={title} buttons={headerButtons} dropdownItems={headerDropdownItems} />
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Page;
