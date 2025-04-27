import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios';
import api from '../api/axiosInstance';

const signinSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Invalid Password"),
});

type SignInData = z.infer<typeof signinSchema>;

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInData>({
    resolver: zodResolver(signinSchema),
  });

  const navigate = useNavigate();
  const location = useLocation();
  const isAdminLogin = new URLSearchParams(location.search).get('role') === 'admin';

  const onSubmit = async (data: SignInData) => {
    try {
      const response = await api.post("/auth/login", 
        {
          email: data.email,
          password: data.password,
      });

      const result = response.data;  

      localStorage.setItem("token", result.access_token);
      localStorage.setItem("role", result.role); 

       
        if (result.role === "admin") {
          navigate("/admin");  
        } else {
          navigate("/home");  
        }
      alert("Login successful!");
    } catch (err) {
        if (axios.isAxiosError(err)) {
          alert(err.response?.data.message || "Login failed");
        } else {
          alert("Something went wrong during login");
        }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isAdminLogin ? "Admin Sign In" : "Sign In"}
        </h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="email"
              placeholder="Email"
              {...register("email")}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              placeholder="Password"
              {...register("password")}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            {isAdminLogin ? "Admin Sign In" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
