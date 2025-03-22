import {
  PopoverContent as Content,
  Popover as PopoverComponent,
  PopoverTrigger as Trigger,
} from "@/components/ui/popover";
import { JSX } from "react";

export function Popover({
  PopoverContent,
  PopoverTrigger,
  className,
}: {
  PopoverContent: JSX.Element;
    PopoverTrigger: JSX.Element;
    className? : string;
}) {
  return (
    <PopoverComponent>
      <Trigger asChild className={className ? className : ""}>{PopoverTrigger}</Trigger>
      <Content className="w-fit p-0">{PopoverContent}</Content>
    </PopoverComponent>
  );
}
