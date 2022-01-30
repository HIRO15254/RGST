import React from "react";
import Colors from "../../static/colors";
import Header, { HeaderButtonData } from "../organisms/header";
import InnerSidebar from "../organisms/inner_sidebar";
import Sidebar from "../organisms/sidebar";

type PageProps = {
  title: string;
  headerButtons: Array<HeaderButtonData>;
};

class Page extends React.Component<PageProps, Record<string, never>> {
  render() {
    return (
      <div className={`flex w-screen h-screen ${Colors.THEME_1.toString("bg")} ${Colors.TEXT_2.toString("text")}`}>
        <Sidebar />
        <InnerSidebar />
        <div className="flex flex-col flex-grow">
          <Header title={this.props.title} buttons={this.props.headerButtons} />
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default Page;
