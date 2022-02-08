import React from "react";
import Page from "../templates/page";
import { HeaderButtonData } from "../organisms/header";
import { ContextBridgeApi } from "../../preload/preload";
import { InnerSidebarButtonData } from "../organisms/inner_sidebar";
import Table, { TableHeaderData } from "../organisms/table";
import { HeaderDropdownData } from "../molecules/header_dropdown";

type ResultPageProps = Record<string, never>;

type ResultPageStates = {
  tableData: { [key: string]: string }[];
};

const api: ContextBridgeApi = window.api;

class ResultPage extends React.Component<ResultPageProps, ResultPageStates> {
  constructor(props: ResultPageProps) {
    super(props);
    this.uploadResult = this.uploadResult.bind(this);
    this.state = { tableData: [] };
    api.GetArcaeaResult().then((value) => {
      this.setState({ tableData: value });
    });
    if (localStorage.theme == "dark") {
      document.documentElement.classList.add("dark");
    }
  }

  uploadResult = async function () {
    await api.sendArcaeaResult();
    api.GetArcaeaResult().then((value) => {
      this.setState({ tableData: value });
    });
  };

  render() {
    const headerButtons: Array<HeaderButtonData> = [
      {
        id: "upload",
        label: "upload",
        onClick: this.uploadResult,
      },
    ];
    const innerSideButtons: Array<InnerSidebarButtonData> = [
      {
        id: "arcaea",
        label: "arcaea",
        onClick: function () {
          console.log("Arcaeaボタンがクリックされました");
        },
      },
    ];
    const headerDropDownButtons: Array<HeaderDropdownData> = [
      {
        label: "ダークモード切り替え",
        onClick: function () {
          // htmlタグにdarkクラスが含まれているかどうか
          if (document.documentElement.classList.contains("dark")) {
            // darkクラスが含まれているならライトモードに変更
            document.documentElement.classList.remove("dark");
            localStorage.theme = "light";
          } else {
            // darkクラスが含まれていないならダークモードに変更
            document.documentElement.classList.add("dark");
            localStorage.theme = "dark";
          }
        },
      },
    ];
    const tableHeader: TableHeaderData = {
      date: { headerType: "text" },
      title: { headerType: "text", width: 4 },
      diff: { headerType: "text" },
      score: { headerType: "text" },
      edit: { headerType: "link" },
    };
    return (
      <Page title="Results" HeaderButtons={headerButtons} InnerSidebarButtons={innerSideButtons} HeaderDropDownButtons={headerDropDownButtons}>
        <Table headers={tableHeader} datas={this.state.tableData}></Table>
      </Page>
    );
  }
}

export default ResultPage;
