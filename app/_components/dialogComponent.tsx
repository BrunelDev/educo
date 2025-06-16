"use client"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { JSX } from "react"

export function DialogComponent({
  dialoTrigger,
  dialogContent,
  className,
  dialogTitle,
  open,
  onOpenChange,
}: {
  dialoTrigger: JSX.Element;
  dialogContent: JSX.Element;
  className?: string;
  dialogTitle: string | null;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{dialoTrigger}</DialogTrigger>
      <DialogContent className={className}>
        {dialogTitle && (
          <DialogHeader>
            <DialogTitle>{dialogTitle}</DialogTitle>
          </DialogHeader>
        )}
        {dialogContent}
      </DialogContent>
    </Dialog>
  );
}
