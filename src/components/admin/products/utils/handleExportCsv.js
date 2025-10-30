export function handleExportCSV(items) {
  if (!items || items.length === 0) {
    alert('No items to export');
    return;
  }

  // Define CSV headers
  const headers = [
    'Name',
    'Description',
    'Category',
    'Price',
    'Discount Price',
    'Is On Discount',
    'Is Available',
    'Images',
    'Addons'
  ];

  // Convert items to CSV rows
  const csvRows = items.map(item => {
    const images = item.images ? item.images.join('; ') : '';
    const addons = item.addons ? JSON.stringify(item.addons) : '';
    
    return [
      `"${(item.name || '').replace(/"/g, '""')}"`,
      `"${(item.details || '').replace(/"/g, '""')}"`,
      `"${(item.categoryName || '').replace(/"/g, '""')}"`,
      item.price || '',
      item.discountPrice || '',
      item.isOnDiscount ? 'Yes' : 'No',
      item.isAvailable ? 'Yes' : 'No',
      `"${images.replace(/"/g, '""')}"`,
      `"${addons.replace(/"/g, '""')}"`
    ].join(',');
  });

  // Combine headers and rows
  const csvContent = [
    headers.join(','),
    ...csvRows
  ].join('\n');

  // Create and download file
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `food-items-export-${new Date().toISOString().split('T')[0]}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}