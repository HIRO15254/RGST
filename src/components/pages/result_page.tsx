import React from "react";
import Page from "../templates/page";
import { HeaderButtonData } from "../organisms/header";
import { ContextBridgeApi } from "../../preload/preload";
import { InnerSidebarButtonData } from "../organisms/inner_sidebar";
import Table, { TableHeaderData, TableDataData } from "../organisms/table";
import { HeaderDropdownItemData } from "../molecules/header_dropdown";
import Colors from "../../static/colors";
import { ArcaeaResultType } from "../../script/arcaea/arcaea_result";

type ResultPageProps = Record<string, never>;

type ResultPageStates = {
  results: ArcaeaResultType[];
};

const api: ContextBridgeApi = window.api;

class ResultPage extends React.Component<ResultPageProps, ResultPageStates> {
  constructor(props: ResultPageProps) {
    super(props);
    this.state = { results: [] };
    if (localStorage.theme == "dark") {
      document.documentElement.classList.add("dark");
    }
    this.reloadResult();
  }

  render() {
    const headerButtons: Array<HeaderButtonData> = [
      {
        label: "upload",
        onClick: this.uploadResult,
      },
    ];
    const innerSideButtons: Array<InnerSidebarButtonData> = [
      {
        label: "arcaea",
        onClick: function () {
          return;
        },
      },
    ];
    const headerDropDownButtons: Array<HeaderDropdownItemData> = [
      {
        label: "ダークモード切り替え",
        onClick: this.switchTheme,
      },
      {
        label: "リザルト解析の再設定",
        onClick: function () {
          api.reinitializeArcaeaSettings();
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
      <Page title="Results" headerButtons={headerButtons} innerSidebarButtons={innerSideButtons} headerDropdownItems={headerDropDownButtons}>
        <Table headers={tableHeader} datas={this.convertData(this.state.results)}></Table>
      </Page>
    );
  }

  convertData = (data: Array<ArcaeaResultType>): Array<TableDataData> => {
    return data.map((datum) => {
      return {
        date: { text: datum.date },
        title: { text: datum.title },
        diff: { text: datum.diff },
        score: { text: datum.score.toString() },
        edit: { text: "edit", color: Colors.LINK_NOAMAL },
        delete: { text: "delete", color: Colors.WARN_NOAMAL, onClick: this.deleteResult },
      };
    });
  };

  uploadResult = async () => {
    await api.uploadArcaeaResult();
    this.reloadResult();
  };

  reloadResult = () => {
    api.getArcaeaResult().then((value) => {
      this.setState({ results: value });
    });
  };

  switchTheme = () => {
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

  deleteResult = async (index: number) => {
    const _results = this.state.results;
    _results.splice(index, 1);
    await api.setArcaeaResult(_results);
    this.reloadResult();
  };
}

export default ResultPage;
