import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from '../../api/axiosInstance'; 

interface Transaction {
  id: number;
  amount: number;
  balance: number;
  currency: string;
  currency_symbol: string;
  status: string;
  timestamp: string;
  received_from?:string;
  received_from_id?:number;
  to: string;
  converted_amount?:number;
  type: string;
  target_user?: {
    target_user_id: number;
    target_username: string;
  };
}

export default function AdminTransactions() {
  const { userId } = useParams<{ userId: string }>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get(`/admin/transactions?user_id=${userId}`);
        setTransactions(res.data.transactions);
        setUsername(res.data.username);
      } catch (err) {
        setError("Failed to fetch transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, [userId]);

  if (loading) return <div className="p-6">Loading transactions...</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Transactions for {username}</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-2 border">Transaction ID</th>
              <th className="px-4 py-2 border">Type</th>
              <th className="px-4 py-2 border">Status</th>
              <th className="px-4 py-2 border">Amount</th>
              <th className="px-4 py-2 border">Balance</th>
              <th className="px-4 py-2 border">Currency</th>
              <th className="px-4 py-2 border">Converted Amount</th>
              <th className="px-4 py-2 border">Received From</th> 
              <th className="px-4 py-2 border">Sent To</th> 
              <th className="px-4 py-2 border">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{t.id}</td>
                <td className="px-4 py-2 border">
                    <span
                        className={`
                        px-2 py-1 rounded-full text-xs font-semibold
                        ${t.type === "transfer" ? "bg-blue-100 text-blue-800" : ""}
                        ${t.type === "exchange" ? "bg-yellow-100 text-yellow-800" : ""}
                        ${t.type === "top_up" ? "bg-green-100 text-green-800" : ""}
                        `}
                    >
                        {t.type}
                    </span>
                </td>

                <td className="px-4 py-2 border">
                    <span
                        className={`
                        px-2 py-1 rounded-full text-xs font-semibold
                        ${t.status === "credited" ? "bg-green-100 text-green-800" : ""}
                        ${t.status === "debited" ? "bg-red-100 text-red-800" : ""}
                        `}
                    >
                        {t.status}
                    </span>
                </td>

                <td className="px-4 py-2 border">
                  {t.currency_symbol}{t.amount.toFixed(2)}
                </td>
                <td className="px-4 py-2 border">
                  {t.currency_symbol}{t.balance.toFixed(2)}
                </td>
                <td className="px-4 py-2 border">{t.currency}</td>
                <td className="px-4 py-2 border">
                    {t.converted_amount !== undefined ? t.converted_amount.toFixed(2) : "-"}
                </td>
                <td className="px-4 py-2 border">
                    {t.received_from ? t.received_from : "-"}
                </td>
                <td className="px-4 py-2 border">
                    {t.target_user ? t.target_user.target_username : "-"}
                </td>
                <td className="px-4 py-2 border">
                  {new Date(t.timestamp).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
