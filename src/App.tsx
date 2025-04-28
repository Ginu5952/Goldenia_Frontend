import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Welcome from './components/WelcomeScreen'
import SignIn from './components/SignIn'
import SignUp from './components/SignUp'
import TopUp from './components/User/TopUp'
import SendTransfer from './components/User/SendTransfer'
import Exchange from './components/User/Exchange'
import TransactionHistory from './components/User/TransactionHistory'
import AdminDashboard from './components/Admin/AdminDashboard'
import AdminTransactions from './components/Admin/AdminTransactions'
import Home from './components/User/Home'

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
        <Route path="/admin/transactions/:userId" element={<AdminTransactions />} />
      </Routes>
    </Router>
  )
}

export default App
