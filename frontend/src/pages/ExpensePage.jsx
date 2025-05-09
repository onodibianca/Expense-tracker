import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [amount, setAmount] = useState(0.0);
  const [category, setCategory] = useState("Other");
  const [description, setDescription] = useState("");
  const [showEdit, setShowEdit] = useState(false);
  const [selectedExpenseId, setSelectedExpenseId] = useState(null);
  const [selectedExpenseIdEdit, setSelectedExpenseIdEdit] = useState(null);
  const navigate = useNavigate();

  const fetchExpenses = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5000/api/expenses", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.msg || "Error fetching expenses");
      }

      const data = await response.json();
      setExpenses(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, []);

  const handleEdit = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/expenses/${selectedExpenseIdEdit}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount, category, description }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.msg || "Error editing expense");
      }

      console.log("Expense updated:", data);
      setShowEdit(false);
      setError("");
      await fetchExpenses();
    } catch (error) {
      setError(error.message || "An error occurred, try again later.");
    }
  };

  const handleDelete = async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setError("No token found. Please log in.");
      return;
    }
    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/expenses/${selectedExpenseId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.msg || "Error deleting expense");
      }

      setExpenses(
        expenses.filter((expense) => expense.id !== selectedExpenseId)
      );
      setShowConfirm(false);
      setSelectedExpenseId(null);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="bg-green-100 min-h-screen flex justify-center items-start pt-4 relative">
      <div className="absolute top-4 right-4 w-12 h-12 bg-slate-600 rounded-full dark:bg-gray-800">
        <svg
          className="absolute w-14 h-14 text-gray-400 -left-1 "
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
            clipRule="evenodd"
          ></path>
        </svg>
      </div>

      <Link
        to="/"
        className="mt-6 text-slate-400 absolute top-0 right-20 text-2xl z-50"
      >
        Log out
      </Link>

      <div className="bg-white/80 border-4 border-orange-200 rounded-3xl w-[800px] h-[90vh] p-20 shadow-xl relative ">
        <div className="text-[50px] text-orange-200 absolute inset-x-0 top-8 font-serif">
          YOUR EXPENSES
        </div>

        <div className="mt-32 space-y-4 max-h-[60vh] overflow-y-auto pr-2">
          {error && <p className="text-red-500">{error}</p>}

          {expenses.map((expense) => (
            <div key={expense.id} className="p-4 border-b text-orange-400">
              <p>
                <strong className="text-orange-400">Amount:</strong>
                <span className="text-gray-600">${expense.amount}</span>
              </p>
              <p>
                <strong className="text-orange-400">Category:</strong>{" "}
                <span className="text-gray-600">{expense.category}</span>
              </p>
              <p>
                <strong className="text-orange-400">Description:</strong>{" "}
                <span className="text-gray-600">{expense.description}</span>
              </p>
              <p>
                <strong className="text-orange-400">Date:</strong>{" "}
                <span className="text-gray-600">{expense.date}</span>
              </p>
              <button
                className=" bottom-0 right-20 px-2 py-1 bg-green-300 hover:bg-green-400 text-white rounded-xl"
                onClick={() => {
                  setSelectedExpenseIdEdit(expense.id);
                  setAmount(expense.amount);
                  setCategory(expense.category);
                  setDescription(expense.description);
                  setShowEdit(true);
                }}
              >
                Edit
              </button>
              <button
                className=" bottom-0 right-0 px-2 py-1 bg-orange-300 hover:bg-orange-400 text-white rounded-xl"
                onClick={() => {
                  setSelectedExpenseId(expense.id);
                  setShowConfirm(true);
                }}
              >
                Remove
              </button>
            </div>
          ))}
        </div>

        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-xl text-center space-y-4 w-80">
              <p className="text-lg font-semibold text-gray-700">
                Are you sure you want to remove this item?
              </p>
              <div className="flex justify-around mt-4">
                <button
                  onClick={handleDelete}
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

        {showEdit && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white/80 border-4 border-orange-200 rounded-3xl w-[800px] h-[60vh] p-20 shadow-xl relative overflow-y-auto">
              <div className="text-[40px] text-gray-400 font-serif mb-16 text-center">
                MAKE THE DESIRED CHANGES
              </div>
              <div className="space-y-6">
                {error && <p className="text-red-500">{error}</p>}

                <div>
                  <label className="text-[24px] text-gray-700">Amount:</label>
                  <input
                    className="border border-lime-100 rounded px-4 mt-2 py-2 w-full"
                    placeholder="Enter amount in $"
                    type="text"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-[24px] text-gray-700">Category:</label>
                  <input
                    className="border border-lime-100 rounded px-4 mt-2 py-2 w-full"
                    placeholder="Enter category"
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-[24px] text-gray-700">
                    Description:
                  </label>
                  <input
                    className="border border-lime-100 rounded px-4 mt-2 py-2 w-full"
                    placeholder="Optional"
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-around mt-4">
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-orange-300 rounded hover:bg-orange-400"
                >
                  Yes
                </button>
                <button
                  onClick={() => setShowEdit(false)}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                >
                  No
                </button>
              </div>
            </div>
          </div>
        )}

        <button
          className="absolute bottom-10 right-10 px-10 py-4 bg-green-100 hover:bg-green-400 text-grey rounded-xl"
          onClick={() => navigate("/add")}
        >
          Add Expense
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
