"use client";

import { useCallback, useEffect, useState } from "react";
import type { OrderListItem } from "./types";

export function useOrders() {
  const [orders, setOrders] = useState<OrderListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ limit: "100" });
      if (search.trim()) params.set("search", search.trim());
      if (status) params.set("status", status);
      if (paymentStatus) params.set("paymentStatus", paymentStatus);
      const response = await fetch(`/api/admin/orders?${params}`);
      const data = await response.json();
      if (response.ok) setOrders(data.orders ?? []);
    } finally {
      setLoading(false);
    }
  }, [search, status, paymentStatus]);

  useEffect(() => {
    const timeout = setTimeout(() => void fetchOrders(), 250);
    return () => clearTimeout(timeout);
  }, [fetchOrders]);

  return { orders, loading, search, setSearch, status, setStatus, paymentStatus, setPaymentStatus };
}
