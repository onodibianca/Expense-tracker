import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <div className="bg-green-100 min-h-screen flex justify-center items-start pt-4 relative">
      <div className="absolute top-4 right-4 w-12 h-12 overflow-hidden bg-slate-600 rounded-full dark:bg-gray-800">
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

      <div className="bg-white/80 border-4 border-orange-200 rounded-3xl w-[800px] h-[90vh] p-20 shadow-xl relative">
        <div className="text-[50px] text-orange-200 absolute inset-x-0 top-8 font-serif">
          YOUR EXPENSES
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
