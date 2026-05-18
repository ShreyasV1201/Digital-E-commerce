import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { PenBox, ChartLine, Trash2 } from "lucide-react";
import DeleteConfirmationDialog from './DeleteConfirmationDialog';

function ProductEditableOption({ children, onDelete }) {
  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent className="min-w-[150px] p-2 bg-white ml-2 border-2 border-r-4 border-b-4 border-black rounded-none shadow-none">
        <ul className="w-full">
          <li className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer w-full hover:!bg-[#f1f5f9]">
            <PenBox size={18} />
            <span>Edit</span>
          </li>

          <li className="flex items-center gap-2 px-3 py-2 rounded-md cursor-pointer w-full hover:!bg-[#f1f5f9]">
            <ChartLine size={18} />
            <span>Analytics</span>
          </li>
          <li className="px-3 py-2 rounded-md hover:!bg-[#f1f5f9]">
            <DeleteConfirmationDialog onConfirm={onDelete}>
              <div className="flex items-center gap-2 cursor-pointer">
                <Trash2 size={18} style={{ color: "#dc2626" }} />
                <span style={{ color: "#dc2626" }}>Delete</span>
              </div>
            </DeleteConfirmationDialog>
          </li>
        </ul>
      </PopoverContent>
    </Popover>
  );
}

export default ProductEditableOption;