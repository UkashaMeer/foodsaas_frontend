
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useCreateCategory } from "@/api/admin/category/useCreateCategory";
import { toast } from "sonner";
import { useUpdateCategory } from "@/api/admin/category/useUpdateCategory";
import { useQueryClient } from "@tanstack/react-query";

export default function CategoryFormSheet({ category, open, onOpenChange, onSave }) {

  const queryClient = useQueryClient();
  const { mutate: createCategoryMutate, isPending: createCategoryIsPending } = useCreateCategory()
  const { mutate: updateCategoryMutate, isPending: updateCategoryIsPending } = useUpdateCategory()
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    images: ["https://avatar.iran.liara.run/public"],
    isActive: true
  });
  const [imagePreview, setImagePreview] = useState("https://avatar.iran.liara.run/public");

  useEffect(() => {
    if (category) {
      console.log("Editing category:", category)
      setFormData({
        name: category.name,
        description: category.description,
        images: category.images,
        isActive: category.isActive
      });
      setImagePreview(category.images && category.images.length > 0 ? category.images[0] : "https://avatar.iran.liara.run/public");
    } else {
      setFormData({
        name: "",
        description: "",
        images: ["https://avatar.iran.liara.run/public"],
        isActive: true
      });
      setImagePreview("https://avatar.iran.liara.run/public");
    }
  }, [category, open]);

  // Form submit handler mein
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Form submitted:", { category, formData });

    if (category) {
      // Edit case
      const payload = {
        name: formData.name,
        description: formData.description,
        isActive: formData.isActive
      }

      const file = formData.images[0]
      const id = category?._id

      console.log("Update payload:", { id, payload, file });

      updateCategoryMutate({ id, payload, file }, {
        onSuccess: (res) => {
          console.log("Update success full response:", res);
          
          // API response structure: { status, message, category }
          const updatedCategory = res.category || res.data?.category || res.data || res;
          console.log("Extracted updated category:", updatedCategory);
          
          if (updatedCategory && updatedCategory._id) {
            onSave(updatedCategory, true);
            toast.success("Category updated successfully.");
            queryClient.invalidateQueries(["categories"]);
          } else {
            console.error("Invalid category data in response:", updatedCategory);
            toast.error("Received invalid data from server");
          }
        },
        onError: (err) => {
          console.error("Update error:", err);
          console.error("Update error response:", err.response);
          toast.error(err.response?.data?.message || "Something went wrong in updating category!");
        }
      })
    } else {
      // Create case
      const payload = {
        name: formData.name,
        description: formData.description,
        isActive: formData.isActive
      }

      const file = formData.images[0]

      console.log("Create payload:", { payload, file });

      createCategoryMutate({ payload, file }, {
        onSuccess: (res) => {
          console.log("Create success full response:", res);
          
          // API response structure: { status, message, category }
          const newCategory = res.category || res.data?.category || res.data || res;
          console.log("Extracted new category:", newCategory);
          
          if (newCategory && newCategory._id) {
            onSave(newCategory, false);
            toast.success("Category created successfully.");
            queryClient.invalidateQueries(["categories"]);
          } else {
            console.error("Invalid category data in response:", newCategory);
            toast.error("Received invalid data from server");
          }
        },
        onError: (err) => {
          console.error("Create error:", err);
          console.error("Create error response:", err.response);
          toast.error(err.response?.data?.message || "Something went wrong in creating category!");
        }
      })
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log("File selected:", file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData(prev => ({
        ...prev,
        images: [file],
      }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? "Edit Category" : "Add New Category"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <div>
            <Label>Category Image</Label>
            <div className="flex items-center space-x-4 mt-2">
              <div className="shrink-0">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="h-16 w-16 rounded-lg object-cover"
                />
              </div>
              <div className="flex-1">
                <Input
                  disabled={createCategoryIsPending || updateCategoryIsPending}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="name">
              Name *
            </Label>
            <Input
              type="text"
              id="name"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Enter category name"
              className="mt-1"
              disabled={createCategoryIsPending || updateCategoryIsPending}
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">
              Description
            </Label>
            <Textarea
              id="description"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Enter category description"
              className="mt-1"
              disabled={createCategoryIsPending || updateCategoryIsPending}
            />
          </div>

          {/* Active Toggle */}
          <div className="flex items-center space-x-2">
            <Checkbox
              disabled={createCategoryIsPending || updateCategoryIsPending}
              id="isActive"
              checked={formData.isActive}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
            />
            <Label htmlFor="isActive" className="text-sm font-normal">
              Active Category
            </Label>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createCategoryIsPending || updateCategoryIsPending}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={createCategoryIsPending || updateCategoryIsPending}
            >
              {createCategoryIsPending || updateCategoryIsPending ? (
                "Processing..."
              ) : (
                category ? "Update" : "Create"
              )} Category
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}