import * as React from "react";
import * as ReactDOM from "react-dom";

function render() {
  ReactDOM.render(
    <div>
      <h1>v1.0.0</h1>
      <h2 className="text-red-700">Hello from React!</h2>
    </div>,
    document.getElementById("root")
  );
}

render();
