// src/lib/auth.ts
export interface User {
  id: number;
  name: string;
  email: string;
  token: string;
}

export const getCurrentUser = (): User => {
  // Cek apakah running di client side
  if (typeof window === 'undefined') {
    throw new Error("Fungsi ini hanya bisa dijalankan di client side");
  }

  const userStr = localStorage.getItem('user');
  
  if (!userStr) {
    throw new Error("Harap login terlebih dahulu");
  }

  try {
    const user = JSON.parse(userStr) as User;
    
    // Validasi struktur data user
    if (
      !user ||
      typeof user !== 'object' ||
      !user.id ||
      !user.token ||
      !user.email
    ) {
      throw new Error("Format user tidak valid");
    }
    
    return user;
  } catch (error) {
    localStorage.removeItem('user'); // Bersihkan data invalid
    throw new Error("Data user korup, silakan login kembali");
  }
};

export const storeUser = (userData: User): void => {
  localStorage.setItem('user', JSON.stringify({
    id: userData.id,
    name: userData.name,
    email: userData.email,
    token: userData.token
  }));
};

export const logout = (): void => {
  localStorage.removeItem('user');
  window.location.href = '/login'; // Redirect ke halaman login
};