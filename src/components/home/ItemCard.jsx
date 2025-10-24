import React from 'react';

export default function ItemCard({ data, onClick }) {
  return (
    <div
      onClick={() => onClick(data)}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col h-full group border-2 border-white hover:border-primary cursor-pointer">
      {/* Image Section */}
      <div className="relative w-full h-46 bg-gray-100">
        <img
          src={data.images[0]}
          alt={data.name}
          className="w-full h-full object-cover"
        />
        
        {/* Discount Badge */}
        {data.isOnDiscount && data.discountPrice && (
          <div className="absolute top-2 right-2 bg-primary text-white px-2 py-0.5 rounded-full text-xs font-semibold animate-pulse shadow-md">
            Sale!
          </div>
        )}
        
        {/* Availability Badge */}
        {!data.isAvailable && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
            <span className="text-white text-sm font-bold">Unavailable</span>
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-3 flex flex-col grow">
        {/* Category */}
        <div className="text-xs font-semibold text-primary uppercase tracking-wide mb-1 transition-colors duration-300 group-hover:text-primary">
          {data.categoryId.name}
        </div>

        {/* Name */}
        <h3 className="text-sm font-bold text-gray-900 mb-1 line-clamp-2 transition-colors duration-300 group-hover:text-primary">
          {data.name}
        </h3>

        {/* Details */}
        <p className="text-xs text-gray-600 mb-2 line-clamp-2 grow leading-relaxed">
          {data.details}
        </p>

        {/* Rating */}
        {data.averageRating && data.ratingCount && (
          <div className="flex items-center mb-2">
            <svg className="w-3 h-3 text-yellow-400 fill-current transition-transform duration-300 group-hover:scale-125" viewBox="0 0 20 20">
              <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            </svg>
            <span className="ml-1 text-xs font-medium text-gray-700">
              {data.averageRating.toFixed(1)} ({data.ratingCount})
            </span>
          </div>
        )}

        {/* Price Section */}
        <div className="flex items-center justify-between mt-auto pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-1">
            {data.isOnDiscount && data.discountPrice ? (
              <>
                <span className="text-base font-bold text-primary transition-all duration-300">
                  Rs. {data.discountPrice}
                </span>
                <span className="text-xs text-gray-400 line-through">
                  Rs. {data.price}
                </span>
              </>
            ) : (
              <span className="text-base font-bold text-gray-900 transition-all duration-300 group-hover:text-primary">
                Rs. {data.price}
              </span>
            )}
          </div>

          {/* Preparation Time */}
          {data.preparationTime && (
            <div className="flex items-center text-xs text-gray-500">
              <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              {data.preparationTime}m
            </div>
          )}
        </div>

        {/* Add to Cart Button */}
        <button 
          disabled={!data.isAvailable}
          className={`mt-2 w-full py-1.5 rounded-md text-xs font-semibold transition-all duration-300 transform ${
            data.isAvailable 
              ? 'bg-primary hover:bg-primary text-white shadow-md hover:shadow-lg' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          {data.isAvailable ? 'Add to Cart' : 'Unavailable'}
        </button>

        {/* Addons Indicator
        {data.addons && data.addons.length > 0 && (
          <p className="text-xs text-gray-500 text-center mt-1">
            + {data.addons.length} addon{data.addons.length > 1 ? 's' : ''} available
          </p>
        )} */}
      </div>
    </div>
  );
}