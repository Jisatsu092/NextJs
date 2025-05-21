import * as logos from "@/assets/logos";

export async function getTopProducts() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return [
    {
      image: "/images/product/product-01.png",
      name: "Apple Watch Series 7",
      category: "Electronics",
      price: 296,
      sold: 22,
      profit: 45,
    },
    {
      image: "/images/product/product-02.png",
      name: "Macbook Pro M1",
      category: "Electronics",
      price: 546,
      sold: 12,
      profit: 125,
    },
    {
      image: "/images/product/product-03.png",
      name: "Dell Inspiron 15",
      category: "Electronics",
      price: 443,
      sold: 64,
      profit: 247,
    },
    {
      image: "/images/product/product-04.png",
      name: "HP Probook 450",
      category: "Electronics",
      price: 499,
      sold: 72,
      profit: 103,
    },
  ];
}

export async function getInvoiceTableData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1400));

  return [
    {
      name: "Free package",
      price: 0.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Paid",
    },
    {
      name: "Standard Package",
      price: 59.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Paid",
    },
    {
      name: "Business Package",
      price: 99.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Unpaid",
    },
    {
      name: "Standard Package",
      price: 59.0,
      date: "2023-01-13T18:00:00.000Z",
      status: "Pending",
    },
  ];
}

export async function getTopChannels() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  return [
    {
      name: "Google",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.google,
    },
    {
      name: "X.com",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.x,
    },
    {
      name: "Github",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.github,
    },
    {
      name: "Vimeo",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.vimeo,
    },
    {
      name: "Facebook",
      visitors: 3456,
      revenues: 4220,
      sales: 3456,
      conversion: 2.59,
      logo: logos.facebook,
    },
  ];
}

interface Room {
  id: number;
  name: string;
  categoryId: string;
  price: number;
  capacity: number;
  description: string;
}

interface RoomData {
  name: string;
  categoryId: number;
  price: number;
  capacity: number;
  description: string;
}

export async function getRooms(): Promise<Room[]> {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("Token tidak valid");

    const response = await fetch("https://simaru.amisbudi.cloud/api/rooms", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `Gagal mengambil data: ${response.status}`
      );
    }

    const apiData = await response.json();

    // Validasi struktur response
    if (!apiData.data || !Array.isArray(apiData.data)) {
      throw new Error("Format data tidak valid");
    }

    return apiData.data.map((room: any) => ({
      id: room.id, // Pastikan ID ada
      name: room.name || "Unnamed Room",
      categoryId: room.categoryId.toString(), // Ambil ID kategori
      price: Number(room.price) || 0,
      capacity: Number(room.capacity) || 0,
      description: room.description || "No description",
    }));
  } catch (error) {
    console.error("Error fetching rooms:", error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : "Terjadi kesalahan saat mengambil data"
    );
  }
}
export async function createRoom(roomData: {
  name: string;
  categoryId: number;
  price: number;
  capacity: number;
  description: string;
}) {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("Token tidak valid");

    const response = await fetch("https://simaru.amisbudi.cloud/api/rooms", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(roomData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal menambahkan ruangan");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
}

export const updateRoom = async (id: number, roomData: RoomData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("Token tidak valid");

    const response = await fetch(`https://simaru.amisbudi.cloud/api/rooms/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(roomData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal memperbarui ruangan");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating room:", error);
    throw error;
  }
};

export const deleteRoom = async (id: number) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("Token tidak valid");

    const response = await fetch(`https://simaru.amisbudi.cloud/api/rooms/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal menghapus ruangan");
    }

    return true;
  } catch (error) {
    console.error("Error deleting room:", error);
    throw error;
  }
};

export const getRoom = async (id: number) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("Token tidak valid");

    const response = await fetch(`https://simaru.amisbudi.cloud/api/rooms/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal mengambil data ruangan");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching room:", error);
    throw error;
  }
};

export async function getCategories() {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("Token tidak valid");

    const response = await fetch("https://simaru.amisbudi.cloud/api/categories", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const apiData = await response.json();

    if (!Array.isArray(apiData)) {
      throw new Error("Format respons API tidak valid");
    }

    return apiData.map((category: any) => ({
      id: category.id.toString(),
      name: category.name,
    }));

  } catch (error) {
    console.error("Error fetching categories:", error);
    let errorMessage = "Gagal memuat kategori";
    if (error instanceof Error) {
      errorMessage += ": " + error.message;
    }
    
    throw new Error(errorMessage);
  }
}

export interface User {
  id: number;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  status: 'active' | 'inactive';
}



export interface UserData {
  name: string;
  email: string;
  password?: string;
  roleId: number;
  status?: 'active' | 'inactive';
}

export const getUsers = async (page: number = 1): Promise<{ data: User[], totalPages: number }> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("Token tidak valid");

    const response = await fetch(`https://simaru.amisbudi.cloud/api/users?page=${page}&per_page=10`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Gagal mengambil data: ${response.status}`);
    }

    const apiData = await response.json();

    if (!apiData.data || !Array.isArray(apiData.data)) {
      throw new Error("Format data tidak valid");
    }

    return {
      data: apiData.data.map((user: any) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.created_at,
        updatedAt: user.updated_at,
        status: user.status || 'active'
      })),
      totalPages: apiData.totalPages // Sesuaikan dengan response API Anda
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : "Terjadi kesalahan saat mengambil data user"
    );
  }
};

export const createUser = async (userData: UserData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("Token tidak valid");

    const response = await fetch("https://simaru.amisbudi.cloud/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        ...userData,
        status: userData.status || 'active'
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal membuat user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const updateUser = async (id: number, userData: UserData) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("Token tidak valid");

    const response = await fetch(`https://simaru.amisbudi.cloud/api/users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal memperbarui user");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id: number) => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("Token tidak valid");

    const response = await fetch(`https://simaru.amisbudi.cloud/api/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal menghapus user");
    }

    return true;
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error;
  }
};

export const getUser = async (id: number): Promise<User> => {
  try {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) throw new Error("Token tidak valid");

    const response = await fetch(`https://simaru.amisbudi.cloud/api/users/${id}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Gagal mengambil detail user");
    }

    const user = await response.json();
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.created_at,
      updatedAt: user.updated_at,
      status: user.status || 'active'
    };
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

interface BookingResponse {
  id: number;
  booking_date: string;
  room_id: number;
  user_id: number;
  status: string;
  room: {
    name: string;
    price: number;
    capacity: number;
  };
  user?: {
    name: string;
  };
}

interface RoomResponse {
  id: number;
  name: string;
  price: number;
  capacity: number;
}

interface Booking {
  id: number;
  bookingDate: string;
  roomId: number;
  userId: number;
  status: string;
  room: {
    name: string;
    price: number;
    capacity: number;
  };
    user?: {
    name: string;
  };
}

const BASE_URL = 'https://simaru.amisbudi.cloud/api';

const handleResponse = async (response: Response) => {
  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");

  if (!response.ok) {
    const errorData = isJson ? await response.json() : { message: await response.text() };
    console.error("API error:", errorData);
    throw new Error(errorData.message || 'Terjadi kesalahan');
  }

  return isJson ? response.json() : response.text();
};

const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  if (!userStr) throw new Error('Harap login terlebih dahulu');

  const user = JSON.parse(userStr);
  if (!user?.id || !user?.token) throw new Error('Data user tidak valid');

  return user;
};

export const getBookings = async (): Promise<Booking[]> => {
  const user = getCurrentUser();

  const response = await fetch(`${BASE_URL}/bookings`, {
    headers: {
      'Authorization': `Bearer ${user.token}`
    }
  });

  const data: BookingResponse[] = await handleResponse(response);

  return data.map(booking => ({
    id: booking.id,
    bookingDate: booking.booking_date,
    roomId: booking.room_id,
    userId: booking.user_id,
    status: booking.status,
    room: booking.room,
    user: booking.user
  }));
};

export const createBooking = async (bookingData: {
  bookingDate: string;
  roomId: number;
  userId: number;
}): Promise<Booking> => {
  const user = getCurrentUser();

  const response = await fetch(`${BASE_URL}/bookings`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    },
    body: JSON.stringify({
      booking_date: bookingData.bookingDate,
      room_id: bookingData.roomId,
      user_id: bookingData.userId
    })
  });

  const data: BookingResponse = await handleResponse(response);

  return {
    id: data.id,
    bookingDate: data.booking_date,
    roomId: data.room_id,
    userId: data.user_id,
    status: data.status,
    room: data.room,
    user: data.user
  };
};

export const updateBooking = async (
  id: number,
  bookingData: {
    bookingDate: string;
    roomId: number;
    userId: number;
  }
): Promise<Booking> => {
  const user = getCurrentUser();

  const response = await fetch(`${BASE_URL}/bookings/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${user.token}`
    },
    body: JSON.stringify({
      booking_date: bookingData.bookingDate,
      room_id: bookingData.roomId,
      user_id: bookingData.userId
    })
  });

  const data: BookingResponse = await handleResponse(response);

  return {
    id: data.id,
    bookingDate: data.booking_date,
    roomId: data.room_id,
    userId: data.user_id,
    status: data.status,
    room: data.room,
    user: data.user
  };
};

export const deleteBooking = async (id: number): Promise<void> => {
  const user = getCurrentUser();

  const response = await fetch(`${BASE_URL}/bookings/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${user.token}`
    }
  });

  await handleResponse(response);
};
