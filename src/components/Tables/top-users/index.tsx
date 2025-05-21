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
import { Button } from "@/components/ui/button";
import { getUsers, User } from "../fetch";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export function Users({ className }: { className?: string }) {
  const [data, setData] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async (page: number = 1) => {
    try {
      const { data: users, totalPages } = await getUsers(page);
      
      if (!users || users.length === 0) {
        setError('Tidak ada data yang tersedia');
        return;
      }
      
      setData(users);
      setTotalPages(totalPages);
      setError('');
    } catch (error) {
      console.error("Error fetching data:", error);
      setError(error instanceof Error ? error.message : 'Gagal memuat data user');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(currentPage);
  }, [currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (loading) {
    return <div className="space-y-4">
      <Skeleton className="h-[40px] w-full" />
      <Skeleton className="h-[20px] w-full" />
      <Skeleton className="h-[20px] w-full" />
    </div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className={cn("rounded-lg border", className)}>
      {/* Perbaikan struktur table */}
      <div className="relative w-full overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nama</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Dibuat Pada</TableHead>
              <TableHead>Diperbarui Pada</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 ? (
              data.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>{new Date(user.updatedAt).toLocaleDateString()}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-4">
                  Tidak ada data yang tersedia
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex justify-between items-center p-4 border-t">
        <div className="text-sm text-muted-foreground">
          Halaman {currentPage} dari {totalPages}
        </div>
        
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "ghost"}
              size="sm"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}