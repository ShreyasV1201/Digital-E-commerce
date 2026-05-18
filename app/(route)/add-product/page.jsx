"use client"

import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import ImageUpload from "../add-product/_components/ImageUpload";
import { useState, useEffect } from "react";
import axios from "axios";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function AddProduct() {
  const categoryOption = [
    "Source code",
    "UI Kit",
    "Icons",
    "Documents",
    "Fonts",
    "Themes",
    "Video",
    "Illustration",
    "Other",
  ];

  const [formData, setFormData] = useState({});
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        userEmail: user?.primaryEmailAddress?.emailAddress,
      }));
    }
  }, [user]);

  const handleInputChange = (fieldName, fieldValue) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const onAddProductBtnClick = async () => {
    if (
      !formData.title ||
      !formData.price ||
      !formData.category ||
      !formData.description ||
      !formData.image ||
      !formData.file ||
      !formData.userEmail
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    console.log("FORMDATA STATE:", formData);

    setLoading(true);

    const formDataObj = new FormData();
    formDataObj.append("image", formData.image);
    formDataObj.append("file", formData.file);
    formDataObj.append("data", JSON.stringify(formData));

    try {
      const result = await axios.post("/api/add-product", formDataObj);
      console.log(result);
      toast.success("New product added successfully!");
    } catch (error) {
      console.error("ADD PRODUCT ERROR:", error?.response?.data || error);
      toast.error("Failed to add product");
    }

    setLoading(false);
  };

  return (
    <div className="mt-10">
      <h2 className="text-3xl font-bold">Add New Product</h2>
      <p>Start adding product details to sell your item</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-10">
        <div className="flex flex-col gap-5">
          <ImageUpload onImageSelect={(file) => handleInputChange("image", file)} />

          <div>
            <h4>Upload File which you want to sell</h4>
            <Input
              type="file"
              name="file"
              onChange={(e) => handleInputChange(e.target.name, e.target.files[0])}
            />
          </div>

          <div>
            <h4>Message to User</h4>
            <Textarea
              name="message"
              placeholder="Write Thank You message to User"
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <h4>Product Title</h4>
            <Input
              name="title"
              placeholder="Ex.UI Kit in Figma"
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            />
          </div>

          <div>
            <h4>Price</h4>
            <Input
              type="number"
              name="price"
              placeholder="Ex.$99"
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            />
          </div>

          <div>
            <h4>Category</h4>
            <Select onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent className="z-50 bg-white">
                {categoryOption?.map((category, index) => (
                  <SelectItem key={index} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <h4>Description</h4>
            <Textarea
              name="description"
              placeholder="Add Product description"
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            />
          </div>

          <div>
            <h4>About Product (Optional)</h4>
            <Textarea
              name="about"
              placeholder="Add Product Information"
              onChange={(e) => handleInputChange(e.target.name, e.target.value)}
            />
          </div>

          <Button onClick={onAddProductBtnClick} disabled={loading}>
            {loading ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : "Add Product"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;  