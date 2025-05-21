"use client";

import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getRooms, createRoom, getCategories, updateRoom, deleteRoom, getRoom } from "../fetch";
import { cn } from "@/lib/utils";

interface Room {
  id: number;
  name: string;
  categoryId: number;
  price: number;
  capacity: number;
  description: string;
}

interface Category {
  id: number;
  name: string;
}

export function Rooms({ className }: { className?: string }) {
  const [data, setData] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    price: '',
    capacity: '',
    description: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState('');
  const [editRoomId, setEditRoomId] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const rooms = await getRooms();
      setData(rooms);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Gagal memuat data ruangan");
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    setCategoriesError('');
    try {
      const categoriesData = await getCategories();
      if (Array.isArray(categoriesData)) {
        setCategories(categoriesData);
      } else {
        throw new Error("Format kategori tidak valid");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategoriesError(err instanceof Error ? err.message : 'Gagal memuat kategori');
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchData();
      await fetchCategories();
    };
    initializeData();
  }, []);

  const handleOpenModal = async () => {
    if (categories.length === 0) {
      await fetchCategories();
    }
    setIsModalOpen(true);
  };

  const handleEdit = async (id: number) => {
    try {
      // Pastikan kategori sudah dimuat
      if (categories.length === 0) {
        await fetchCategories();
      }
      
      const room = await getRoom(id);
      setFormData({
        name: room.name,
        categoryId: room.categoryId.toString(),
        price: room.price.toString(),
        capacity: room.capacity.toString(),
        description: room.description
      });
      setEditRoomId(id);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching room data:", error);
      setError("Gagal memuat data ruangan untuk diedit");
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus ruangan ini?")) {
      try {
        await deleteRoom(id);
        await fetchData();
      } catch (error) {
        console.error("Error deleting room:", error);
        setError(`Gagal menghapus ruangan: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const roomData = {
        name: formData.name,
        categoryId: Number(formData.categoryId),
        price: Number(formData.price),
        capacity: Number(formData.capacity),
        description: formData.description
      };

      if (editRoomId) {
        await updateRoom(editRoomId, roomData);
      } else {
        await createRoom(roomData);
      }

      await fetchData();
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan saat menyimpan ruangan');
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      categoryId: '',
      price: '',
      capacity: '',
      description: ''
    });
    setEditRoomId(null);
  };

  if (error) {
    return (
      <div className={cn("p-4 rounded-[10px] bg-red-100 text-red-700", className)}>
        {error}
      </div>
    );
  }

  if (loading) {
    return (
      <div className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className
      )}>
        <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
          Daftar Ruangan
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Kategori</TableHead>
              <TableHead>Harga</TableHead>
              <TableHead>Kapasitas</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={6}>
                  <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  return (
    <div className={cn(
      "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
      className
    )}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Daftar Ruangan
        </h2>
        <button
          onClick={handleOpenModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tambah Ruangan
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg w-full max-w-md">
            <h3 className="text-lg font-bold mb-4 dark:text-white">
              {editRoomId ? 'Edit Ruangan' : 'Tambah Ruangan Baru'}
            </h3>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                    Nama Ruangan
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                    Kategori
                  </label>
                  <select
                    required
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                    disabled={isLoadingCategories}
                  >
                    <option value="">Pilih Kategori</option>
                    {isLoadingCategories ? (
                      <option>Memuat kategori...</option>
                    ) : categoriesError ? (
                      <option className="text-red-500">{categoriesError}</option>
                    ) : (
                      categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                    Harga
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                    Kapasitas
                  </label>
                  <input
                    type="number"
                    required
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                    Deskripsi
                  </label>
                  <textarea
                    required
                    className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>
              </div>

              {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                  disabled={submitting}
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
                  disabled={submitting}
                >
                  {submitting ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nama</TableHead>
            <TableHead>Kategori</TableHead>
            <TableHead>Harga</TableHead>
            <TableHead>Kapasitas</TableHead>
            <TableHead>Deskripsi</TableHead>
            <TableHead>Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((room) => (
            <TableRow key={room.id}>
              <TableCell>{room.name}</TableCell>
              <TableCell>
                {categories.find(c => c.id === room.categoryId)?.name || 'Memuat...'}
              </TableCell>
              <TableCell>Rp{room.price.toLocaleString("id-ID")}</TableCell>
              <TableCell>{room.capacity} orang</TableCell>
              <TableCell>{room.description}</TableCell>
              <TableCell className="space-x-2">
                <button
                  onClick={() => handleEdit(room.id)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 px-2 py-1 rounded hover:bg-blue-50"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(room.id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 px-2 py-1 rounded hover:bg-red-50"
                >
                  Hapus
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}