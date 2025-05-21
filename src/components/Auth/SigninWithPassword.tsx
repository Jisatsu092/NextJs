"use client";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import { useState } from "react";
import { useRouter } from "next/navigation";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";

const BASE_URL = 'https://simaru.amisbudi.cloud/api';

interface LoginResponse {
  accessToken: string;
  token_type: string;
}

interface UserProfile {
  id: number;
  name: string;
  email: string;
}

export default function SigninWithPassword() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // 1. Login untuk dapat token
      const loginRes = await fetch(`${BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: username, password }),
      });
      const loginData: LoginResponse = await loginRes.json();
      if (!loginRes.ok) throw new Error((loginData as any).message || "Login gagal");
      localStorage.setItem("accessToken", loginData.accessToken);

      // 2. Fetch profil untuk dapat user.id
      const profileRes = await fetch(`${BASE_URL}/auth/me`, {
        headers: { "Authorization": `Bearer ${loginData.accessToken}` },
      });
      const profileData: UserProfile = await profileRes.json();
      if (!profileRes.ok) throw new Error((profileData as any).message || "Gagal mengambil profil");
      localStorage.setItem("user", JSON.stringify({
        id: profileData.id,
        name: profileData.name,
        email: profileData.email
      }));

      // 3. Redirect ke halaman protected yang benar
      const redirectPath =
        new URLSearchParams(window.location.search).get("redirect") ||
        "/calendar";  // ← ganti ke route dashboard mu
      router.push(redirectPath);

    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto">
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

      <InputGroup
        label="Email"
        type="email"
        placeholder="Masukkan email"
        value={username}
        onChange={e => setUsername(e.target.value)}
        icon={<EmailIcon />}
        required
      />

      <InputGroup
        label="Password"
        type="password"
        placeholder="Masukkan password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        icon={<PasswordIcon />}
        required
      />

      <div className="flex items-center justify-between my-4">
        <Checkbox label="Ingat saya" name="remember" withIcon="check" minimal radius="md" />
        <a href="/auth/forgot-password" className="text-sm hover:underline">Lupa Password?</a>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-primary text-white py-3 rounded disabled:opacity-50"
      >
        {isLoading ? "Sedang Masuk..." : "Masuk"}
      </button>
    </form>
  );
}
