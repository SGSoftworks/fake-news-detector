import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Home from "./pages/Home";
import TextAnalysis from "./pages/TextAnalysis";
import ImageAnalysis from "./pages/ImageAnalysis";
import VideoAnalysis from "./pages/VideoAnalysis";
import AudioAnalysis from "./pages/AudioAnalysis";
import CodeAnalysis from "./pages/CodeAnalysis";
import AcademicAnalysis from "./pages/AcademicAnalysis";
import History from "./pages/History";
import Privacy from "./pages/Privacy";
import Security from "./pages/Security";
import About from "./pages/About";

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/text-analysis" element={<TextAnalysis />} />
          <Route path="/image-analysis" element={<ImageAnalysis />} />
          <Route path="/video-analysis" element={<VideoAnalysis />} />
          <Route path="/audio-analysis" element={<AudioAnalysis />} />
          <Route path="/code-analysis" element={<CodeAnalysis />} />
          <Route path="/academic-analysis" element={<AcademicAnalysis />} />
          <Route path="/history" element={<History />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/security" element={<Security />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
