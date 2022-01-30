import React from "react";
import Page from "../templates/page";
import { HeaderButtonData } from "../organisms/header";
import { ContextBridgeApi } from "../../preload/preload";

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
    return <Page title="Results" headerButtons={headerButtons} />;
  }

  uploadResult = async function () {
    const file = await api.sendOpenFile();
  };
}

export default ResultPage;
