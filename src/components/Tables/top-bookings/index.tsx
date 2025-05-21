"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { standardFormat } from "@/lib/format-number";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface Booking {
  id: number;
  bookingDate: string;
  roomId: number;
  status: string;
  room?: {
    name: string;
    price: number;
    capacity: number;
  };
  user?: {
    id?: number;
    name: string;
  };
}

interface Room {
  id: number;
  name: string;
  price: number;
  capacity: number;
}

const BASE_URL = "https://simaru.amisbudi.cloud/api";

export function Bookings({ className }: { className?: string }) {
  const router = useRouter();
  const [data, setData] = useState<Booking[]>([]);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Booking | null>(null);
  const [formData, setFormData] = useState({
    bookingDate: new Date(),
    roomId: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const getAccessToken = useCallback(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push("/auth/sign-in");
      throw new Error("Session expired");
    }
    return token;
  }, [router]);

  const fetchBookings = useCallback(async () => {
    try {
      const token = getAccessToken();
      const res = await fetch(`${BASE_URL}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch bookings");
      const result = await res.json();
      setData(Array.isArray(result) ? result : result.data);
    } catch (err: any) {
      setError(err.message);
    }
  }, [getAccessToken]);

  const fetchRooms = useCallback(async () => {
    try {
      const token = getAccessToken();
      const res = await fetch(`${BASE_URL}/rooms`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch rooms");
      const result = await res.json();
      setRooms(Array.isArray(result) ? result : result.data);
    } catch (err: any) {
      setError(err.message);
    }
  }, [getAccessToken]);

  const refreshData = useCallback(async () => {
    setLoading(true);
    await fetchBookings();
    setLoading(false);
  }, [fetchBookings]);

  const handleDelete = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus booking ini?")) return;

    try {
      const token = getAccessToken();
      const res = await fetch(`${BASE_URL}/bookings/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal menghapus booking");
      }

      toast.success("Booking berhasil dihapus");
      await refreshData();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Terjadi kesalahan saat menghapus booking");
    }
  };

  useEffect(() => {
    (async () => {
      await Promise.all([fetchBookings(), fetchRooms()]);
      setLoading(false);
    })();
  }, [fetchBookings, fetchRooms]);

  const resetForm = () => {
    setCurrentBooking(null);
    setFormData({ bookingDate: new Date(), roomId: "" });
    setError(null);
  };

  const generateRandomUserId = () => {
    return Math.floor(Math.random() * 1000) + 1;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.roomId || !formData.bookingDate) {
      toast.error("Semua field harus diisi");
      return;
    }

    const token = getAccessToken();

    const payload = {
      roomId: Number(formData.roomId),
      userId: currentBooking?.user?.id ?? generateRandomUserId(),
      bookingDate: formData.bookingDate.toISOString().split("T")[0],
    };

    try {
      setSubmitting(true);
      const res = await fetch(
        currentBooking
          ? `${BASE_URL}/bookings/${currentBooking.id}`
          : `${BASE_URL}/bookings`,
        {
          method: currentBooking ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const raw = await res.text();
      if (!res.ok) {
        let msg = `Server returned ${res.status}`;
        try {
          const err = JSON.parse(raw);
          msg = err.message || msg;
        } catch {}
        throw new Error(msg);
      }

      toast.success(
        currentBooking ? "Booking berhasil diperbarui" : "Booking berhasil dibuat"
      );
      setModalOpen(false);
      await refreshData();
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Terjadi kesalahan saat booking");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div
        className={cn(
          "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
          className
        )}
      >
        <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
          Daftar Booking
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tanggal</TableHead>
              <TableHead>Ruangan</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 100 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={3}>
                  <div className="h-8 bg-gray-200 rounded animate-pulse dark:bg-gray-600"></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className={cn(
          "p-4 rounded-[10px] bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-100",
          className
        )}
      >
        {error}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className
      )}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Daftar Booking
        </h2>
        <button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Tambah Booking
        </button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-dark dark:text-white">Tanggal</TableHead>
            <TableHead className="text-dark dark:text-white">Ruangan</TableHead>
            <TableHead className="text-dark dark:text-white">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((b) => (
            <TableRow key={b.id}>
              <TableCell className="text-dark dark:text-white">
                {new Date(b.bookingDate).toISOString().split("T")[0]}
              </TableCell>
              <TableCell className="text-dark dark:text-white">
                {b.room?.name || "-"}
              </TableCell>
              <TableCell className="space-x-2">
                <button
                  onClick={() => {
                    setCurrentBooking(b);
                    setFormData({
                      bookingDate: new Date(b.bookingDate),
                      roomId: b.roomId.toString(),
                    });
                    setModalOpen(true);
                  }}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900"
                >
                  Hapus
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 dark:text-white">
              {currentBooking ? "Edit Booking" : "Buat Booking Baru"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                  Tanggal Booking
                </label>
                <DatePicker
                  selected={formData.bookingDate}
                  onChange={(d: Date | null) =>
                    setFormData((f) => ({
                      ...f,
                      bookingDate: d || new Date(),
                    }))
                  }
                  dateFormat="yyyy-MM-dd"
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                  Pilih Ruangan
                </label>
                <select
                  value={formData.roomId}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, roomId: e.target.value }))
                  }
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  required
                >
                  <option value="">-- Pilih --</option>
                  {rooms.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name} — Rp{standardFormat(r.price)}
                    </option>
                  ))}
                </select>
              </div>
              {error && <p className="text-red-500 dark:text-red-400 text-sm mt-4">{error}</p>}
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                  disabled={submitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}