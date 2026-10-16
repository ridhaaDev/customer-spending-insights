"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button, Modal } from "@/components/ui";
import { api } from "@/lib/api";
import type { CategoryCreate } from "@/lib/types";
import { CategoryForm } from "./CategoryForm";

interface Props {
  customerId: string;
  colors: string[] | undefined;
  icons: string[] | undefined;
}

export function AddCategoryDialog({ customerId, colors, icons }: Props) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (body: CategoryCreate) => api.createCategory(customerId, body),
    onSuccess: async () => {
      // The category list feeds every filter and form for this customer.
      await queryClient.invalidateQueries({ queryKey: ["customer", customerId] });
      setOpen(false);
    },
  });

  const onOpenChange = (next: boolean) => {
    if (next) create.reset();
    setOpen(next);
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      size="lg"
      title="Add category"
      description="A new category for this customer, available straight away when recording transactions."
      trigger={
        <Button variant="primary">
          <Plus className="h-4 w-4" aria-hidden /> Add category
        </Button>
      }
    >
      <CategoryForm
        colors={colors}
        icons={icons}
        onSubmit={(body) => create.mutate(body)}
        onCancel={() => setOpen(false)}
        submitting={create.isPending}
        error={create.error?.message ?? null}
      />
    </Modal>
  );
}
