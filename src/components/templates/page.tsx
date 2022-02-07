import React from "react";
import Colors from "../../static/colors";
import Header, { HeaderButtonData } from "../organisms/header";
import InnerSidebar, { InnerSidebarButtonData } from "../organisms/inner_sidebar";
import Sidebar, { SidebarButtonData } from "../organisms/sidebar";
import HomeIcon from "../../static/homeicon";

type PageProps = {
  title: string;
  headerButtons: Array<HeaderButtonData>;
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
          <Header title={this.props.title} buttons={this.props.headerButtons} />
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Page;
