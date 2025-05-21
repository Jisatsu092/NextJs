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
    return Math.floor(Math.random() * 1000) + 1; // Menghasilkan angka acak antara 1 dan 1000
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
      userId: currentBooking?.user?.id ?? generateRandomUserId(), // Gunakan userId yang ada atau buat baru
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

  if (loading) return <div className="p-4 text-center">Memuat data...</div>;
  if (error) return <div className="p-4 bg-red-100 text-red-700">{error}</div>;

  return (
    <div className={cn("bg-white p-6 rounded shadow", className)}>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Daftar Booking</h2>
        <button
          onClick={() => {
            resetForm();
            setModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Tambah Booking
        </button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Tanggal</TableHead>
            <TableHead>Ruangan</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((b) => (
            <TableRow key={b.id}>
              <TableCell>
                {new Date(b.bookingDate).toISOString().split("T")[0]}
              </TableCell>
              <TableCell>{b.room?.name || "-"}</TableCell>
              <TableCell>
                <button
                  onClick={() => {
                    setCurrentBooking(b);
                    setFormData({
                      bookingDate: new Date(b.bookingDate),
                      roomId: b.roomId.toString(),
                    });
                    setModalOpen(true);
                  }}
                  className="text-blue-500 hover:underline"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="text-red-500 hover:underline ml-2"
                >
                  Hapus
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h3 className="text-lg font-bold mb-4">
              {currentBooking ? "Edit Booking" : "Buat Booking Baru"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block mb-1">Tanggal Booking</label>
                <DatePicker
                  selected={formData.bookingDate}
                  onChange={(d: Date | null) =>
                    setFormData((f) => ({
                      ...f,
                      bookingDate: d || new Date(),
                    }))
                  }
                  dateFormat="yyyy-MM-dd"
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
              <div>
                <label className="block mb-1">Pilih Ruangan</label>
                <select
                  value={formData.roomId}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, roomId: e.target.value }))
                  }
                  className="w-full border px-2 py-1 rounded"
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
              {error && <p className="text-red-600">{error}</p>}
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-gray-300 rounded"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
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