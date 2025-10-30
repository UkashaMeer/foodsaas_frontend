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

export default function ItemFormSheet({ item, open, onOpenChange, onSave, categories }) {
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
  const [imagePreviews, setImagePreviews] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      console.log("Editing item:", item);
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
      setImagePreviews(item.images || []);
    } else {
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
      setImagePreviews([]);
    }
  }, [item, open]);

  // Handle keyboard shortcut
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
    setIsSubmitting(true);

    try {
      // Validation
      if (!formData.name.trim()) {
        toast.error("Item name is required");
        return;
      }
      if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
        toast.error("Valid price is required");
        return;
      }
      if (!formData.categoryId) {
        toast.error("Category is required");
        return;
      }
      if (formData.isOnDiscount && (!formData.discountPrice || isNaN(formData.discountPrice) || parseFloat(formData.discountPrice) <= 0)) {
        toast.error("Valid discount price is required when discount is enabled");
        return;
      }

      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        discountPrice: formData.isOnDiscount ? parseFloat(formData.discountPrice) : null,
        images: formData.images.filter(img => img.trim() !== ""),
        categoryName: categories.find(cat => cat._id === formData.categoryId)?.name || ""
      };

      console.log("Submitting item:", submitData);
      await onSave(submitData, !!item);
      toast.success(`Item ${item ? 'updated' : 'created'} successfully`);
    } catch (error) {
      toast.error("Failed to save item");
      console.error("Save error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.images];
    newImages[index] = value;
    setFormData(prev => ({ ...prev, images: newImages }));

    // Update previews
    if (value.trim()) {
      const newPreviews = [...imagePreviews];
      newPreviews[index] = value;
      setImagePreviews(newPreviews);
    }
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ""]
    }));
  };

  const removeImageField = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, images: newImages }));
    setImagePreviews(newPreviews);
  };

  const handleAddonChange = (index, field, value) => {
    const newAddons = [...formData.addons];
    newAddons[index] = { ...newAddons[index], [field]: value };
    setFormData(prev => ({ ...prev, addons: newAddons }));
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
                />
              </div>

              {/* Category */}
              <div>
                <Label htmlFor="category">Category *</Label>
                <Select 
                  value={formData.categoryId} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}
                  disabled={isSubmitting}
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
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="0.00"
                  className="mt-1"
                  disabled={isSubmitting}
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
                  value={formData.discountPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, discountPrice: e.target.value }))}
                  placeholder="0.00"
                  className="mt-1"
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  The discounted price that customers will pay
                </p>
              </div>
            )}
          </div>

          {/* Images */}
          <div className="space-y-4">
            <Label>Images</Label>
            <p className="text-xs text-muted-foreground mb-2">
              Enter image URLs separated by commas or add multiple image fields
            </p>
            
            {formData.images.map((image, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={image}
                  onChange={(e) => handleImageChange(index, e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1"
                  disabled={isSubmitting}
                />
                {formData.images.length > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeImageField(index)}
                    disabled={isSubmitting}
                  >
                    Remove
                  </Button>
                )}
              </div>
            ))}
            
            <Button
              type="button"
              variant="outline"
              onClick={addImageField}
              disabled={isSubmitting}
            >
              Add Another Image
            </Button>

            {/* Image Previews */}
            {imagePreviews.filter(img => img.trim()).length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-2">
                {imagePreviews.filter(img => img.trim()).map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="h-20 w-full object-cover rounded border"
                    onError={(e) => {
                      e.target.src = "/placeholder-food.jpg";
                    }}
                  />
                ))}
              </div>
            )}
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
              <Label>Addons</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addAddon}
                disabled={isSubmitting}
              >
                Add Addon
              </Button>
            </div>

            {formData.addons.map((addon, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-start">
                  <h5 className="font-medium">Addon {index + 1}</h5>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeAddon(index)}
                    disabled={isSubmitting}
                  >
                    Remove
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div>
                    <Label>Addon Name</Label>
                    <Input
                      value={addon.name}
                      onChange={(e) => handleAddonChange(index, 'name', e.target.value)}
                      placeholder="e.g., Extra Toppings"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label>Max Selectable</Label>
                    <Input
                      type="number"
                      value={addon.maxSelectable}
                      onChange={(e) => handleAddonChange(index, 'maxSelectable', parseInt(e.target.value) || 1)}
                      min="1"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="flex items-end space-x-2">
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
              {isSubmitting ? "Saving..." : (item ? "Update" : "Create")} Item
              <span className="text-xs ml-2 opacity-60">Ctrl+Enter</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}