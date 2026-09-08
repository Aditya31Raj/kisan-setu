function buyerDashboardList(response, keys) {
    if (Array.isArray(response)) return response;
    for (const key of keys) if (Array.isArray(response?.[key])) return response[key];
    return [];
}

function buyerDashboardValue(response, keys, fallback = "--") {
    for (const key of keys) if (response?.[key] !== undefined && response[key] !== null) return response[key];
    return fallback;
}

function buyerDashboardText(value) {
    return String(value ?? "--").replace(/[&<>"']/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" }[character]));
}

function cropIcon(crop) {
    const value = String(crop || "").toLowerCase();
    if (value.includes("potato")) return "fa-carrot";
    if (value.includes("wheat") || value.includes("rice") || value.includes("paddy")) return "fa-wheat-awn";
    if (value.includes("tomato") || value.includes("onion")) return "fa-apple-whole";
    return "fa-seedling";
}

function renderBuyerProduce(items) {
    const container = document.getElementById("buyerProduceList");
    if (!container) return;
    if (!items.length) {
        container.innerHTML = '<p class="empty-state">No produce is available right now.</p>';
        return;
    }
    container.innerHTML = items.slice(0, 6).map((item) => {
        const name = item.title || item.name || "Produce";
        const quantity = item.availableQuantity ?? item.quantity ?? "--";
        const unit = item.unit || "kg";
        const price = item.pricePerUnit ?? item.price ?? "--";
        const location = item.location || "Location unavailable";
        const farmer = item.farmerName || item.farmer?.name || "Farmer details unavailable";
        return `<div class="produce-card">
            <div class="produce-image"><i class="fa-solid ${cropIcon(name)}" aria-hidden="true"></i></div>
            <div class="produce-details">
                <h4>${buyerDashboardText(name)}</h4>
                <p>${buyerDashboardText(quantity)} ${buyerDashboardText(unit)} available<br>${buyerDashboardText(location)}<br>Farmer: ${buyerDashboardText(farmer)}</p>
                <div class="price"><strong>₹${buyerDashboardText(price)}/${buyerDashboardText(unit)}</strong><button type="button" onclick="requestBuy('${buyerDashboardText(name)}')">Request</button></div>
            </div>
        </div>`;
    }).join("");
}

function renderBuyerOrders(items) {
    const body = document.getElementById("buyerRecentOrders");
    if (!body) return;
    if (!items.length) {
        body.innerHTML = '<tr><td colspan="6">No recent orders available.</td></tr>';
        return;
    }
    body.innerHTML = items.slice(0, 5).map((item) => `<tr>
        <td>${buyerDashboardText(item.orderNumber || item.orderId || item.id || "--")}</td>
        <td>${buyerDashboardText(item.produceName || item.produce || item.title || "--")}</td>
        <td>${buyerDashboardText(item.farmerName || item.farmer?.name || "--")}</td>
        <td>${buyerDashboardText(item.quantity || "--")} ${buyerDashboardText(item.unit || "")}</td>
        <td>₹${buyerDashboardText(item.amount || item.total || "--")}</td>
        <td><span class="status">${buyerDashboardText(item.status || "Pending")}</span></td>
    </tr>`).join("");
}

document.addEventListener("DOMContentLoaded", async () => {
    const localProfile = getRegistrationProfile("buyer") || {};
    let profile = localProfile;
    let dashboard = {};
    try {
        profile = { ...localProfile, ...(await getBuyerProfile() || {}) };
        dashboard = await getBuyerDashboard() || {};
    } catch (error) {
        console.warn("Buyer dashboard data unavailable.", error);
    }

    const name = profile.name || profile.ownerName || profile.businessName || "there";
    document.getElementById("buyerSidebarName").textContent = profile.businessName || name;
    document.getElementById("buyerWelcomeName").textContent = name;

    const stats = dashboard.stats || dashboard;
    document.getElementById("buyerActiveOrdersValue").textContent = buyerDashboardValue(stats, ["activeOrders", "pendingOrders", "ordersCount"]);
    document.getElementById("buyerPurchasesValue").textContent = buyerDashboardValue(stats, ["totalPurchases", "purchases", "totalSpent"]);
    document.getElementById("buyerPendingPaymentsValue").textContent = buyerDashboardValue(stats, ["pendingPayments", "paymentDue"]);
    document.getElementById("buyerDeliveriesValue").textContent = buyerDashboardValue(stats, ["deliveries", "activeDeliveries"]);

    renderBuyerProduce(buyerDashboardList(dashboard.produce || dashboard, ["availableProduce", "produce", "items"]));
    renderBuyerOrders(buyerDashboardList(dashboard.orders || dashboard, ["recentOrders", "orders"]));

    const delivery = buyerDashboardList(dashboard.delivery || dashboard, ["activeDelivery", "deliveries"])[0] || dashboard.activeDelivery || {};
    document.getElementById("buyerActiveDeliveryTitle").textContent = delivery.title || delivery.orderNumber || "No active delivery";
    document.getElementById("buyerActiveDeliveryStatus").textContent = delivery.status || "No status available";
});
