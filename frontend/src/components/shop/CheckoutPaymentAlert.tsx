"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

interface Props {
  onPaymentFailed: (orderId: string | null) => void;
}

export function CheckoutPaymentAlert({ onPaymentFailed }: Props) {
  const searchParams = useSearchParams();

  useEffect(() => {
    if (searchParams.get("status") === "failed") {
      onPaymentFailed(searchParams.get("order"));
    }
  }, [searchParams, onPaymentFailed]);

  return null;
}
