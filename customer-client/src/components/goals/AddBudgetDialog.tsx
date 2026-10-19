"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useState } from "react";
import { Button, Modal } from "@/components/ui";
import { api } from "@/lib/api";
import type { CategoryFilter, GoalCreate } from "@/lib/types";
import { GoalForm } from "./GoalForm";

interface Props {
  // Trigger button size; "sm" suits a card header.
  size?: "sm" | "md";
  customerId: string;
  categories: CategoryFilter[] | undefined;
  budgeted: string[] | undefined;
}

export function AddBudgetDialog({ customerId, categories, budgeted, size = "md" }: Props) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const create = useMutation({
    mutationFn: (body: GoalCreate) => api.createGoal(customerId, body),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["customer", customerId, "goals"] });
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
      title="Add budget"
      description="A monthly limit for one category. Spend so far this month counts against it immediately."
      trigger={
        <Button variant="primary" size={size}>
          <Plus className="h-4 w-4" aria-hidden /> Add budget
        </Button>
      }
    >
      <GoalForm
        categories={categories}
        budgeted={budgeted}
        onSubmit={(body) => create.mutate(body)}
        onCancel={() => setOpen(false)}
        submitting={create.isPending}
        error={create.error?.message ?? null}
      />
    </Modal>
  );
}
