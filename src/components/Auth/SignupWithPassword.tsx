"use client";
import { EmailIcon, PasswordIcon } from "@/assets/icons";
import React, { useState } from "react";
import InputGroup from "../FormElements/InputGroup";
import { useRouter } from 'next/navigation';

export default function RegisterWithPassword() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(''); // Ganti username menjadi email untuk kejelasan
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // 1. Kirim permintaan registrasi ke API
      const response = await fetch('https://simaru.amisbudi.cloud/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          password_confirmation: passwordConfirmation
        }),
      });

      const data = await response.json();
      console.log('Respons Data:', data); // Untuk debugging

      if (response.ok) {
        if (data?.accessToken) {
          // Simpan token akses
          localStorage.setItem('accessToken', data.accessToken);

          // 2. Ambil profil pengguna
          const profileRes = await fetch('https://simaru.amisbudi.cloud/api/auth/me', {
            headers: { 'Authorization': `Bearer ${data.accessToken}` },
          });
          const profileData = await profileRes.json();

          if (profileRes.ok) {
            // Simpan data pengguna ke localStorage
            localStorage.setItem('user', JSON.stringify({
              name: profileData.name,
              email: profileData.email,
              id: profileData.id // Jika tersedia
            }));

            // 3. Arahkan ke dashboard
            router.push('/');
          } else {
            setError('Gagal mengambil data pengguna.');
          }
        } else {
          setError('Token tidak ditemukan dalam respons.');
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
      {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}

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

      <InputGroup
        label="Password Confirmation"
        type="password"
        className="mb-5 [&_input]:py-[15px]"
        placeholder="Enter your password confirmation"
        name="password_confirmation"
        value={passwordConfirmation}
        onChange={(e) => setPasswordConfirmation(e.target.value)}
        icon={<PasswordIcon />}
        required
      />

      <div className="mb-4.5">
        <button
          type="submit"
          disabled={isLoading}
          className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary p-4 font-medium text-white transition hover:bg-opacity-90"
        >
          {isLoading ? 'Registering...' : 'Register'}
        </button>
      </div>
    </form>
  );
}