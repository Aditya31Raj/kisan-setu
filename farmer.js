async function getFarmerProfile() {
	return apiRequest("/farmers/me");
}

async function updateFarmerProfile(profile) {
	return apiRequest("/farmers/me", { method: "PATCH", body: profile });
}

async function getFarmerDashboard() {
	return apiRequest("/farmers/me/dashboard");
}

async function getFarmerProduce(params = {}) {
	return apiRequest(`/farmers/produce${queryString(params)}`);
}

async function createFarmerProduce(produce) {
	return apiRequest("/farmers/produce", { method: "POST", body: produce });
}

async function deleteFarmerProduce(produceId) {
	return apiRequest(`/farmers/produce/${encodeURIComponent(produceId)}`, { method: "DELETE" });
}

async function getFarmerOrders(params = {}) {
	return apiRequest(`/farmers/orders${queryString(params)}`);
}

async function getFarmerPayments(params = {}) {
	return apiRequest(`/farmers/payments${queryString(params)}`);
}

async function getFarmerLogistics(params = {}) {
	return apiRequest(`/farmers/logistics${queryString(params)}`);
}

async function getFarmerHistory(params = {}) {
	return apiRequest(`/farmers/orders${queryString({ ...params, status: "COMPLETED" })}`);
}

async function getFarmerDisputes(params = {}) {
	return apiRequest(`/farmers/disputes${queryString(params)}`);
}

async function getFarmerNotifications(params = {}) {
	return apiRequest(`/farmers/notifications${queryString(params)}`);
}

window.getFarmerProfile = getFarmerProfile;
window.updateFarmerProfile = updateFarmerProfile;
window.getFarmerDashboard = getFarmerDashboard;
window.getFarmerProduce = getFarmerProduce;
window.createFarmerProduce = createFarmerProduce;
window.deleteFarmerProduce = deleteFarmerProduce;
window.getFarmerOrders = getFarmerOrders;
window.getFarmerPayments = getFarmerPayments;
window.getFarmerLogistics = getFarmerLogistics;
window.getFarmerHistory = getFarmerHistory;
window.getFarmerDisputes = getFarmerDisputes;
window.getFarmerNotifications = getFarmerNotifications;
