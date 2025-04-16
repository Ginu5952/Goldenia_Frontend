import { Link } from 'react-router-dom';

export default function Welcome() {
  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">Welcome to Goldnia</h1>
        <p className="text-lg text-gray-600 mb-6">Your financial world starts here.</p>

        <div className="space-x-4">
          <Link
            to="/signup"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </Link>

          <Link
            to="/signin"
            className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
          >
            Sign In
          </Link>

          <Link to="/signin?role=admin"
           className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition">
            
            Admin 
          </Link>
        </div>
      </div>
    </div>
  );
}
