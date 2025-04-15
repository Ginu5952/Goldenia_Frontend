
import { useState } from "react"

export default function SendTransfer() {
  const [amount, setAmount] = useState("")
  const [targetUserId, setTargetUserId] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [balance, setBalance] = useState<number | null>(null);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("http://localhost:5000/user/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          target_user_id: targetUserId,
        }),
      })
      if (!response.ok) throw new Error("Failed to send transfer")
      const data = await response.json()
      alert(`Transfer successful! New balance: $${data.balance}`)
      setAmount("");  
      setTargetUserId("");
      setBalance(data.balance); 
    } catch (error) {
      setError("Failed to send transfer")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-start pt-32">
    <div className="w-full max-w-xl h-[350px] p-6 bg-white shadow rounded-md">
      <h2 className="text-2xl font-semibold mb-4 ">Send Transfer</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600" htmlFor="targetUserId">
            Recipient User ID
          </label>
          <input
            type="text"
            id="targetUserId"
            className="w-full p-2 mt-2 border border-gray-300 rounded-md"
            value={targetUserId}
            onChange={(e) => setTargetUserId(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600" htmlFor="amount">
            Amount to Send
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
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-4"
        >
          {loading ? "Loading..." : "Send Transfer"}
        </button>
      </form>
        {balance !== null && (
          <div className="mt-4 text-sm text-gray-700">
            <strong>Current Balance: </strong>${balance.toFixed(2)}
          </div>
        )}
    </div>
    </div>
  )
}
