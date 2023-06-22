import NavBar from "./components/NavBar";
import "./style/App.css";
import { BrowserRouter as Router } from "react-router-dom";

function App() {
  return (
    <div className="global">
      <div className="global_inner">
        <Router>
          <NavBar />
        </Router>
      </div>
    </div>
  );
}

export default App;
