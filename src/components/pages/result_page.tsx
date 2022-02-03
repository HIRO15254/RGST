import React from "react";
import Page from "../templates/page";
import { HeaderButtonData } from "../organisms/header";
import { ContextBridgeApi } from "../../preload/preload";
import { InnerSidebarButtonData } from "../organisms/inner_sidebar";

type ResultPageProps = Record<string, never>;

const api: ContextBridgeApi = window.api;

class ResultPage extends React.Component<ResultPageProps, Record<string, never>> {
  constructor(props: ResultPageProps) {
    super(props);
    this.uploadResult = this.uploadResult.bind(this);
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
          console.log("Arcaeaボタンがクリックされました");
        },
      },
    ];
    return <Page title="Results" headerButtons={headerButtons} InnerSidebarButtons={innerSideButtons} />;
  }

  uploadResult = async function () {
    await api.sendArcaeaResult();
  };
}

export default ResultPage;
