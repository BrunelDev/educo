import {
  PopoverContent as Content,
  Popover as PopoverComponent,
  PopoverTrigger as Trigger,
} from "@/components/ui/popover";
import { JSX } from "react";

export function Popover({
  PopoverContent,
  PopoverTrigger,
}: {
  PopoverContent: JSX.Element;
  PopoverTrigger: JSX.Element;
}) {
  return (
    <PopoverComponent>
      <Trigger asChild>{PopoverTrigger}</Trigger>
      <Content className="w-fit p-0">{PopoverContent}</Content>
    </PopoverComponent>
  );
}
