import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useState } from 'react';

export const OrderItemCard = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card 
      className={`overflow-hidden transition-all duration-300 hover:shadow-md ${
        isExpanded ? 'shadow-sm' : ''
      }`}
    >
      <CardContent className="p-4">
        <div 
          className="flex items-start gap-4 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <img 
            src={item.itemId.images[0]} 
            alt={item.itemId.name}
            className="w-16 h-16 rounded-lg object-cover shrink-0 transition-transform duration-300 hover:scale-105"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="font-semibold text-foreground line-clamp-1">
                  {item.itemId.name}
                </h4>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {item.itemId.details}
                </p>
              </div>
              
              <div className="text-right shrink-0 ml-4">
                <div className="flex items-center gap-2">
                  {item.itemId.isOnDiscount ? (
                    <>
                      <span className="font-bold text-foreground">
                        Rs. {item.itemId.discountPrice}
                      </span>
                      <span className="text-sm text-muted-foreground line-through">
                        Rs. {item.itemId.price}
                      </span>
                    </>
                  ) : (
                    <span className="font-bold text-foreground">
                      Rs. {item.itemId.price}
                    </span>
                  )}
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  Qty: {item.quantity}
                </div>
              </div>
            </div>

            {/* Addons */}
            {item.selectedAddons && item.selectedAddons.length > 0 && (
              <div className={`mt-3 transition-all duration-300 ${
                isExpanded ? 'block' : 'hidden'
              }`}>
                <Separator className="my-2" />
                <h5 className="text-sm font-medium text-muted-foreground mb-2">Addons:</h5>
                <div className="space-y-1">
                  {item.selectedAddons.map((addonCategory, categoryIndex) => (
                    <div key={categoryIndex} className="text-sm">
                      <span className="font-medium">{addonCategory.categoryName}:</span>
                      {' '}
                      {addonCategory.options.map((option, optionIndex) => (
                        <span key={optionIndex} className="text-muted-foreground">
                          {option.name} (Rs. {option.price})
                          {optionIndex < addonCategory.options.length - 1 ? ', ' : ''}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center justify-between mt-3">
              <Badge 
                variant={item.itemId.isAvailable ? "default" : "destructive"}
                className="animate-fade-in"
              >
                {item.itemId.isAvailable ? 'Available' : 'Unavailable'}
              </Badge>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                {isExpanded ? 'Show Less' : 'Show Addons'}
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
