import {
  Select as SelectComponent,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function Select({
  placeholder,
  options,
  label,
  value,setValue
}: {
    value: string;
    setValue: (value: string) => void;
  placeholder: string;
  options: { value: string }[];
  label: string;
}) {
  return (
    <SelectComponent value={value} onValueChange={(e)=>setValue(e)}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>{label}</SelectLabel>
          {options.map((option, index) => (
            <SelectItem key={option.value + index} value={option.value}>
              {option.value}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </SelectComponent>
  );
}
