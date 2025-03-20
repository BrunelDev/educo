import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DialogTitle } from "@radix-ui/react-dialog"

import { JSX } from "react"

export function DialogComponent({dialoTrigger, dialogContent, className, dialogTitle} : {dialoTrigger : JSX.Element, dialogContent : JSX.Element, className? : string, dialogTitle: string | null}) {
  return (
      <Dialog >
      <DialogTrigger asChild>
        {dialoTrigger}
      </DialogTrigger>
      <DialogTitle>{dialogTitle}</DialogTitle>
      <DialogContent className={`${className}`}>
        {dialogContent}
      </DialogContent>
    </Dialog>
    
  )
}
