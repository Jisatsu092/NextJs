"use client";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import Link from "next/link";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { Checkbox } from "../FormElements/checkbox";
import { useRouter } from 'next/navigation';

export default function SigninWithPassword() {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password_confirmation, setPassword_confirmation] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');

  try {
    const response = await fetch('https://simaru.amisbudi.cloud/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        "name": name,
        "email": username,
        "password": password,
        "password_confirmation": password_confirmation
      }),
    });

    const data = await response.json();
    console.log('Respons Data:', data);  // Cek apa yang dikirim oleh API

    if (response.ok) {
      if (data?.user && data?.accessToken) {
        const userData = {
          name: data.user?.name || 'User',
          email: data.user?.email || username
        };

        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('accessToken', data.accessToken);

        router.push('/');
      } else {
        setError('Data pengguna atau token tidak valid.');
      }
    } else {
      setError(data.message || 'Registrasi gagal. Silakan coba lagi.');
    }
  } catch (err) {
    setError('Terjadi kesalahan. Silakan coba beberapa saat lagi.');
  } finally {
    setIsLoading(false);
  }
};


  return (
    <form onSubmit={handleSubmit}>

      <InputGroup
        label="Name"
        type="text"
        placeholder="Enter full name"
        className="mb-4.5"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <InputGroup
        label="Email"
        type="email"
        className="mb-4 [&_input]:py-[15px]"
        placeholder="Enter your email"
        name="email"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
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

      <InputGroup
        label="Password Confirmation"
        type="password"
        className="mb-5 [&_input]:py-[15px]"
        placeholder="Enter your password Confirmation"
        name="password_confirmation"
        value={password_confirmation}
        onChange={(e) => setPassword_confirmation(e.target.value)}
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
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </div>
    </form>
  );
}
