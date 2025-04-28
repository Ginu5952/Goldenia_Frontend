import { useEffect, useState } from "react";
import api from '../../api/axiosInstance';

interface Transaction {
  id: number;
  type: string;
  amount: number;
  currency_symbol: string;
  currency: string;
  timestamp: string;
  status: string;
  target_user_id?: number;
  target_username?: string;
  converted_amount?: number;
  currency_from?: string;
  currency_to?: string;
  balance?: number;
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await api.get("/user/transactions");
        const data = response.data;
        if (data && data.transactions) {
          setTransactions(data.transactions);
        } else {
          setError("No transactions found or unexpected response format.");
        }
      } catch (err: any) {
        setError("Error loading transactions.");
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Utility to style status
  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "credited":
        return <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs">Credited</span>;
      case "debited":
        return <span className="bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs">Debited</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">{status}</span>;
    }
  };

  // Utility to style type
  const getTypeBadge = (type: string) => {
    switch (type.toLowerCase()) {
      case "exchange":
        return <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs">Exchange</span>;
      case "transfer":
        return <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs">Transfer</span>;
      case "top up":
        return <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs">Top Up</span>;
      default:
        return <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded-full text-xs">{type}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 px-4">
      <div className="max-w-6xl mx-auto p-6 bg-white rounded-2xl shadow-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Transaction History</h1>

        {loading ? (
          <div className="text-gray-500 text-center py-10">Loading...</div>
        ) : error ? (
          <div className="text-red-500 text-center py-10">{error}</div>
        ) : transactions.length === 0 ? (
          <div className="text-gray-500 text-center py-10">No transactions found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white text-sm border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 text-left">ID</th>
                  <th className="px-6 py-4 text-left">Type</th>
                  <th className="px-6 py-4 text-left">Amount</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-left">Currency From</th>
                  <th className="px-6 py-4 text-left">Currency To</th>
                  <th className="px-6 py-4 text-left">Converted</th>
                  <th className="px-6 py-4 text-left">Recipient</th>
                  <th className="px-6 py-4 text-left">Balance</th>
                  <th className="px-6 py-4 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 divide-y divide-gray-200">
                {transactions.map((txn) => (
                  <tr key={txn.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">{txn.id}</td>
                    <td className="px-6 py-4">{getTypeBadge(txn.type)}</td>
                    <td className="px-6 py-4 font-medium">{txn.amount.toFixed(2)} {txn.currency_symbol}</td>
                    <td className="px-6 py-4">{getStatusBadge(txn.status)}</td>
                    <td className="px-6 py-4">{txn.currency_from || "-"}</td>
                    <td className="px-6 py-4">{txn.currency_to || "-"}</td>
                    <td className="px-6 py-4">
                      {txn.type.toLowerCase() === "exchange"
                        ? `${txn.converted_amount?.toFixed(2)} ${txn.currency_symbol}`
                        : "-"}
                    </td>
                    <td className="px-6 py-4">
                      {txn.target_user_id ? txn.target_username : "-"}
                    </td>
                    <td className="px-6 py-4">{txn.balance?.toFixed(2)} {txn.currency_symbol}</td>
                    <td className="px-6 py-4">{new Date(txn.timestamp).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
