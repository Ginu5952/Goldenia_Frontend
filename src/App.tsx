import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Welcome from './components/WelcomeScreen'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import TopUp from './components/TopUp'
import SendTransfer from './components/SendTransfer'
import Exchange from './components/Exchange'
import TransactionHistory from './components/TransactionHistory'
import AdminDashboard from './components/AdminDashboard'
import Home from './components/Home'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/top-up" element={<TopUp />} />
        <Route path="/send-transfer" element={<SendTransfer />} />
        <Route path="/exchange" element={<Exchange />} />
        <Route path="/transactions" element={<TransactionHistory />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
