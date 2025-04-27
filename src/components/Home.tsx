import { useEffect, useState } from "react"
import api from '../api/axiosInstance';
import { Link } from "react-router-dom"

type Balance = {
  amount: number;
  currency: string;
  symbol: string;
};

type User = {
  id: number;
  username: string;
};

export default function Home() {

  const [balances, setBalances] = useState<Balance[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const response = await api.get("/user/profile"); 
        const data = response.data;
        setBalances(data.balances);
        setUser({ id: data.id, username: data.username });
      } catch (err: any) {
        if (err.response) {
          if (err.response.status === 401 || err.response.status === 403) {
            localStorage.removeItem("token");
            window.location.href = "/signin";
            return;
          }
          setError(err.response.data.message || "Failed to fetch balance");
        } else {
          setError(err.message || "Something went wrong");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, []);

   return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto relative">
        
        {/* Top Right Corner */}
        {user && (
          <div className="absolute top-0 right-0 p-4 text-gray-700 text-sm font-medium">
            Welcome, <span className="font-bold">{user.username}</span> (Acc No: {user.id})
          </div>
        )}

        <h1 className="text-3xl font-bold mb-6 text-gray-800">Dashboard</h1>

        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Your Balances</h2>

          {loading ? (
            <p className="text-gray-500 mt-2">Loading...</p>
          ) : error ? (
            <p className="text-red-500 mt-2">{error}</p>
          ) : (
            <div className="space-y-2 mt-4">
              {(balances.length === 0 ? [{ amount: 0, currency: "USD", symbol: "$" }] : balances).map((b) => (
                <div key={b.currency} className="text-2xl text-blue-600 font-medium">
                  {b.symbol} {b.amount.toFixed(2)}{" "}
                  <span className="text-sm text-gray-500">({b.currency})</span>
                </div>
              ))}
            </div>
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
