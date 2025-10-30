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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useCreateItem } from "@/api/admin/product/useCreateItem";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useUpdateItem } from "@/api/admin/product/useUpdateItem";
import { useQueryClient } from "@tanstack/react-query";

export default function ItemFormSheet({ item, open, onOpenChange, onSave, categories }) {

  const queryClient = useQueryClient();
  const { mutate: createItemMutate, isPending: createItemIsPending } = useCreateItem()
  const { mutate: updateItemMutate, isPending: updateItemIsPending } = useUpdateItem()
  const [formData, setFormData] = useState({
    name: "",
    details: "",
    price: "",
    discountPrice: "",
    isOnDiscount: false,
    isAvailable: true,
    categoryId: "",
    images: [""],
    addons: []
  });
  const [imagePreview, setImagePreview] = useState("https://placehold.co/600x400");
   const isSubmitting = createItemIsPending || updateItemIsPending;

  useEffect(() => {
    if (item && open) {
      console.log("Editing item addons:", item.addons); // Debug log
      setFormData({
        name: item.name || "",
        details: item.details || "",
        price: item.price?.toString() || "",
        discountPrice: item.discountPrice?.toString() || "",
        isOnDiscount: item.isOnDiscount || false,
        isAvailable: item.isAvailable !== undefined ? item.isAvailable : true,
        categoryId: item.categoryId || "",
        images: item.images && item.images.length > 0 ? item.images : [""],
        addons: item.addons || []
      });
      setImagePreview(item.images && item.images.length > 0 ? item.images[0] : "https://placehold.co/600x400");
    } else if (open) {
      setFormData({
        name: "",
        details: "",
        price: "",
        discountPrice: "",
        isOnDiscount: false,
        isAvailable: true,
        categoryId: "",
        images: [""],
        addons: []
      });
      setImagePreview("https://placehold.co/600x400");
    }
  }, [item, open]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && open) {
        handleSubmit(e);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (item) {
      // ✅ FIXED: Process addons properly
      const processedAddons = formData.addons.map(addon => ({
        name: addon.name || "",
        isRequired: addon.isRequired || false,
        maxSelectable: addon.maxSelectable || 1,
        options: (addon.options || []).map(option => ({
          name: option.name || "",
          price: parseFloat(option.price) || 0,
          discountPrice: option.discountPrice ? parseFloat(option.discountPrice) : null,
          isAvailable: option.isAvailable !== undefined ? option.isAvailable : true
        })).filter(option => option.name && option.price > 0)
      })).filter(addon => addon.name);

      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null, // ✅ This should be discountPrice
        details: formData.details,
        categoryId: formData.categoryId,
        isOnDiscount: formData.isOnDiscount,
        isAvailable: formData.isAvailable,
        addons: processedAddons
      }

      const file = formData.images[0] instanceof File ? formData.images[0] : null;
      const id = item._id;

      console.log("🚀 Sending UPDATE payload:", {
        id,
        payload,
        addonsCount: processedAddons.length,
        discountPrice: payload.discountPrice,
        hasFile: !!file
      });

      updateItemMutate({ id, payload, file }, {
        onSuccess: (res) => {
          console.log("✅ Update success:", res);
          toast.success("Item updated successfully.");
          onOpenChange(false);
          queryClient.invalidateQueries(["items"]);
        },
        onError: (error) => {
          console.error("❌ Update error:", error);
          toast.error(error.response?.data?.error || "Something went wrong while updating item!");
        }
      });

    } else {
      // Create item logic (same as before)
      const processedAddons = formData.addons.map(addon => ({
        name: addon.name || "",
        isRequired: addon.isRequired || false,
        maxSelectable: addon.maxSelectable || 1,
        options: (addon.options || []).map(option => ({
          name: option.name || "",
          price: parseFloat(option.price) || 0,
          discountPrice: option.discountPrice ? parseFloat(option.discountPrice) : null,
          isAvailable: option.isAvailable !== undefined ? option.isAvailable : true
        })).filter(option => option.name && option.price > 0)
      })).filter(addon => addon.name);

      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
        details: formData.details,
        categoryId: formData.categoryId,
        isOnDiscount: formData.isOnDiscount,
        isAvailable: formData.isAvailable,
        addons: processedAddons
      }

      const file = formData.images[0] instanceof File ? formData.images[0] : null;

      createItemMutate({ payload, file }, {
        onSuccess: (res) => {
          toast.success("Item Created Successfully.");
          onOpenChange(false);
          setFormData({
            name: "",
            details: "",
            price: "",
            discountPrice: "",
            isOnDiscount: false,
            isAvailable: true,
            categoryId: "",
            images: [""],
            addons: []
          });
          queryClient.invalidateQueries(["items"]);
        },
        onError: (error) => {
          console.error("Create item error:", error);
          toast.error(error.response?.data?.error || "Something went wrong while creating Item.");
        }
      });
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
      setFormData(prev => ({
        ...prev,
        images: [file],
      }));
    }
  };

  const addAddon = () => {
    setFormData(prev => ({
      ...prev,
      addons: [...prev.addons, {
        name: "",
        isRequired: false,
        maxSelectable: 1,
        options: []
      }]
    }));
  };

  const removeAddon = (index) => {
    const newAddons = formData.addons.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, addons: newAddons }));
  };

  const handleAddonChange = (index, field, value) => {
    const newAddons = [...formData.addons];
    newAddons[index] = { ...newAddons[index], [field]: value };
    setFormData(prev => ({ ...prev, addons: newAddons }));
  };

  const addOptionToAddon = (addonIndex) => {
    const newAddons = [...formData.addons];
    if (!newAddons[addonIndex].options) {
      newAddons[addonIndex].options = [];
    }
    newAddons[addonIndex].options.push({
      name: "",
      price: "",
      discountPrice: "",
      isAvailable: true
    });
    setFormData(prev => ({ ...prev, addons: newAddons }));
  };

  const removeOptionFromAddon = (addonIndex, optionIndex) => {
    const newAddons = [...formData.addons];
    newAddons[addonIndex].options = newAddons[addonIndex].options.filter((_, i) => i !== optionIndex);
    setFormData(prev => ({ ...prev, addons: newAddons }));
  };

  const handleOptionChange = (addonIndex, optionIndex, field, value) => {
    const newAddons = [...formData.addons];
    newAddons[addonIndex].options[optionIndex] = {
      ...newAddons[addonIndex].options[optionIndex],
      [field]: value
    };
    setFormData(prev => ({ ...prev, addons: newAddons }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {item ? "Edit Item" : "Add New Item"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h4 className="font-medium text-foreground">Basic Information</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="md:col-span-2">
                <Label htmlFor="name">Item Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Enter item name"
                  className="mt-1"
                  disabled={isSubmitting}
                  required
                />
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.categoryId}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                  disabled={isSubmitting}
                  required
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category._id} value={category._id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price */}
              <div>
                <Label htmlFor="price">Price (Rs.) *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                  className="mt-1"
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="details">Description</Label>
              <Textarea
                id="details"
                rows={3}
                value={formData.details}
                onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                placeholder="Enter item description and details..."
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Discount Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isOnDiscount"
                checked={formData.isOnDiscount}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isOnDiscount: checked }))}
                disabled={isSubmitting}
              />
              <Label htmlFor="isOnDiscount" className="font-normal">
                This item is on discount
              </Label>
            </div>

            {formData.isOnDiscount && (
              <div>
                <Label htmlFor="discountPrice">Discount Price (Rs.) *</Label>
                <Input
                  id="discountPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.discountPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountPrice: e.target.value }))}
                  placeholder="0.00"
                  className="mt-1"
                  disabled={isSubmitting}
                  required={formData.isOnDiscount}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  The discounted price that customers will pay
                </p>
              </div>
            )}
          </div>

          {/* Images */}
          <div>
            <Label>Item Image</Label>
            <div className="flex flex-col gap-2 items-start space-x-4 mt-2">
              <div className="shrink-0">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-60 h-40 rounded-lg object-cover border"
                />
              </div>
              <div className="flex-1">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="text-sm"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isAvailable"
              checked={formData.isAvailable}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isAvailable: checked }))}
              disabled={isSubmitting}
            />
            <Label htmlFor="isAvailable" className="font-normal">
              Item is available for purchase
            </Label>
          </div>

          {/* Addons Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Addons</Label>
                <p className="text-xs text-muted-foreground mt-1">
                  Add customization options for this item
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAddon}
                disabled={isSubmitting}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Addon
              </Button>
            </div>

            {formData.addons.map((addon, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4 bg-muted/5">
                <div className="flex justify-between items-start">
                  <h5 className="font-medium">Addon Group {index + 1}</h5>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeAddon(index)}
                    disabled={isSubmitting}
                    className="text-primary hover:text-primary"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-2">
                    <Label>Addon Name *</Label>
                    <Input
                      value={addon.name}
                      onChange={(e) => handleAddonChange(index, 'name', e.target.value)}
                      placeholder="e.g., Extra Toppings"
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Max Selectable</Label>
                    <Input
                      type="number"
                      min="1"
                      value={addon.maxSelectable}
                      onChange={(e) => handleAddonChange(index, 'maxSelectable', parseInt(e.target.value) || 1)}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2 space-x-2">
                  <Checkbox
                    id={`required-${index}`}
                    checked={addon.isRequired}
                    onCheckedChange={(checked) => handleAddonChange(index, 'isRequired', checked)}
                    disabled={isSubmitting}
                  />
                  <Label htmlFor={`required-${index}`} className="font-normal text-sm">
                    Required
                  </Label>
                </div>

                {/* Options for this addon */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <Label>Options</Label>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addOptionToAddon(index)}
                      disabled={isSubmitting}
                      className="flex items-center gap-1"
                    >
                      <Plus className="h-3 w-3" />
                      Add Option
                    </Button>
                  </div>

                  {addon.options && addon.options.map((option, optIndex) => (
                    <div key={optIndex} className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3 p-3 border rounded bg-background">
                      <div className="md:col-span-2 flex flex-col gap-2">
                        <Label>Option Name *</Label>
                        <Input
                          placeholder="e.g., Cheese"
                          value={option.name}
                          onChange={(e) => handleOptionChange(index, optIndex, 'name', e.target.value)}
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <Label>Price (Rs.) *</Label>
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="0.00"
                          value={option.price}
                          onChange={(e) => handleOptionChange(index, optIndex, 'price', e.target.value)}
                          disabled={isSubmitting}
                          required
                        />
                      </div>
                      <div className="flex items-end gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeOptionFromAddon(index, optIndex)}
                          disabled={isSubmitting}
                          className="text-destructive hover:text-destructive flex-1"
                        >
                          <Minus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Creating..." : (item ? "Update" : "Create")} Item
              <span className="text-xs ml-2 opacity-60">Ctrl+Enter</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}