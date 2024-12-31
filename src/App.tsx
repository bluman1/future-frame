import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Questionnaire from "./pages/Questionnaire";

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/questionnaire" element={<Questionnaire />} />
          </Routes>
        </div>
        <footer className="py-4 text-center text-sm text-gray-600">
          for you, by{" "}
          <a
            href="https://x.com/_bluman"
            target="_blank"
            rel="noopener noreferrer"
            className="text-purple-600 hover:text-purple-800 transition-colors underline"
          >
            Michael
          </a>
        </footer>
      </div>
    </Router>
  );
}

export default App;