"use client";

import { EmailIcon, PasswordIcon } from "@/assets/icons";
import Link from "next/link";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import { useRouter } from "next/navigation";

export default function SigninWithPassword() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validasi client-side
    if (!email.trim() || !password.trim()) {
      setError("Email dan password harus diisi.");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("https://simaru.amisbudi.cloud/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Respons Data:", data); // Untuk debugging

      if (response.ok) {
        if (data?.user && data?.accessToken) {
          const userData = {
            name: data.user?.name || "User",
            email: data.user?.email || email,
          };

          localStorage.setItem("user", JSON.stringify(userData));
          localStorage.setItem("accessToken", data.accessToken);

          router.push("/dashboard");
        } else {
          setError("Data pengguna atau token tidak valid.");
        }
      } else {
        setError(data.message || "Login gagal. Silakan coba lagi.");
      }
    } catch (err) {
      console.error("Kesalahan:", err);
      setError("Terjadi kesalahan. Silakan coba beberapa saat lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-center">Sign In</h1>
      <form onSubmit={handleSubmit}>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}

        <InputGroup
          label="Email"
          type="email"
          className="mb-4 [&_input]:py-[15px]"
          placeholder="Enter your email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          icon={<EmailIcon />}
          required
        />

        <InputGroup
          label="Password"
          type="password"
          className="mb-5 [&_input]:py-[15px]"
          placeholder="Enter your password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          icon={<PasswordIcon />}
          required
        />

        <div className="mb-6 flex items-center justify-between gap-2 py-2 font-medium">
          <Checkbox
            label="Remember me"
            name="remember"
            withIcon="check"
            minimal
            radius="md"
          />

          <Link
            href="/auth/forgot-password"
            className="hover:text-primary dark:text-white dark:hover:text-primary"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="mb-4.5">
          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90 disabled:opacity-50"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </div>

        <p className="text-center text-gray-600">
          Don’t have an account?{" "}
          <Link href="/auth/sign-up" className="text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
}