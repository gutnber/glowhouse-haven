import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Properties from "@/pages/Properties"
import AddProperty from "@/pages/AddProperty"
import NotFound from "@/pages/NotFound"
import "./App.css"
import "./styles/map.css"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Properties />} />
        <Route path="/properties/add" element={<AddProperty />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
