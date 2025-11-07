// 全局变量
let currentCustomers = [...mockCustomers];
let currentPage = 1;
let itemsPerPage = 10;
let currentView = 'table';

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializePage();
});

// 初始化页面
function initializePage() {
    renderCustomers();
    setupEventListeners();
    updateStats();
}

// 设置事件监听器
function setupEventListeners() {
    // 搜索框实时搜索
    document.getElementById('searchName').addEventListener('input', function() {
        applyFilters();
    });

    // 筛选器变化时自动应用
    const filters = ['filterIndustry', 'filterRegion', 'filterCompanyType',
                     'filterBusinessVolume', 'filterRisk', 'filterRateLevel', 'filterTicketType'];
    filters.forEach(id => {
        document.getElementById(id).addEventListener('change', applyFilters);
    });
}

// 应用筛选
function applyFilters() {
    const searchName = document.getElementById('searchName').value.toLowerCase();
    const industry = document.getElementById('filterIndustry').value;
    const region = document.getElementById('filterRegion').value;
    const companyType = document.getElementById('filterCompanyType').value;
    const businessVolume = document.getElementById('filterBusinessVolume').value;
    const risk = document.getElementById('filterRisk').value;
    const rateLevel = document.getElementById('filterRateLevel').value;
    const ticketType = document.getElementById('filterTicketType').value;

    currentCustomers = mockCustomers.filter(customer => {
        const matchName = !searchName ||
            customer.name.toLowerCase().includes(searchName) ||
            customer.shortName.toLowerCase().includes(searchName);
        const matchIndustry = !industry || customer.industry === industry;
        const matchRegion = !region || customer.region === region;
        const matchCompanyType = !companyType || customer.companyType === companyType;
        const matchBusinessVolume = !businessVolume || customer.businessVolume === businessVolume;
        const matchRisk = !risk || customer.riskLevel === risk;
        const matchRateLevel = !rateLevel || customer.rateLevel === rateLevel;
        const matchTicketType = !ticketType || customer.preferredTicketType === ticketType;

        return matchName && matchIndustry && matchRegion && matchCompanyType &&
               matchBusinessVolume && matchRisk && matchRateLevel && matchTicketType;
    });

    currentPage = 1;
    renderCustomers();
}

// 重置筛选
function resetFilters() {
    document.getElementById('searchName').value = '';
    document.getElementById('filterIndustry').value = '';
    document.getElementById('filterRegion').value = '';
    document.getElementById('filterCompanyType').value = '';
    document.getElementById('filterBusinessVolume').value = '';
    document.getElementById('filterRisk').value = '';
    document.getElementById('filterRateLevel').value = '';
    document.getElementById('filterTicketType').value = '';

    currentCustomers = [...mockCustomers];
    currentPage = 1;
    renderCustomers();
}

// 渲染客户列表
function renderCustomers() {
    if (currentView === 'table') {
        renderTableView();
    } else {
        renderCardView();
    }
    renderPagination();
    updateCustomerCount();
}

// 渲染表格视图
function renderTableView() {
    const tbody = document.getElementById('customerTableBody');
    tbody.innerHTML = '';

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageCustomers = currentCustomers.slice(start, end);

    pageCustomers.forEach(customer => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <span class="customer-name" onclick="viewCustomerDetail(${customer.id})">
                    ${customer.name}
                </span>
            </td>
            <td>${customer.industry}</td>
            <td>${customer.region}</td>
            <td><span class="badge ${getBusinessVolumeBadgeClass(customer.businessVolume)}">${customer.businessVolume}</span></td>
            <td class="amount-large">${formatAmount(customer.yearlyTradeAmount)}</td>
            <td><span class="badge ${getCreditRatingBadgeClass(customer.creditRating)}">${customer.creditRating}</span></td>
            <td><span class="badge ${getRiskBadgeClass(customer.riskLevel)}">${customer.riskLevel}</span></td>
            <td>
                <button class="btn btn-primary" onclick="viewCustomerDetail(${customer.id})">查看</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// 渲染卡片视图
function renderCardView() {
    const cardView = document.getElementById('cardView');
    cardView.innerHTML = '';

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageCustomers = currentCustomers.slice(start, end);

    pageCustomers.forEach(customer => {
        const card = document.createElement('div');
        card.className = 'customer-card';
        card.onclick = () => viewCustomerDetail(customer.id);
        card.innerHTML = `
            <div class="customer-card-header">
                <div class="customer-card-title">
                    <h3>${customer.name}</h3>
                    <div class="customer-card-subtitle">${customer.industry} · ${customer.region}</div>
                </div>
                <span class="badge ${getRiskBadgeClass(customer.riskLevel)}">${customer.riskLevel}</span>
            </div>
            <div class="customer-card-body">
                <div class="info-item">
                    <span class="info-label">客户类型</span>
                    <span class="info-value">
                        <span class="badge ${getBusinessVolumeBadgeClass(customer.businessVolume)}">${customer.businessVolume}</span>
                    </span>
                </div>
                <div class="info-item">
                    <span class="info-label">信用评级</span>
                    <span class="info-value">
                        <span class="badge ${getCreditRatingBadgeClass(customer.creditRating)}">${customer.creditRating}</span>
                    </span>
                </div>
                <div class="info-item">
                    <span class="info-label">年交易额</span>
                    <span class="info-value amount-large">${formatAmount(customer.yearlyTradeAmount)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">年交易笔数</span>
                    <span class="info-value">${customer.yearlyTradeCount.toLocaleString()} 笔</span>
                </div>
                <div class="info-item">
                    <span class="info-label">偏好票据</span>
                    <span class="info-value">${customer.preferredTicketType}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">客户经理</span>
                    <span class="info-value">${customer.customerManager}</span>
                </div>
            </div>
        `;
        cardView.appendChild(card);
    });
}

// 渲染分页
function renderPagination() {
    const pagination = document.getElementById('pagination');
    const totalPages = Math.ceil(currentCustomers.length / itemsPerPage);

    let html = '';

    // 上一页
    html += `<button ${currentPage === 1 ? 'disabled' : ''} onclick="changePage(${currentPage - 1})">上一页</button>`;

    // 页码
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `<button class="${i === currentPage ? 'active' : ''}" onclick="changePage(${i})">${i}</button>`;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += '<button disabled>...</button>';
        }
    }

    // 下一页
    html += `<button ${currentPage === totalPages ? 'disabled' : ''} onclick="changePage(${currentPage + 1})">下一页</button>`;

    pagination.innerHTML = html;
}

// 切换页面
function changePage(page) {
    const totalPages = Math.ceil(currentCustomers.length / itemsPerPage);
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        renderCustomers();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// 切换视图
function switchView(view) {
    currentView = view;

    const tableView = document.getElementById('tableView');
    const cardView = document.getElementById('cardView');
    const viewButtons = document.querySelectorAll('.view-btn');

    viewButtons.forEach(btn => btn.classList.remove('active'));

    if (view === 'table') {
        tableView.style.display = 'block';
        cardView.style.display = 'none';
        viewButtons[0].classList.add('active');
    } else {
        tableView.style.display = 'none';
        cardView.style.display = 'grid';
        viewButtons[1].classList.add('active');
    }

    renderCustomers();
}

// 查看客户详情
function viewCustomerDetail(customerId) {
    // 保存客户ID到localStorage
    localStorage.setItem('selectedCustomerId', customerId);
    // 跳转到详情页
    window.location.href = 'customer-detail.html';
}

// 更新统计数据
function updateStats() {
    // 这里可以根据实际筛选结果更新统计
    document.getElementById('totalCustomers').textContent = mockCustomers.length;

    const totalAmount = mockCustomers.reduce((sum, c) => sum + c.yearlyTradeAmount, 0);
    document.getElementById('totalAmount').textContent = formatAmount(totalAmount);

    const activeCustomers = mockCustomers.filter(c =>
        c.businessVolume !== '衰退或流失预警客户'
    ).length;
    document.getElementById('activeCustomers').textContent = activeCustomers;

    const riskAlerts = mockCustomers.filter(c =>
        c.riskLevel === '中高' || c.riskLevel === '高'
    ).length;
    document.getElementById('riskAlerts').textContent = riskAlerts;
}

// 更新客户数量
function updateCustomerCount() {
    document.getElementById('customerCount').textContent = currentCustomers.length;
}

// 格式化金额
function formatAmount(amount) {
    if (amount >= 100000000000) { // 千亿
        return (amount / 100000000000).toFixed(1) + '千亿';
    } else if (amount >= 100000000) { // 亿
        return (amount / 100000000).toFixed(1) + '亿';
    } else if (amount >= 10000) { // 万
        return (amount / 10000).toFixed(1) + '万';
    }
    return amount.toLocaleString();
}

// 获取业务量类型对应的徽章样式
function getBusinessVolumeBadgeClass(type) {
    const classMap = {
        '新获取客户': 'badge-info',
        '成长型客户': 'badge-success',
        '稳定型客户': 'badge-gray',
        '衰退或流失预警客户': 'badge-warning'
    };
    return classMap[type] || 'badge-gray';
}

// 获取信用评级对应的徽章样式
function getCreditRatingBadgeClass(rating) {
    if (rating.startsWith('AAA')) return 'badge-success';
    if (rating.startsWith('AA')) return 'badge-info';
    if (rating.startsWith('A')) return 'badge-warning';
    return 'badge-gray';
}

// 获取风险等级对应的徽章样式
function getRiskBadgeClass(risk) {
    const classMap = {
        '低': 'badge-success',
        '中': 'badge-info',
        '中高': 'badge-warning',
        '高': 'badge-danger'
    };
    return classMap[risk] || 'badge-gray';
}
