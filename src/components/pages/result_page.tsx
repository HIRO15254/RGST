import React from "react";
import Page from "../templates/page";
import { HeaderButtonData } from "../organisms/header";
import { ContextBridgeApi } from "../../preload/preload";
import { InnerSidebarButtonData } from "../organisms/inner_sidebar";
import Table, { TableHeaderData, TableDataData } from "../organisms/table";
import { HeaderDropdownItemData } from "../molecules/header_dropdown";
import Colors from "../../static/colors";
import { ArcaeaResultType } from "../../script/arcaea/arcaea_result";
import { ArcaeaDataType } from "../../script/arcaea/arcaea_data";

type ResultPageProps = Record<string, never>;

type ResultPageStates = {
  results: ArcaeaResultType[];
  songData: Array<ArcaeaDataType>;
  edit: number;

  editingDate: string;
  editingTitle: string;
  editingDiff: string;
  editingScore: string;
};

const api: ContextBridgeApi = window.api;

class ResultPage extends React.Component<ResultPageProps, ResultPageStates> {
  constructor(props: ResultPageProps) {
    super(props);
    this.state = {
      results: [],
      edit: -1,
      songData: [],
      editingDate: "",
      editingTitle: "",
      editingScore: "",
      editingDiff: "",
    };
    if (localStorage.theme == "dark") {
      document.documentElement.classList.add("dark");
    }
    this.reloadResult();
    this.reloadSongData();
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
      date: { width: 2 },
      title: { width: 4 },
      diff: { width: 1 },
      score: { width: 1 },
      level: { width: 1 },
      edit: { dataType: "link", width: 1 },
      delete: { dataType: "link", width: 1 },
    };
    return (
      <Page title="Results" headerButtons={headerButtons} innerSidebarButtons={innerSideButtons} headerDropdownItems={headerDropDownButtons}>
        <Table headers={tableHeader} datas={this.convertData(this.state.results)}></Table>
      </Page>
    );
  }

  convertData = (data: Array<ArcaeaResultType>): Array<TableDataData> => {
    return data.map((datum, index) => {
      if (this.state.edit == index) {
        return {
          date: { text: this.state.editingDate, dataType: "input", inputType: "datetime-local", onChange: this.onChangeDate },
          title: { text: this.state.editingTitle, dataType: "dropdown", dropdownItem: this.titles(), onChange: this.onChangeTitle },
          diff: { text: this.state.editingDiff, dataType: "dropdown", dropdownItem: this.diffs(this.state.editingTitle), onChange: this.onChangeDiff },
          score: { text: this.state.editingScore, dataType: "input", inputType: "number", onChange: this.onChangeScore },
          level: { text: this.level(this.state.editingTitle, this.state.editingDiff) },
          edit: { text: "update", color: Colors.LINK_NOAMAL, onClick: this.endEdit },
          delete: { text: "delete", color: Colors.WARN_NOAMAL, onClick: this.deleteResult },
        };
      } else {
        return {
          date: { text: datum.date.slice(0, datum.date.length - 3) },
          title: { text: datum.title },
          diff: { text: datum.diff },
          score: { text: datum.score.toString() },
          level: { text: this.level(datum.title, datum.diff) },
          edit: { text: "edit", color: Colors.LINK_NOAMAL, onClick: this.startEdit },
          delete: { text: "delete", color: Colors.WARN_NOAMAL, onClick: this.deleteResult },
        };
      }
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

  reloadSongData = () => {
    api.getArcaeaData().then((value) => {
      this.setState({ songData: value });
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

  titles = () => {
    const ret = this.state.songData.map((data) => data.title);
    ret.sort();
    return ret;
  };

  diffs = (title: string) => {
    const song = this.state.songData.find((data) => data.title == title);
    if (!song) return [];
    return ["past", "present", "future", "beyond"].slice(0, song.const.beyond ? 4 : 3);
  };

  level = (title: string, diff: string) => {
    const song = this.state.songData.find((data) => data.title == title);
    if (!song) return "";
    return `${song.level[diff as "past" | "present" | "future" | "beyond"]} (${song.const[diff as "past" | "present" | "future" | "beyond"]})`;
  };

  dateToInputval = (date: string) => {
    return date.slice(0, date.length - 3).replace(" ", "T");
  };

  inputvalTodate = (inputval: string) => {
    return (inputval + ":00").replace("T", " ");
  };

  startEdit = (index: number) => {
    this.setState({
      edit: index,
      editingDate: this.dateToInputval(this.state.results[index].date),
      editingTitle: this.state.results[index].title,
      editingDiff: this.state.results[index].diff,
      editingScore: this.state.results[index].score.toString(),
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  endEdit = (_: number) => {
    this.setState({ edit: -1 });
  };

  onChangeDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ editingDate: e.target.value });
    const _results = this.state.results;
    _results[this.state.edit].date = this.inputvalTodate(e.target.value);
    api.setArcaeaResult(_results);
    this.reloadResult();
  };

  onChangeTitle = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ editingTitle: e.target.value });
    const _results = this.state.results;
    _results[this.state.edit].title = e.target.value;
    api.setArcaeaResult(_results);
    this.reloadResult();
  };

  onChangeDiff = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.setState({ editingDiff: e.target.value });
    const _results = this.state.results;
    _results[this.state.edit].diff = e.target.value as "past" | "present" | "future" | "beyond";
    api.setArcaeaResult(_results);
    this.reloadResult();
  };

  onChangeScore = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ editingScore: e.target.value });
    const _results = this.state.results;
    _results[this.state.edit].score = parseInt(e.target.value);
    api.setArcaeaResult(_results);
    this.reloadResult();
  };
}

export default ResultPage;
