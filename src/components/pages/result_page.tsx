import React from "react";
import Page from "../templates/page";
import { HeaderButtonData } from "../organisms/header";
import { ContextBridgeApi } from "../../preload/preload";
import { InnerSidebarButtonData } from "../organisms/inner_sidebar";
import Table, { TableHeaderData, TableDataData } from "../organisms/table";
import { HeaderDropdownData } from "../molecules/header_dropdown";
import Colors from "../../static/colors";

type ResultPageProps = Record<string, never>;

type ResultPageStates = {
  tableData: TableDataData[];
};

const api: ContextBridgeApi = window.api;

class ResultPage extends React.Component<ResultPageProps, ResultPageStates> {
  constructor(props: ResultPageProps) {
    super(props);
    this.uploadResult = this.uploadResult.bind(this);
    this.switchTheme = this.switchTheme.bind(this);
    this.state = { tableData: [] };
    if (localStorage.theme == "dark") {
      document.documentElement.classList.add("dark");
    }
    api.getArcaeaResult().then((value) => {
      this.setState({ tableData: this.convertData(value) });
    });
  }

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
          console.log("");
        },
      },
    ];
    const headerDropDownButtons: Array<HeaderDropdownData> = [
      {
        label: "ダークモード切り替え",
        onClick: this.switchTheme,
      },
      {
        label: "リザルト解析の再設定",
        onClick: function () {
          api.ArcaeaReInitialize();
        },
      },
    ];
    const tableHeader: TableHeaderData = {
      date: { headerType: "text" },
      title: { headerType: "text", width: 4 },
      diff: { headerType: "text" },
      score: { headerType: "text" },
      edit: { headerType: "link" },
      delete: { headerType: "link" },
    };
    return (
      <Page title="Results" HeaderButtons={headerButtons} InnerSidebarButtons={innerSideButtons} HeaderDropDownButtons={headerDropDownButtons}>
        <Table headers={tableHeader} datas={this.state.tableData}></Table>
      </Page>
    );
  }

  convertData = function (data: Array<{ [key: string]: string }>): Array<TableDataData> {
    return data.map((data) => {
      return {
        date: { text: data.date },
        title: { text: data.title },
        diff: { text: data.diff },
        score: { text: data.score },
        edit: { text: "edit", color: Colors.LINK_NOAMAL },
        delete: { text: "delete", color: Colors.WARN_NOAMAL },
      };
    });
  };

  uploadResult = async function () {
    await api.sendArcaeaResult();
    api.getArcaeaResult().then((value) => {
      this.setState({ tableData: value });
    });
  };

  switchTheme = function () {
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
  };
}

export default ResultPage;
