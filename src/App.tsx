import SplitPane from "react-split-pane";
import TreeView from "./components/TreeView";
import "./app.css";
import Editor from "./components/Editor";
import { AppState } from "./state";
import PropertiesViewer from "./components/PropertiesViewer";

function App() {
  return (
    <AppState.Provider>
      <div className="App">
        <SplitPane split="horizontal" defaultSize={50} allowResize={false}>
          <header className="AppHeader clearfix">
            <h2 id="title">TEST</h2>
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
