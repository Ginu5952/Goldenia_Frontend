// src/components/Exchange.tsx
import { useState } from "react"

export default function Exchange() {
  const [amount, setAmount] = useState("")
  const [currencyFrom, setCurrencyFrom] = useState("USD")
  const [currencyTo, setCurrencyTo] = useState("EUR")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newBalance, setNewBalance] = useState<number | null>(null)

  const exchangeRate = 0.85 // Example: USD to EUR fixed rate

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/user/exchange", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          currency_from: currencyFrom,
          currency_to: currencyTo,
        }),
      })
      if (!response.ok) throw new Error("Failed to exchange currency")
      const data = await response.json()
      setNewBalance(data.balance);
      alert(`Exchange successful! New balance: $${data.balance}`)
      setAmount("");
      setCurrencyFrom("USD");
      setCurrencyTo("EUR");
    } catch (error) {
      setError("Failed to exchange currency")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-32">
    <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Exchange Currency</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600" htmlFor="amount">
            Amount to Exchange
          </label>
          <input
            type="number"
            id="amount"
            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
          />
        </div>
        <div className="mb-4 flex space-x-4">
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-600" htmlFor="currencyFrom">
              From
            </label>
            <select
              id="currencyFrom"
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              value={currencyFrom}
              onChange={(e) => setCurrencyFrom(e.target.value)}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
          <div className="w-full">
            <label className="block text-sm font-medium text-gray-600" htmlFor="currencyTo">
              To
            </label>
            <select
              id="currencyTo"
              className="w-full p-2 mt-2 border border-gray-300 rounded-md"
              value={currencyTo}
              onChange={(e) => setCurrencyTo(e.target.value)}
            >
              <option value="USD">USD</option>
              <option value="EUR">EUR</option>
            </select>
          </div>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          {loading ? "Loading..." : "Exchange"}
        </button>
      </form>
    </div>
    </div>
  )
}
