import { useEffect, useState } from "react"

interface User {
  id: number
  username: string
  balance: number
  is_admin: boolean
  email: string
  created_at: string
}

interface Transaction {
  id: number
  type: string
  amount: number
  currency: string
  timestamp: string
  user_id: number
  target_user_id?: number
  exchange_to?: string
}

export default function AdminDashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userTransactions, setUserTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const token = localStorage.getItem("token")
  const headers = {
    Authorization: `Bearer ${token}`,
  }

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const [usersRes, transactionsRes] = await Promise.all([
          fetch("http://localhost:5000/admin/users", { headers }),
          fetch("http://localhost:5000/admin/transactions", { headers }),
        ])

        if (!usersRes.ok || !transactionsRes.ok) {
          throw new Error("Unauthorized or failed to fetch admin data.")
        }

        const usersData = await usersRes.json()
        const transactionsData = await transactionsRes.json()

        setUsers(usersData.users)
        setTransactions(transactionsData.transactions)
      } catch (err) {
        setError("You must be an admin to view this dashboard.")
      } finally {
        setLoading(false)
      }
    }

    fetchAdminData()
  }, [])

  const handleViewUser = async (userId: number) => {
    try {
      const [userRes, txnRes] = await Promise.all([
        fetch(`http://localhost:5000/user/${userId}`, { headers }),
        fetch(`http://localhost:5000/user/transactions?id=${userId}`, { headers }), 
      ])

      if (!userRes.ok || !txnRes.ok) throw new Error("Failed to fetch user data")

      const userData = await userRes.json()
      const userTxnData = await txnRes.json()

      setSelectedUser(userData)
      setUserTransactions(userTxnData.transactions || [])
    } catch (err) {
      alert("Error fetching user info")
    }
  }

  if (loading) return <div className="p-6">Loading admin data...</div>
  if (error) return <div className="p-6 text-red-500">{error}</div>

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      {/* Users Table */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Username</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Balance</th>
                <th className="px-4 py-2 border">Admin</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{u.id}</td>
                  <td className="px-4 py-2 border">{u.username}</td>
                  <td className="px-4 py-2 border">{u.email}</td>
                  <td className="px-4 py-2 border">{u.balance.toFixed(2)}</td>
                  <td className="px-4 py-2 border text-center">
                    {u.is_admin ? "✅" : "❌"}
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      onClick={() => handleViewUser(u.id)}
                      className="text-blue-600 hover:underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2">All Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">User</th>
                <th className="px-4 py-2 border">Type</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Currency</th>
                <th className="px-4 py-2 border">To/Exchange</th>
                <th className="px-4 py-2 border">Time</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{txn.id}</td>
                  <td className="px-4 py-2 border">{txn.user_id}</td>
                  <td className="px-4 py-2 border capitalize">{txn.type}</td>
                  <td className="px-4 py-2 border">{txn.amount.toFixed(2)}</td>
                  <td className="px-4 py-2 border">{txn.currency}</td>
                  <td className="px-4 py-2 border">
                    {txn.target_user_id
                      ? `User ${txn.target_user_id}`
                      : txn.exchange_to
                      ? `→ ${txn.exchange_to}`
                      : "-"}
                  </td>
                  <td className="px-4 py-2 border">
                    {new Date(txn.timestamp).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Selected User Info */}
      {selectedUser && (
        <div>
          <h2 className="text-xl font-semibold mb-2">{selectedUser.username}</h2>
          <div className="bg-white p-4 rounded border mb-4">
            <p><strong>ID:</strong> {selectedUser.id}</p>
            <p><strong>Username:</strong> {selectedUser.username}</p>
            <p><strong>Email:</strong> {selectedUser.email}</p>
            <p><strong>Balance:</strong> {selectedUser.balance.toFixed(2)}</p>
            <p><strong>Created:</strong> {new Date(selectedUser.created_at).toLocaleString()}</p>
          </div>

          <h3 className="text-lg font-medium mb-2">User Transactions</h3>
          <table className="min-w-full bg-white border border-gray-200 text-sm">
            <thead className="bg-gray-100 text-gray-600">
              <tr>
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Type</th>
                <th className="px-4 py-2 border">Amount</th>
                <th className="px-4 py-2 border">Currency</th>
                <th className="px-4 py-2 border">To</th>
                <th className="px-4 py-2 border">Time</th>
              </tr>
            </thead>
            <tbody>
              {userTransactions.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 border">{t.id}</td>
                  <td className="px-4 py-2 border capitalize">{t.type}</td>
                  <td className="px-4 py-2 border">{t.amount.toFixed(2)}</td>
                  <td className="px-4 py-2 border">{t.currency}</td>
                  <td className="px-4 py-2 border">
                    {t.target_user_id
                      ? `User ${t.target_user_id}`
                      : t.exchange_to
                      ? `→ ${t.exchange_to}`
                      : "-"}
                  </td>
                  <td className="px-4 py-2 border">{new Date(t.timestamp).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
