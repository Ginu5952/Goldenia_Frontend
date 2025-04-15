
import { useEffect, useState } from "react"

interface Transaction {
  id: number
  type: string
  amount: number
  currency: string
  timestamp: string
  target_user_id?: number
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("http://localhost:5000/user/transactions", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
        if (!res.ok) throw new Error("Failed to fetch transactions")
        const data = await res.json()
        console.log("Token:", localStorage.getItem("token"));
        setTransactions(data.transactions)
        console.log(data); 
        if (data && data.transactions) {
          setTransactions(data.transactions);
        } else {
          setError("No transactions found or unexpected response format.");
        }
      } catch (err: any) {
        setError("Error loading transactions.")
      } finally {
        setLoading(false)
      }
    }

    fetchTransactions()
  }, [])

  return (
    <div className=" pt-32">
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-semibold mb-4">Transaction History</h1>
      {loading ? (
        <div className="text-gray-500">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : transactions.length === 0 ? (
        <div className="text-gray-500">No transactions found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-700">
                <th className="px-4 py-2 border-b">ID</th>
                <th className="px-4 py-2 border-b">Type</th>
                <th className="px-4 py-2 border-b">Amount</th>
                <th className="px-4 py-2 border-b">Currency</th>
                <th className="px-4 py-2 border-b">To</th>
                <th className="px-4 py-2 border-b">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border-b">{txn.id}</td>
                  <td className="px-4 py-2 border-b capitalize">{txn.type}</td>
                  <td className="px-4 py-2 border-b">{txn.amount.toFixed(2)}</td>
                  <td className="px-4 py-2 border-b">{txn.currency}</td>
                  <td className="px-4 py-2 border-b">
                    {txn.target_user_id
                        ? `To User ${txn.target_user_id}`
                        : "-"}
                    </td>
                  <td className="px-4 py-2 border-b">
                    {new Date(txn.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
       
      )}
    </div>
    </div>   
  )
}
