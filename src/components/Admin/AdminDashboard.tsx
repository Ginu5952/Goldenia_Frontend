import { useEffect, useState } from "react";
import api from '../../api/axiosInstance';
import { useNavigate } from "react-router-dom";


interface UserBalance {
  balance: number;
  currency: string;
}

interface User {
  id: number;
  username: string;
  email: string;
  is_admin: boolean;
  created_at: string;
  balances: UserBalance[];
}

export default function AdminDashboard() {
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
 
  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const usersRes = await api.get("/admin/users", );
        const userData = usersRes.data;
        
        setUsers(userData.users);
      } catch (err) {
        setError("You must be an admin to view this dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  if (loading) return <div className="p-6">Loading admin data...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

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
                <th className="px-4 py-2 border">Acc ID</th>
                <th className="px-4 py-2 border">User Name</th>
                <th className="px-4 py-2 border">Email</th>
                <th className="px-4 py-2 border">Created At</th>
                <th className="px-4 py-2 border">Balance (USD)</th>
                <th className="px-4 py-2 border">Balance (EUR)</th>
                <th className="px-4 py-2 border">Admin</th>
                <th className="px-4 py-2 border">Transactions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const usdBalance = u.balances.find((b) => b.currency === "USD")?.balance || 0;
                const eurBalance = u.balances.find((b) => b.currency === "EUR")?.balance || 0;
                const formattedDate = new Date(u.created_at).toLocaleDateString();

                return (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border">{u.id}</td>
                    <td className="px-4 py-2 border">{u.username}</td>
                    <td className="px-4 py-2 border">{u.email}</td>
                    <td className="px-4 py-2 border">{formattedDate}</td>
                    <td className="px-4 py-2 border">${usdBalance.toLocaleString()}</td>
                    <td className="px-4 py-2 border">€{eurBalance.toLocaleString()}</td>
                    <td className="px-4 py-2 border text-center">
                      {u.is_admin ? "✅" : "❌"}
                    </td>
                    <td className="px-4 py-2 border">
                      <button 
                      className="text-blue-600 hover:underline"
                      onClick={() => navigate(`/admin/transactions/${u.id}`)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
