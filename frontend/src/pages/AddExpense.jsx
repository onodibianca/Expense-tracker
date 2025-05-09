import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddExpense() {
  const [amount, setAmount] = useState(0.0);
  const [category, setCategory] = useState("Other");
  const [description, setDescription] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleAdding = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/expenses", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, category, description }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Error adding expense");
      }

      console.log("Expense created:", data);
      navigate("/dasboard");
    } catch (error) {
      setError("An error occurred, try again later.");
    }
  };

  return (
    <div className="bg-green-100 min-h-screen flex justify-center items-start pt-4 relative">
      <div className="bg-white/80 border-4 border-orange-200 rounded-3xl w-[800px] h-[60vh] p-20 shadow-xl relative overflow-y-auto">
        <div className="text-[40px] text-orange-200 font-serif mb-16 text-center">
          ADD NEW EXPENSE
        </div>

        <div className="space-y-6">
          {error && <p className="text-red-500">{error}</p>}

          <div>
            <label className="text-[24px] text-gray-700">Amount:</label>
            <input
              className="border border-lime-100 rounded px-4 mt-2 py-2 w-full"
              placeholder="Enter amount in $"
              type="text"
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[24px] text-gray-700">Category:</label>
            <input
              className="border border-lime-100 rounded px-4 mt-2 py-2 w-full"
              placeholder="Enter category"
              type="text"
              onChange={(e) => setCategory(e.target.value)}
            />
          </div>

          <div>
            <label className="text-[24px] text-gray-700">Description:</label>
            <input
              className="border border-lime-100 rounded px-4 mt-2 py-2 w-full"
              placeholder="Optional"
              type="text"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        <button
          className="absolute bottom-10 right-10 px-10 py-4 bg-orange-200 hover:bg-orange-400 text-gray-700 rounded-xl"
          onClick={() => setShowConfirm(true)}
        >
          Back
        </button>

        <button
          className="absolute bottom-10 right-40 px-10 py-4 bg-green-100 hover:bg-green-400 text-gray-700 rounded-xl"
          onClick={handleAdding}
        >
          Add
        </button>
      </div>
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center space-y-4 w-80">
            <p className="text-lg font-semibold text-gray-700">
              Are you sure you want to go back?
            </p>
            <div className="flex justify-around mt-4">
              <button
                onClick={() => navigate("/dasboard")}
                className="px-4 py-2 bg-orange-300 rounded hover:bg-orange-400"
              >
                Yes
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AddExpense;
