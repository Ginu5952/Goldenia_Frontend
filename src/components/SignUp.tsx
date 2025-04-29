import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import api from '../api/axiosInstance'

const signupSchema = z.object({
  username: z.string().nonempty("Name cannot be empty")
                      .min(2, "Name must be at least 2 characters long"),
  email: z.string().email("Invalid email")
                    .nonempty("Email cannot be empty"),
  password: z.string().min(6, "Password too short")
                      .nonempty("Password cannot be empty"),
})

type SignUpData = z.infer<typeof signupSchema>

export default function SignUp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpData>({
    resolver: zodResolver(signupSchema),
  })

  const navigate = useNavigate();

 
  const onSubmit = async (data: SignUpData) => {
    try {
      const response = await api.post("/auth/signup", 
        {
          username: data.username,   
          email: data.email,
          password: data.password,
        });
  
      alert("Account created successfully!");
      navigate("/signin");
  
    } catch (error) {
      if (axios.isAxiosError(error)) {
        alert(error.response?.data.message || "Signup failed");
      } else {
        alert("Something went wrong during signup");
      }
    }
  };
  

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="User Name"
              {...register("username")}
              className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && (
              <p className="text-red-500 text-sm">{errors.username.message}</p>
            )}
          </div>

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
            Create Account
          </button>
        </form>
      </div>
    </div>
  )
}
