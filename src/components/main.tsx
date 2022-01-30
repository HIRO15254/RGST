import React from "react";
import ResultPage from "./pages/result_page";

type MainProps = Record<string, never>;
class Main extends React.Component<MainProps, Record<string, never>> {
  render(): React.ReactNode {
    return (
      <div className="main">
        <ResultPage />
      </div>
    );
  }
}

export default Main;
