import {
  PopoverContent as Content,
  Popover,
  PopoverTrigger as Trigger,
} from "@/components/ui/popover";
import { JSX } from "react";

export function PopoverDemo({
  PopoverContent,
  PopoverTrigger,
}: {
  PopoverContent: JSX.Element;
  PopoverTrigger: JSX.Element;
}) {
  return (
    <Popover>
      <Trigger asChild>{PopoverTrigger}</Trigger>
      <Content className="w-80">{PopoverContent}</Content>
    </Popover>
  );
}
