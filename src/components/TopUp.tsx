
import { useState } from "react"

export default function TopUp() {
  const [amount, setAmount] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/user/top-up", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ amount: parseFloat(amount) }),
      })
      if (!response.ok) throw new Error("Failed to top up")
      const data = await response.json()
      alert(`Successfully topped up! New balance: $${data.balance}`)
      setAmount("")        
      setError(null)  
    } catch (error) {
      setError("Failed to top up")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-32">
  <div className="w-full max-w-xl h-[250px] p-6 bg-white shadow rounded-md">
    <h2 className="text-2xl font-semibold mb-4">Top Up Funds</h2>
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600" htmlFor="amount">
          Amount to Add
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
      {error && <div className="text-red-500 text-sm mb-2">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {loading ? "Loading..." : "Top Up"}
      </button>
    </form>
  </div>
</div>

  )
}
