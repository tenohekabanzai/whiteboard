import { useState } from "react";
import Board from "./components/Board/Board";
import Toolbox from "./components/Toolbox/Toolbox";
import Toolbar from "./components/Toolbar/Toolbar";
import BoardProvider from "./components/store/BoardProvider";
import ToolboxProvider from "./components/store/ToolboxProvider";

function App() {
  return (
    <BoardProvider>
      <ToolboxProvider>
      <Toolbar />
      <Board />
      <Toolbox/>
      </ToolboxProvider>
    </BoardProvider>
  );
}

export default App;
