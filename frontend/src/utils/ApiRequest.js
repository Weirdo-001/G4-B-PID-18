
const host = "http://localhost:4500";

// User Endpoints
export const registerAPI = `${host}/api/auth/register`;
export const loginAPI = `${host}/api/auth/login`;
export const setAvatarAPI = `${host}/api/auth/setAvatar`; // Append '/:id' when using (e.g., `${setAvatarAPI}/${userId}`)

// Transaction Endpoints
export const addTransactionAPI = `${host}/api/v1/transactions/addTransaction`;
export const getTransactionsAPI = `${host}/api/v1/transactions/getTransaction`;
export const updateTransactionAPI = `${host}/api/v1/transactions/updateTransaction`; // Append '/:id'
export const deleteTransactionAPI = `${host}/api/v1/transactions/deleteTransaction`; // Append '/:id'

// Stock Endpoints
export const addStockAPI = `${host}/api/v1/stocks/addStock`;
export const getStocksAPI = `${host}/api/v1/stocks/getStock`;
export const updateStockAPI = `${host}/api/v1/stocks/updateStock`; // Append '/:id'
export const deleteStockAPI = `${host}/api/v1/stocks/deleteStock`; // Append '/:id'

// Admin Endpoints
export const getAllUsersAPI = `${host}/api/admin/getUsers`;
export const updateUserAPI = `${host}/api/admin/updateUser`; // Append '/:id'
export const deleteUserAPI = `${host}/api/admin/deleteUser`; // Append '/:id'
