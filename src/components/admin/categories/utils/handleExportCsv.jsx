export const handleExportCSV = (filteredCategories) => {
    
    if (!filteredCategories || filteredCategories.length === 0) {
        toast.error("No categories to export");
        return;
    }

    const headers = ["Name", "Description", "Number of Items", "Active", "Created At"];
    const csvData = filteredCategories.map(cat => [
        cat.name,
        cat.description,
        cat.numberOfItems,
        cat.isActive ? "Yes" : "No",
        new Date(cat.createdAt).toLocaleDateString()
    ]);

    const csvContent = [
        headers.join(","),
        ...csvData.map(row => row.map(field => `"${field}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "categories.csv";
    a.click();
    URL.revokeObjectURL(url);

    toast.success("Categories exported to CSV");
};