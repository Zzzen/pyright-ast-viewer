import SplitPane from "react-split-pane";
import TreeView from "./components/TreeView";
import "./app.css";
import "./treeview.css";
import Editor from "./components/Editor";
import { AppState } from "./state";
import PropertiesViewer from "./components/PropertiesViewer";

function App() {
  return (
    <AppState.Provider>
      <div className="App">
        <SplitPane split="horizontal" defaultSize={50} allowResize={false}>
          <header className="AppHeader">
            <h2 id="title">Pyright AST Viewer</h2>
            <a
              target="_blank"
              href="https://github.com/Zzzen/pyright-ast-viewer"
            >
              github
            </a>
          </header>
          <SplitPane split="vertical" minSize={50} defaultSize="33%">
            <Editor></Editor>
            <SplitPane split="vertical" minSize={50} defaultSize="50%">
              <TreeView />
              <PropertiesViewer />
            </SplitPane>
          </SplitPane>
        </SplitPane>
      </div>
    </AppState.Provider>
  );
}

export default App;
