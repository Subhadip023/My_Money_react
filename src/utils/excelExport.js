import * as XLSX from 'xlsx';

/**
 * Utility to export an array of transactions into a formatted Excel spreadsheet.
 * @param {Array} transactions - The list of transaction documents from Appwrite.
 * @param {string} filename - Desired name for the downloaded file.
 */
export const exportTransactionsToExcel = (transactions, filename = 'MyMoney_Report.xlsx') => {
    try {
        if (!transactions || transactions.length === 0) {
            console.warn("No data to export.");
            return false;
        }

        // 1. Map documents to a clean Excel-friendly format
        const data = transactions.map(tx => ({
            'Date': new Date(tx.$createdAt).toLocaleDateString('en-GB'),
            'Description': tx.label || 'N/A',
            'Transaction Type': tx.type?.toUpperCase() || 'UNKNOWN',
            'Amount (₹)': tx.amount || 0,
            'Category': tx.categories?.name || 'General',
            'Account': tx.accounts?.accountName || 'Primary Account',
            'Time': new Date(tx.$createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }));

        // 2. Create the worksheet from our JSON data
        const worksheet = XLSX.utils.json_to_sheet(data);

        // 3. Define column widths for better readability
        const wscols = [
            { wch: 15 }, // Date
            { wch: 30 }, // Description
            { wch: 20 }, // Type
            { wch: 15 }, // Amount
            { wch: 20 }, // Category
            { wch: 20 }, // Account
            { wch: 15 }  // Time
        ];
        worksheet['!cols'] = wscols;

        // 4. Generate the workbook and append the sheet
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Monthly Transactions');

        // 5. Trigger the system download prompt
        XLSX.writeFile(workbook, filename);
        
        return true;
    } catch (error) {
        console.error("Excel Export Error:", error);
        return false;
    }
};
