import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function SortProducts({ onSortChange }) {
  const list = [
    {
      label: "NEWEST",
      field: "id",
      order: "desc",
    },
    {
      label: "PRICE (Low to High)",
      field: "price",
      order: "asc",
    },
    {
      label: "PRICE (High to Low)",
      field: "price",
      order: "desc",
    },
    {
      label: "Most Viewed",
      field: "id",
      order: "desc",
    },
  ];

  return (
    <div>
      <Select onValueChange={(value) => onSortChange(JSON.parse(value))}>
        <SelectTrigger className="w-[180px] bg-white text-black border border-black">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>

        <SelectContent className="bg-white text-black border border-black shadow-md z-50">
          {list.map((option, index) => (
            <SelectItem
              key={index}
              value={JSON.stringify(option)}
              className="bg-white text-black hover:bg-gray-100"
            >
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default SortProducts;