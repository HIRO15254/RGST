import React from "react";
import Page from "../templates/page";
import { HeaderButtonData } from "../organisms/header";
import { ContextBridgeApi } from "../../preload/preload";
import { InnerSidebarButtonData } from "../organisms/inner_sidebar";
import Table, { TableHeaderData } from "../organisms/table";

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
    const tableHeader: TableHeaderData = {
      date: { headerType: "text" },
      title: { headerType: "text", width: 4 },
      diff: { headerType: "text" },
      score: { headerType: "text" },
      edit: { headerType: "link" },
    };
    return (
      <Page title="Results" headerButtons={headerButtons} InnerSidebarButtons={innerSideButtons}>
        <Table headers={tableHeader} datas={this.state.tableData}></Table>
      </Page>
    );
  }
}

export default ResultPage;
