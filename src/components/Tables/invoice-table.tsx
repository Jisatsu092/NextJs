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
import { useEffect, useState } from "react";

interface Booking {
  id: string;  // Tambahkan ID
  bookingDate: string;
  room: {
    name: string;
    price: number;
  };
  user: {      // Tambahkan user
    name: string;
  };
}

export function TopChannels({ className }: { className?: string }) {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('No access token found');
        }

        const response = await fetch(
          'https://simaru.amisbudi.cloud/api/bookings',
          {
            headers: {
              'Authorization': `Bearer ${accessToken}`,
            },
            credentials: 'include'
          }
        );

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const { data } = await response.json();
        setData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading data...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">Error: {error}</div>;
  }

  return (
    <div
      className={cn(
        "grid rounded-[10px] bg-white px-7.5 pb-4 pt-7.5 shadow-1 dark:bg-gray-dark dark:shadow-card",
        className
      )}
    >
      <h2 className="mb-4 text-body-2xlg font-bold text-dark dark:text-white">
        Booking List
      </h2>

      <Table>
        <TableHeader>
          <TableRow className="border-none uppercase [&>th]:text-center">
            <TableHead className="w-12">NO</TableHead>
            <TableHead className="min-w-[150px]">Room</TableHead>
            <TableHead>Booking Date</TableHead>
            <TableHead>Booked By</TableHead>
            <TableHead className="!text-right">Price</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((booking, index) => (
            <TableRow
              className="text-center text-base font-medium text-dark dark:text-white"
              key={booking.id}  // Gunakan ID sebagai key
            >
              <TableCell className="font-medium">{index + 1}</TableCell>
              
              <TableCell className="text-left">{booking.room.name}</TableCell>

              <TableCell>
                {new Date(booking.bookingDate).toLocaleDateString('id-ID', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </TableCell>

              <TableCell>{booking.user.name}</TableCell>  {/* Tambahkan kolom Booked By */}

              <TableCell className="!text-right">
                {standardFormat(booking.room.price)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}