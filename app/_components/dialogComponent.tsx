import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"

import { JSX } from "react"

export function DialogComponent({dialoTrigger, dialogContent} : {dialoTrigger : JSX.Element, dialogContent : JSX.Element}) {
  return (
      <Dialog >
      <DialogTrigger asChild>
        {dialoTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[780px]">
        {dialogContent}
      </DialogContent>
    </Dialog>
    
  )
}
