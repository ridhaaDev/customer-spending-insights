"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button, Modal } from "@/components/ui";
import { api } from "@/lib/api";
import type { CategoryFilter, TransactionCreate } from "@/lib/types";
import { TransactionForm } from "./TransactionForm";

interface Props {
  // Trigger button size; "sm" suits a card header.
  size?: "sm" | "md";
  customerId: string;
  categories: CategoryFilter[] | undefined;
  paymentMethods: string[] | undefined;
}

// "Add transaction" button plus the modal form; the mutation invalidates the customer's queries and closes on success.
export function AddTransactionDialog({ customerId, categories, paymentMethods, size = "md" }: Props) {
  const [open, setOpen] = useState(false);
  const [defaultDate, setDefaultDate] = useState("");
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (body: TransactionCreate) => api.createTransaction(customerId, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
      setOpen(false);
    },
  });

  const onOpenChange = (next: boolean) => {
    if (next) {
      // Computed at open time so the default is "now", not the page's render time.
      setDefaultDate(new Date().toISOString().slice(0, 16));
      create.reset();
    }
    setOpen(next);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title="Add transaction"
      description="Recorded against this customer and reflected in every view immediately."
      trigger={
        <Button variant="primary" size={size}>
          <Plus className="h-4 w-4" aria-hidden /> Add transaction
        </Button>
      }
    >
      <TransactionForm
        categories={categories}
        paymentMethods={paymentMethods}
        defaultDate={defaultDate}
        onSubmit={(body) => create.mutate(body)}
        onCancel={() => setOpen(false)}
        submitting={create.isPending}
        error={create.error?.message ?? null}
      />
    </Modal>
  );
}
