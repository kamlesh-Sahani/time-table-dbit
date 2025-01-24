"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const LoginPage = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const router = useRouter();

  const loginHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        router.push("/timetable");
      } else {
        toast.error(data.message);
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full flex-1 justify-center">
      <form onSubmit={loginHandler} className="flex flex-col gap-2 items-center">
        <h1 className="text-2xl font-semibold drop-shadow-md">Admin Login</h1>
        <div className="flex flex-col gap-1">
          <p className="font-semibold text-[#4d4d4d]">Enter the Email</p>
          <input
            type="email"
            placeholder="eg. kamlesh@gmail.com"
            name="email"
            className="w-[400px] h-[35px] rounded outline-none pl-4"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1">
          <p className="font-semibold text-[#4d4d4d]">Enter the Password</p>
          <input
            type="password"
            className="w-[400px] h-[35px] rounded outline-none pl-4"
            name="password"
            placeholder="eg. ****@**"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button className="w-[400px] h-[35px] rounded outline-none pl-4 bg-[#4B3F72] mt-6 text-white font-semibold hover:bg-[#615196]">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
