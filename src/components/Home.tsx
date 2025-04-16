import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

export default function Home() {

  const [balance, setBalance] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await fetch("http://localhost:5000/user/profile", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })

        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
           
            localStorage.removeItem("token");  
            window.location.href = "/signin";    
            return; 
          }
          throw new Error("Failed to fetch balance");
        }

        const data = await res.json()
        setBalance(data.balance)
      } catch (err: any) {
        setError(err.message || "Something went wrong")
      } finally {
        setLoading(false)
      }
    }

    fetchBalance()
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Your Balance</h2>
          {loading ? (
            <p className="text-gray-500 mt-2">Loading...</p>
          ) : error ? (
            <p className="text-red-500 mt-2">{error}</p>
          ) : (
            <p className="text-3xl text-blue-600 mt-2">${balance?.toFixed(2)}</p>
          )}
        </div>

        {/* Actions Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/top-up"
            className="bg-white shadow rounded-xl p-6 hover:bg-blue-50 transition"
          >
            <h2 className="text-lg font-semibold text-blue-600 mb-2">Top Up</h2>
            <p className="text-sm text-gray-600">Add funds to your wallet.</p>
          </Link>

          <Link
            to="/send-transfer"
            className="bg-white shadow rounded-xl p-6 hover:bg-blue-50 transition"
          >
            <h2 className="text-lg font-semibold text-blue-600 mb-2">Send Transfer</h2>
            <p className="text-sm text-gray-600">Send money to another account.</p>
          </Link>

          <Link
            to="/exchange"
            className="bg-white shadow rounded-xl p-6 hover:bg-blue-50 transition"
          >
            <h2 className="text-lg font-semibold text-blue-600 mb-2">Exchange</h2>
            <p className="text-sm text-gray-600">Currency exchange service.</p>
          </Link>

          <Link
            to="/transactions"
            className="bg-white shadow rounded-xl p-6 hover:bg-blue-50 transition"
          >
            <h2 className="text-lg font-semibold text-blue-600 mb-2">Transaction History</h2>
            <p className="text-sm text-gray-600">View all your past activity.</p>
          </Link>

         
        </div>
      </div>
    </div>
  )
}
