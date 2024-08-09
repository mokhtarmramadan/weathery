const today = new Date();

// Add 7 days to the current date
today.setDate(today.getDate() + 7);

const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
const day = String(today.getDate()).padStart(2, '0');

const formattedDate = `${year}-${month}-${day}`;

console.log(formattedDate); // Outputs the date 7 days from today in YYYY-MM-DD format

