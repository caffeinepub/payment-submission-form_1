import React, { useState } from 'react';
import { useGetAllPaymentRecords } from '@/hooks/useQueries';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, Users, DollarSign, CreditCard, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';

interface AdminPanelProps {
  password: string;
}

function formatTimestamp(ts: bigint): string {
  // Backend stores nanoseconds
  const ms = Number(ts / BigInt(1_000_000));
  const date = new Date(ms);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function formatAmount(amount: bigint): string {
  // Amount stored as cents
  const dollars = Number(amount) / 100;
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(dollars);
}

export default function AdminPanel({ password }: AdminPanelProps) {
  const queryClient = useQueryClient();
  const { data: records, isLoading, isError, error } = useGetAllPaymentRecords(password, true);

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['paymentRecords', password] });
  };

  const totalAmount = records?.reduce((sum, r) => sum + Number(r.amount), 0) ?? 0;
  const totalDollars = totalAmount / 100;

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-4 border border-border shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Total Submissions</div>
            <div className="text-2xl font-display font-bold text-foreground">
              {isLoading ? <Skeleton className="h-7 w-12" /> : (records?.length ?? 0)}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-border shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-sky-600" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Total Amount</div>
            <div className="text-2xl font-display font-bold text-foreground">
              {isLoading ? (
                <Skeleton className="h-7 w-20" />
              ) : (
                new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalDollars)
              )}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 border border-border shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground font-medium">Avg. Transaction</div>
            <div className="text-2xl font-display font-bold text-foreground">
              {isLoading ? (
                <Skeleton className="h-7 w-16" />
              ) : records && records.length > 0 ? (
                new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalDollars / records.length)
              ) : (
                '$0.00'
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-border">
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            <h3 className="font-semibold text-foreground">Payment Records</h3>
            {records && (
              <Badge variant="secondary" className="text-xs">
                {records.length} records
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="rounded-xl text-xs gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </Button>
        </div>

        {isError && (
          <div className="p-6 text-center text-destructive text-sm">
            Failed to load records. {error instanceof Error ? error.message : 'Please try again.'}
          </div>
        )}

        {isLoading && (
          <div className="p-4 space-y-3">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded-lg" />
            ))}
          </div>
        )}

        {!isLoading && !isError && records && records.length === 0 && (
          <div className="p-12 text-center text-muted-foreground">
            <CreditCard className="w-10 h-10 mx-auto mb-3 opacity-30" />
            <p className="font-medium">No payment records yet</p>
            <p className="text-sm mt-1">Submitted payments will appear here</p>
          </div>
        )}

        {!isLoading && !isError && records && records.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40 hover:bg-muted/40">
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">Name</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">Email</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">Card</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">Expiry</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">Amount</TableHead>
                  <TableHead className="font-semibold text-xs uppercase tracking-wider">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record, idx) => (
                  <TableRow key={idx} className="hover:bg-emerald-50/50 transition-colors">
                    <TableCell className="font-medium">{record.fullName}</TableCell>
                    <TableCell className="text-muted-foreground text-sm">{record.email}</TableCell>
                    <TableCell>
                      <span className="font-mono text-sm bg-slate-100 px-2 py-0.5 rounded-md">
                        •••• •••• •••• {record.maskedCardNumber}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{record.expirationDate}</TableCell>
                    <TableCell>
                      <span className="font-semibold text-emerald-700">
                        {formatAmount(record.amount)}
                      </span>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm whitespace-nowrap">
                      {formatTimestamp(record.timestamp)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
