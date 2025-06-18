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
import toast from "react-hot-toast";

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

// Komponen CustomAlert
const CustomAlert = ({ type, message, onClose }: { type: string; message: string; onClose: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Loading selama 3 detik

    return () => clearTimeout(timer);
  }, []);

  const alertStyles = {
    info: "text-blue-800 border-blue-300 bg-blue-50 dark:text-blue-400 dark:bg-gray-800 dark:border-blue-800",
    danger: "text-red-800 border-red-300 bg-red-50 dark:text-red-400 dark:bg-gray-800 dark:border-red-800",
    success: "text-green-800 border-green-300 bg-green-50 dark:text-green-400 dark:bg-gray-800 dark:border-green-800",
    warning: "text-yellow-800 border-yellow-300 bg-yellow-50 dark:text-yellow-300 dark:bg-gray-800 dark:border-yellow-800",
    dark: "text-gray-800 border-gray-300 bg-gray-50 dark:text-gray-300 dark:bg-gray-800 dark:border-gray-600",
  };

  const buttonStyles = {
    info: "bg-blue-50 text-blue-500 hover:bg-blue-200 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700",
    danger: "bg-red-50 text-red-500 hover:bg-red-200 dark:bg-gray-800 dark:text-red-400 dark:hover:bg-gray-700",
    success: "bg-green-50 text-green-500 hover:bg-green-200 dark:bg-gray-800 dark:text-green-400 dark:hover:bg-gray-700",
    warning: "bg-yellow-50 text-yellow-500 hover:bg-yellow-200 dark:bg-gray-800 dark:text-yellow-300 dark:hover:bg-gray-700",
    dark: "bg-gray-50 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
  };

  return (
    <div
      id={`alert-border-${type}`}
      className={cn(
        "flex items-center p-4 mb-4 border-t-4 transition-transform duration-500 ease-in-out relative",
        alertStyles[type as keyof typeof alertStyles],
        isVisible ? "translate-x-0" : "translate-x-full"
      )}
      role="alert"
    >
      {isLoading && (
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 animate-pulse" />
      )}
      <svg
        className="shrink-0 w-4 h-4"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <div className="ms-3 text-sm font-medium">
        {message}{" "}
        <a href="#" className="font-semibold underline hover:no-underline">
          example link
        </a>
        . Give it a click if you like.
      </div>
      <button
        type="button"
        className={cn(
          "ms-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 hover:bg-blue-200 inline-flex items-center justify-center h-8 w-8",
          buttonStyles[type as keyof typeof buttonStyles]
        )}
        onClick={() => {
          setIsVisible(false);
          setTimeout(onClose, 500); // Menunggu animasi selesai sebelum menutup
        }}
        aria-label="Close"
      >
        <span className="sr-only">Dismiss</span>
        <svg
          className="w-3 h-3"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 14 14"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
          />
        </svg>
      </button>
    </div>
  );
};

// Komponen Rooms
export function Rooms({ className }: { className?: string }) {
  const [data, setData] = useState<Room[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState("");
  const [roomName, setRoomName] = useState("");
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState(0);
  const [price, setPrice] = useState(0);
  const [capacity, setCapacity] = useState(0);
  const [description, setDescription] = useState("");
  const [roomId, setRoomId] = useState(0);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [categoriesError, setCategoriesError] = useState("");
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const fetchData = async (page: number, perPage: number) => {
    try {
      const response = await getRooms(page, perPage);
      setData(response.data);
      setTotalPages(response.totalPages);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Gagal memuat data ruangan");
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    setIsLoadingCategories(true);
    setCategoriesError("");
    try {
      const categoriesData = await getCategories();
      if (Array.isArray(categoriesData)) {
        setCategories(categoriesData);
      } else {
        throw new Error("Format kategori tidak valid");
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setCategoriesError(
        err instanceof Error ? err.message : "Gagal memuat kategori"
      );
    } finally {
      setIsLoadingCategories(false);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await Promise.all([fetchData(currentPage, itemsPerPage), fetchCategories()]);
    };
    initializeData();
  }, [currentPage, itemsPerPage]);

  const handleOpenModal = async () => {
    if (categories.length === 0) {
      await fetchCategories();
    }
    setIsModalOpen(true);
    setIsEdit(false);
    resetForm();
  };

  const handleEdit = async (room: Room) => {
    try {
      if (categories.length === 0) {
        await fetchCategories();
      }
      setRoomId(room.id);
      setName(room.name);
      setCategoryId(room.categoryId);
      setPrice(room.price);
      setCapacity(room.capacity);
      setDescription(room.description);
      setIsEdit(true);
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
        toast.success("Ruangan berhasil dihapus");
        await fetchData(currentPage, itemsPerPage);
      } catch (error) {
        console.error("Error deleting room:", error);
        toast.error(
          `Gagal menghapus ruangan: ${
            error instanceof Error ? error.message : "Unknown error"
          }`
        );
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name || !categoryId || !price || !capacity || !description) {
      setError("Semua field harus diisi");
      toast.error("Semua field harus diisi");
      return;
    }

    try {
      setIsLoadingCategories(true);
      const roomData = {
        name,
        categoryId,
        price,
        capacity,
        description,
      };

      if (isEdit) {
        const response = await updateRoom(roomId, roomData);
        setMessage(response.message || "Ruangan berhasil diperbarui");
        setRoomName(roomData.name);
      } else {
        const response = await createRoom(roomData);
        setMessage(response.message || "Ruangan berhasil ditambahkan");
        setRoomName(roomData.name);
      }

      setIsSuccess(true);
      setIsModalOpen(false);
      setTimeout(() => setIsSuccess(false), 3000);
      await fetchData(currentPage, itemsPerPage);
      resetForm();
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menyimpan ruangan";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoadingCategories(false);
    }
  };

  const resetForm = () => {
    setName("");
    setCategoryId(0);
    setPrice(0);
    setCapacity(0);
    setDescription("");
    setRoomId(0);
    setError("");
    setIsEdit(false);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newItemsPerPage = Number(e.target.value);
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={cn(
            "px-4 py-2 rounded-md transition-colors",
            currentPage === i
              ? "bg-blue-600 text-white dark:bg-blue-500"
              : "bg-gray-100 text-dark hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          )}
        >
          {i}
        </button>
      );
    }

    return items;
  };

  const sortedData = [...data].sort((a, b) => {
    const nameA = a.name || '';
    const nameB = b.name || '';
    return sortOrder === 'asc'
      ? nameA.localeCompare(nameB)
      : nameB.localeCompare(nameA);
  });

  if (error) {
    return (
      <CustomAlert
        type="danger"
        message={error}
        onClose={() => setError("")}
      />
    );
  }

  if (loading) {
    return (
      <div
        className={cn(
          "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
          className
        )}
      >
        <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
          Daftar Ruangan
        </h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-dark dark:text-white">Nama</TableHead>
              <TableHead className="text-dark dark:text-white">Kategori</TableHead>
              <TableHead className="text-dark dark:text-white">Harga</TableHead>
              <TableHead className="text-dark dark:text-white">Kapasitas</TableHead>
              <TableHead className="text-dark dark:text-white">Deskripsi</TableHead>
              <TableHead className="text-dark dark:text-white">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell colSpan={6}>
                  <div className="h-8 bg-gray-200 rounded animate-pulse dark:bg-gray-600" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
      {isSuccess && (
        <div role="alert" className="rounded-md border border-gray-300 bg-white p-4 shadow-sm mb-4">
          <div className="flex items-start gap-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-green-600">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="flex-1">
              <strong className="font-medium text-gray-900">{message}</strong>
              <p className="mt-0.5 text-sm text-gray-700">Your data {roomName} have been saved.</p>
            </div>
            <button
              className="-m-3 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-gray-50 hover:text-gray-700"
              type="button"
              onClick={() => setIsSuccess(false)}
              aria-label="Dismiss alert"
            >
              <span className="sr-only">Dismiss popup</span>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-body-2xlg font-bold text-dark dark:text-white">
          Daftar Ruangan
        </h2>
        <button
          onClick={handleOpenModal}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600"
        >
          Tambah Ruangan
        </button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="text-dark dark:text-white cursor-pointer"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              Nama {sortOrder === 'asc' ? '↑' : '↓'}
            </TableHead>
            <TableHead className="text-dark dark:text-white">Kategori</TableHead>
            <TableHead className="text-dark dark:text-white">Harga</TableHead>
            <TableHead className="text-dark dark:text-white">Kapasitas</TableHead>
            <TableHead className="text-dark dark:text-white">Deskripsi</TableHead>
            <TableHead className="text-dark dark:text-white">Aksi</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedData.map((room) => (
            <TableRow key={room.id}>
              <TableCell className="text-dark dark:text-white">{room.name}</TableCell>
              <TableCell className="text-dark dark:text-white">
                {categories.find((c) => c.id === room.categoryId)?.name || "Tidak ada kategori"}
              </TableCell>
              <TableCell className="text-dark dark:text-white">
                Rp{room.price.toLocaleString("id-ID")}
              </TableCell>
              <TableCell className="text-dark dark:text-white">{room.capacity} orang</TableCell>
              <TableCell className="text-dark dark:text-white">{room.description}</TableCell>
              <TableCell className="space-x-2">
                <button
                  onClick={() => handleEdit(room)}
                  className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(room.id)}
                  className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900"
                >
                  Hapus
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-6">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-dark dark:text-white">Tampilkan:</span>
          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            className="p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          >
            {[10, 20, 30, 40, 50, 60, 70, 80, 90, 100].map((size) => (
              <option key={size} value={size}>
                {size} per halaman
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={cn(
              "px-4 py-2 rounded-md transition-colors",
              currentPage === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                : "bg-gray-100 text-dark hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            )}
          >
            Sebelumnya
          </button>
          {getPaginationItems()}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={cn(
              "px-4 py-2 rounded-md transition-colors",
              currentPage === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400"
                : "bg-gray-100 text-dark hover:bg-gray-200 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
            )}
          >
            Selanjutnya
          </button>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-700 p-6 rounded-lg w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold dark:text-white">
                {isEdit ? "Edit Ruangan" : "Tambah Ruangan Baru"}
              </h3>
              <button
                type="button"
                onClick={() => {
                  setIsModalOpen(false);
                  resetForm();
                }}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                  Nama Ruangan
                </label>
                <input
                  type="text"
                  required
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                  Kategori
                </label>
                <select
                  required
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={categoryId}
                  onChange={(e) => setCategoryId(Number(e.target.value))}
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
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
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
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1 dark:text-gray-200">
                  Deskripsi
                </label>
                <textarea
                  required
                  className="w-full p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              {error && (
                <p className="text-red-500 dark:text-red-400 text-sm mt-4">{error}</p>
              )}
              <div className="flex justify-end gap-2 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400 dark:bg-gray-600 dark:hover:bg-gray-500 dark:text-white"
                >
                  Kembali
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 disabled:opacity-50"
                  disabled={isLoadingCategories}
                >
                  {isLoadingCategories ? "Menyimpan..." : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}