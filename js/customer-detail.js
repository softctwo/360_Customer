// 当前客户数据
let currentCustomer = null;
let monthlyTrendChart = null;
let tradeCompareChart = null;

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadCustomerDetail();
});

// 加载客户详情
function loadCustomerDetail() {
    const customerId = parseInt(localStorage.getItem('selectedCustomerId'));
    currentCustomer = mockCustomers.find(c => c.id === customerId);

    if (!currentCustomer) {
        alert('未找到客户信息');
        window.location.href = 'index.html';
        return;
    }

    renderCustomerDetail();
}

// 渲染客户详情
function renderCustomerDetail() {
    // 渲染基本信息
    renderBasicInfo();

    // 渲染风险预警
    renderRiskAlert();

    // 渲染全景画像
    renderOverview();

    // 渲染业务特征
    renderBusinessTab();

    // 渲染风险评估
    renderRiskTab();

    // 渲染数据分析
    renderAnalysisTab();

    // 渲染营销策略
    renderStrategyTab();
}

// 渲染基本信息
function renderBasicInfo() {
    document.getElementById('customerName').textContent = currentCustomer.name;
    document.getElementById('customerSubtitle').textContent =
        `${currentCustomer.industry} · ${currentCustomer.region}`;

    const basicInfo = document.getElementById('basicInfo');
    basicInfo.innerHTML = `
        <div class="info-item">
            <span class="info-label">企业类型</span>
            <span class="info-value">${currentCustomer.institutionType} / ${currentCustomer.companyType}</span>
        </div>
        <div class="info-item">
            <span class="info-label">企业规模</span>
            <span class="info-value">${currentCustomer.companyScale}</span>
        </div>
        <div class="info-item">
            <span class="info-label">客户类型</span>
            <span class="info-value">
                <span class="badge ${getBusinessVolumeBadgeClass(currentCustomer.businessVolume)}">
                    ${currentCustomer.businessVolume}
                </span>
            </span>
        </div>
        <div class="info-item">
            <span class="info-label">信用评级</span>
            <span class="info-value">
                <span class="badge ${getCreditRatingBadgeClass(currentCustomer.creditRating)}">
                    ${currentCustomer.creditRating}
                </span>
            </span>
        </div>
        <div class="info-item">
            <span class="info-label">风险等级</span>
            <span class="info-value">
                <span class="badge ${getRiskBadgeClass(currentCustomer.riskLevel)}">
                    ${currentCustomer.riskLevel}风险
                </span>
            </span>
        </div>
        <div class="info-item">
            <span class="info-label">客户经理</span>
            <span class="info-value">${currentCustomer.customerManager}</span>
        </div>
    `;
}

// 渲染风险预警
function renderRiskAlert() {
    const alertDiv = document.getElementById('riskAlert');

    if (currentCustomer.hasOverdue) {
        alertDiv.innerHTML = `
            <div class="alert alert-danger">
                <span class="alert-icon">🚨</span>
                <div>
                    <strong>高风险预警！</strong>
                    该客户存在逾期记录，且授信额度使用率过高（${((currentCustomer.usedCredit / currentCustomer.creditLimit) * 100).toFixed(1)}%），
                    建议加强贷后检查，审慎审批新业务。
                </div>
            </div>
        `;
    } else if (currentCustomer.riskLevel === '中高' || currentCustomer.riskLevel === '高') {
        alertDiv.innerHTML = `
            <div class="alert alert-warning">
                <span class="alert-icon">⚠️</span>
                <div>
                    <strong>风险提示：</strong>
                    该客户风险等级为${currentCustomer.riskLevel}，建议密切关注业务动态。
                </div>
            </div>
        `;
    } else if (currentCustomer.businessVolume === '衰退或流失预警客户') {
        alertDiv.innerHTML = `
            <div class="alert alert-warning">
                <span class="alert-icon">📉</span>
                <div>
                    <strong>流失预警：</strong>
                    该客户业务量呈下降趋势，建议及时联系并制定挽回策略。
                </div>
            </div>
        `;
    } else if (currentCustomer.rateLevel === '强势客户' && currentCustomer.businessVolume === '成长型客户') {
        alertDiv.innerHTML = `
            <div class="alert alert-success">
                <span class="alert-icon">⭐</span>
                <div>
                    <strong>核心客户：</strong>
                    该客户为强势客户且业务量持续增长，建议重点维护并提供优质服务。
                </div>
            </div>
        `;
    }
}

// 渲染全景画像
function renderOverview() {
    const dimensionGrid = document.getElementById('dimensionGrid');
    dimensionGrid.innerHTML = `
        <!-- 维度1：利率维度 -->
        <div class="dimension-card">
            <div class="dimension-card-header">
                <span class="dimension-icon">💎</span>
                <h4 class="dimension-title">利率维度</h4>
            </div>
            <div class="dimension-content">
                <div class="info-item">
                    <span class="info-label">客户等级</span>
                    <span class="info-value">
                        <span class="badge ${currentCustomer.rateLevel === '强势客户' ? 'badge-success' : 'badge-gray'}">
                            ${currentCustomer.rateLevel}
                        </span>
                    </span>
                </div>
                <div class="info-item">
                    <span class="info-label">利率优势</span>
                    <span class="info-value">
                        ${currentCustomer.rateLevel === '强势客户' ? '可获得最优利率' : '普通利率'}
                    </span>
                </div>
            </div>
        </div>

        <!-- 维度2：行业分类 -->
        <div class="dimension-card">
            <div class="dimension-card-header">
                <span class="dimension-icon">🏭</span>
                <h4 class="dimension-title">行业分类</h4>
            </div>
            <div class="dimension-content">
                <div class="info-item">
                    <span class="info-label">所属行业</span>
                    <span class="info-value">${currentCustomer.industry}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">行业特征</span>
                    <span class="info-value">${getIndustryFeature(currentCustomer.industry)}</span>
                </div>
            </div>
        </div>

        <!-- 维度3：机构维度 -->
        <div class="dimension-card">
            <div class="dimension-card-header">
                <span class="dimension-icon">🏢</span>
                <h4 class="dimension-title">机构维度</h4>
            </div>
            <div class="dimension-content">
                <div class="info-item">
                    <span class="info-label">机构类型</span>
                    <span class="info-value">${currentCustomer.institutionType}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">企业属性</span>
                    <span class="info-value">${currentCustomer.companyType}</span>
                </div>
            </div>
        </div>

        <!-- 维度4：地区维度 -->
        <div class="dimension-card">
            <div class="dimension-card-header">
                <span class="dimension-icon">📍</span>
                <h4 class="dimension-title">地区维度</h4>
            </div>
            <div class="dimension-content">
                <div class="info-item">
                    <span class="info-label">所在地区</span>
                    <span class="info-value">${currentCustomer.region}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">详细地址</span>
                    <span class="info-value">${currentCustomer.address}</span>
                </div>
            </div>
        </div>

        <!-- 维度5：业务量维度 -->
        <div class="dimension-card">
            <div class="dimension-card-header">
                <span class="dimension-icon">📊</span>
                <h4 class="dimension-title">业务量维度</h4>
            </div>
            <div class="dimension-content">
                <div class="info-item">
                    <span class="info-label">客户分类</span>
                    <span class="info-value">
                        <span class="badge ${getBusinessVolumeBadgeClass(currentCustomer.businessVolume)}">
                            ${currentCustomer.businessVolume}
                        </span>
                    </span>
                </div>
                <div class="info-item">
                    <span class="info-label">入网时间</span>
                    <span class="info-value">${currentCustomer.registrationDate}</span>
                </div>
            </div>
        </div>

        <!-- 维度6：企业类型 -->
        <div class="dimension-card">
            <div class="dimension-card-header">
                <span class="dimension-icon">🎯</span>
                <h4 class="dimension-title">企业类型维度</h4>
            </div>
            <div class="dimension-content">
                <div class="info-item">
                    <span class="info-label">企业类型</span>
                    <span class="info-value">${currentCustomer.companyType}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">企业规模</span>
                    <span class="info-value">${currentCustomer.companyScale}</span>
                </div>
            </div>
        </div>

        <!-- 维度7：企业规模 -->
        <div class="dimension-card">
            <div class="dimension-card-header">
                <span class="dimension-icon">📏</span>
                <h4 class="dimension-title">企业规模维度</h4>
            </div>
            <div class="dimension-content">
                <div class="info-item">
                    <span class="info-label">规模分类</span>
                    <span class="info-value">${currentCustomer.companyScale}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">年交易额</span>
                    <span class="info-value amount-large">${formatAmount(currentCustomer.yearlyTradeAmount)}</span>
                </div>
            </div>
        </div>

        <!-- 维度8：票据业务角色 -->
        <div class="dimension-card">
            <div class="dimension-card-header">
                <span class="dimension-icon">🎭</span>
                <h4 class="dimension-title">票据业务角色</h4>
            </div>
            <div class="dimension-content">
                <div class="info-item">
                    <span class="info-label">业务角色</span>
                    <span class="info-value">
                        ${currentCustomer.businessRoles.map(role =>
                            `<span class="badge badge-info" style="margin: 2px;">${role}</span>`
                        ).join('')}
                    </span>
                </div>
            </div>
        </div>

        <!-- 维度9：票据种类 -->
        <div class="dimension-card">
            <div class="dimension-card-header">
                <span class="dimension-icon">🎫</span>
                <h4 class="dimension-title">票据种类维度</h4>
            </div>
            <div class="dimension-content">
                <div class="info-item">
                    <span class="info-label">偏好票据</span>
                    <span class="info-value">
                        <span class="badge badge-success">${currentCustomer.preferredTicketType}</span>
                    </span>
                </div>
                <div class="info-item">
                    <span class="info-label">平均票面</span>
                    <span class="info-value">${formatAmount(currentCustomer.avgTicketAmount)}</span>
                </div>
            </div>
        </div>

        <!-- 维度10：交易行为特征 -->
        <div class="dimension-card">
            <div class="dimension-card-header">
                <span class="dimension-icon">💹</span>
                <h4 class="dimension-title">交易行为特征</h4>
            </div>
            <div class="dimension-content">
                <div class="info-item">
                    <span class="info-label">年交易量</span>
                    <span class="info-value amount-large">${formatAmount(currentCustomer.yearlyTradeAmount)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">年交易笔数</span>
                    <span class="info-value">${currentCustomer.yearlyTradeCount.toLocaleString()} 笔</span>
                </div>
                <div class="info-item">
                    <span class="info-label">最近交易</span>
                    <span class="info-value">${currentCustomer.lastTradeDate}</span>
                </div>
            </div>
        </div>

        <!-- 维度11：贴现时机 -->
        <div class="dimension-card">
            <div class="dimension-card-header">
                <span class="dimension-icon">⏱️</span>
                <h4 class="dimension-title">贴现时机维度</h4>
            </div>
            <div class="dimension-content">
                <div class="info-item">
                    <span class="info-label">贴现偏好</span>
                    <span class="info-value">
                        ${currentCustomer.businessRoles.includes('贴现申请人') ? '频繁贴现' : '持有到期为主'}
                    </span>
                </div>
                <div class="info-item">
                    <span class="info-label">资金状况</span>
                    <span class="info-value">
                        ${currentCustomer.businessRoles.includes('贴现申请人') ? '资金需求较大' : '资金较充裕'}
                    </span>
                </div>
            </div>
        </div>

        <!-- 维度12：信用记录 -->
        <div class="dimension-card">
            <div class="dimension-card-header">
                <span class="dimension-icon">📋</span>
                <h4 class="dimension-title">信用记录维度</h4>
            </div>
            <div class="dimension-content">
                <div class="info-item">
                    <span class="info-label">信用评级</span>
                    <span class="info-value">
                        <span class="badge ${getCreditRatingBadgeClass(currentCustomer.creditRating)}">
                            ${currentCustomer.creditRating}
                        </span>
                    </span>
                </div>
                <div class="info-item">
                    <span class="info-label">逾期记录</span>
                    <span class="info-value">
                        ${currentCustomer.hasOverdue ?
                            '<span class="badge badge-danger">有逾期</span>' :
                            '<span class="badge badge-success">无逾期</span>'}
                    </span>
                </div>
            </div>
        </div>

        <!-- 维度13：授信与担保 -->
        <div class="dimension-card">
            <div class="dimension-card-header">
                <span class="dimension-icon">💳</span>
                <h4 class="dimension-title">授信与担保维度</h4>
            </div>
            <div class="dimension-content">
                <div class="info-item">
                    <span class="info-label">授信额度</span>
                    <span class="info-value">${formatAmount(currentCustomer.creditLimit)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">已用额度</span>
                    <span class="info-value">${formatAmount(currentCustomer.usedCredit)}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">额度使用率</span>
                    <span class="info-value">
                        <span class="badge ${(currentCustomer.usedCredit / currentCustomer.creditLimit) > 0.8 ? 'badge-warning' : 'badge-success'}">
                            ${((currentCustomer.usedCredit / currentCustomer.creditLimit) * 100).toFixed(1)}%
                        </span>
                    </span>
                </div>
            </div>
        </div>

        <!-- 维度14：客户持票 -->
        <div class="dimension-card">
            <div class="dimension-card-header">
                <span class="dimension-icon">📄</span>
                <h4 class="dimension-title">客户持票维度</h4>
            </div>
            <div class="dimension-content">
                <div class="info-item">
                    <span class="info-label">票据池管理</span>
                    <span class="info-value">
                        ${currentCustomer.hasTicketPool ?
                            '<span class="badge badge-success">已开通</span>' :
                            '<span class="badge badge-gray">未开通</span>'}
                    </span>
                </div>
                <div class="info-item">
                    <span class="info-label">持票特征</span>
                    <span class="info-value">
                        ${currentCustomer.hasTicketPool ? '大量持票，集中管理' : '持票较少或分散管理'}
                    </span>
                </div>
            </div>
        </div>

        <!-- 维度15：机构业务收益 -->
        <div class="dimension-card">
            <div class="dimension-card-header">
                <span class="dimension-icon">💰</span>
                <h4 class="dimension-title">机构业务收益维度</h4>
            </div>
            <div class="dimension-content">
                <div class="info-item">
                    <span class="info-label">年度贡献</span>
                    <span class="info-value amount-large">
                        ${formatAmount(currentCustomer.yearlyTradeAmount * 0.002)}
                    </span>
                </div>
                <div class="info-item">
                    <span class="info-label">客户价值</span>
                    <span class="info-value">
                        ${currentCustomer.yearlyTradeAmount > 50000000000 ?
                            '<span class="badge badge-success">高价值客户</span>' :
                            currentCustomer.yearlyTradeAmount > 10000000000 ?
                            '<span class="badge badge-info">中等价值客户</span>' :
                            '<span class="badge badge-gray">一般客户</span>'}
                    </span>
                </div>
            </div>
        </div>

        <!-- 维度16：业务日期 -->
        <div class="dimension-card">
            <div class="dimension-card-header">
                <span class="dimension-icon">📅</span>
                <h4 class="dimension-title">业务日期维度</h4>
            </div>
            <div class="dimension-content">
                <div class="info-item">
                    <span class="info-label">最近交易</span>
                    <span class="info-value">${currentCustomer.lastTradeDate}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">业务规律</span>
                    <span class="info-value">常年稳定交易，月末季末高峰</span>
                </div>
            </div>
        </div>
    `;
}

// 渲染业务特征标签页
function renderBusinessTab() {
    // 渲染交易行为
    document.getElementById('tradeBehavior').innerHTML = `
        <div class="info-item">
            <span class="info-label">年票据交易量</span>
            <span class="info-value amount-large">${formatAmount(currentCustomer.yearlyTradeAmount)}</span>
        </div>
        <div class="info-item">
            <span class="info-label">年交易笔数</span>
            <span class="info-value">${currentCustomer.yearlyTradeCount.toLocaleString()} 笔</span>
        </div>
        <div class="info-item">
            <span class="info-label">平均单张票面金额</span>
            <span class="info-value">${formatAmount(currentCustomer.avgTicketAmount)}</span>
        </div>
        <div class="info-item">
            <span class="info-label">交易规律</span>
            <span class="info-value">常年稳定</span>
        </div>
    `;

    // 渲染业务角色
    document.getElementById('businessRoles').innerHTML = currentCustomer.businessRoles.map(role => `
        <div class="info-item">
            <span class="info-label">${role}</span>
            <span class="info-value">
                <span class="badge badge-success">✓ 活跃</span>
            </span>
        </div>
    `).join('');

    // 渲染时间规律
    document.getElementById('timePattern').innerHTML = `
        <div class="info-item">
            <span class="info-label">最近交易日期</span>
            <span class="info-value">${currentCustomer.lastTradeDate}</span>
        </div>
        <div class="info-item">
            <span class="info-label">交易频率</span>
            <span class="info-value">月均 ${Math.round(currentCustomer.yearlyTradeCount / 11)} 笔</span>
        </div>
        <div class="info-item">
            <span class="info-label">高峰时段</span>
            <span class="info-value">月末、季末</span>
        </div>
    `;

    // 绘制月度趋势图
    if (monthlyTradeData[currentCustomer.id]) {
        renderMonthlyTrendChart();
    }
}

// 渲染风险评估标签页
function renderRiskTab() {
    // 信用记录
    document.getElementById('creditRecord').innerHTML = `
        <div class="info-item">
            <span class="info-label">人行征信评级</span>
            <span class="info-value">
                <span class="badge ${getCreditRatingBadgeClass(currentCustomer.creditRating)}">
                    ${currentCustomer.creditRating}
                </span>
            </span>
        </div>
        <div class="info-item">
            <span class="info-label">不良贷款记录</span>
            <span class="info-value">
                <span class="badge badge-success">无</span>
            </span>
        </div>
        <div class="info-item">
            <span class="info-label">票据逾期记录</span>
            <span class="info-value">
                ${currentCustomer.hasOverdue ?
                    '<span class="badge badge-danger">有逾期</span>' :
                    '<span class="badge badge-success">无逾期</span>'}
            </span>
        </div>
    `;

    // 授信信息
    document.getElementById('creditInfo').innerHTML = `
        <div class="info-item">
            <span class="info-label">综合授信额度</span>
            <span class="info-value">${formatAmount(currentCustomer.creditLimit)}</span>
        </div>
        <div class="info-item">
            <span class="info-label">已使用额度</span>
            <span class="info-value">${formatAmount(currentCustomer.usedCredit)}</span>
        </div>
        <div class="info-item">
            <span class="info-label">可用额度</span>
            <span class="info-value">${formatAmount(currentCustomer.creditLimit - currentCustomer.usedCredit)}</span>
        </div>
        <div class="info-item">
            <span class="info-label">额度使用率</span>
            <span class="info-value">
                <span class="badge ${(currentCustomer.usedCredit / currentCustomer.creditLimit) > 0.8 ? 'badge-warning' : 'badge-success'}">
                    ${((currentCustomer.usedCredit / currentCustomer.creditLimit) * 100).toFixed(1)}%
                </span>
            </span>
        </div>
    `;

    // 风险指标
    document.getElementById('riskIndicators').innerHTML = `
        <div class="info-item">
            <span class="info-label">风险等级</span>
            <span class="info-value">
                <span class="badge ${getRiskBadgeClass(currentCustomer.riskLevel)}">
                    ${currentCustomer.riskLevel}风险
                </span>
            </span>
        </div>
        <div class="info-item">
            <span class="info-label">信用评分</span>
            <span class="info-value">${getCreditScore(currentCustomer)} 分</span>
        </div>
        <div class="info-item">
            <span class="info-label">风险建议</span>
            <span class="info-value">${getRiskSuggestion(currentCustomer)}</span>
        </div>
    `;
}

// 渲染数据分析标签页
function renderAnalysisTab() {
    // 机构业务收益
    const revenue = currentCustomer.yearlyTradeAmount * 0.002; // 假设收益率0.2%
    document.getElementById('businessRevenue').innerHTML = `
        <div class="info-item">
            <span class="info-label">年度收益贡献</span>
            <span class="info-value amount-large">${formatAmount(revenue)}</span>
        </div>
        <div class="info-item">
            <span class="info-label">承兑业务收益</span>
            <span class="info-value">${formatAmount(revenue * 0.6)}</span>
        </div>
        <div class="info-item">
            <span class="info-label">贴现业务收益</span>
            <span class="info-value">${formatAmount(revenue * 0.4)}</span>
        </div>
    `;

    // 持票情况
    document.getElementById('ticketHolding').innerHTML = `
        <div class="info-item">
            <span class="info-label">票据池状态</span>
            <span class="info-value">
                ${currentCustomer.hasTicketPool ?
                    '<span class="badge badge-success">已开通</span>' :
                    '<span class="badge badge-gray">未开通</span>'}
            </span>
        </div>
        <div class="info-item">
            <span class="info-label">当前持票估算</span>
            <span class="info-value">${formatAmount(currentCustomer.avgTicketAmount * 10)}</span>
        </div>
        <div class="info-item">
            <span class="info-label">历史持票峰值</span>
            <span class="info-value">${formatAmount(currentCustomer.avgTicketAmount * 25)}</span>
        </div>
    `;

    // 增长趋势
    document.getElementById('growthTrend').innerHTML = `
        <div class="info-item">
            <span class="info-label">业务量趋势</span>
            <span class="info-value">
                ${currentCustomer.businessVolume === '成长型客户' ?
                    '<span class="trend-up">↑ 持续增长</span>' :
                    currentCustomer.businessVolume === '衰退或流失预警客户' ?
                    '<span class="trend-down">↓ 下降趋势</span>' :
                    '→ 稳定'}
            </span>
        </div>
        <div class="info-item">
            <span class="info-label">同比增长率</span>
            <span class="info-value">
                ${currentCustomer.businessVolume === '成长型客户' ? '+23.5%' :
                  currentCustomer.businessVolume === '衰退或流失预警客户' ? '-15.2%' : '+5.3%'}
            </span>
        </div>
    `;

    // 绘制对比图表
    renderTradeCompareChart();
}

// 渲染营销策略标签页
function renderStrategyTab() {
    // 生成营销策略
    const strategy = generateMarketingStrategy(currentCustomer);
    document.getElementById('customerStrategy').innerHTML = `
        <span class="alert-icon">💡</span>
        <div>
            <strong>智能营销策略建议：</strong>
            ${strategy}
        </div>
    `;

    // 推荐产品
    const products = getRecommendedProducts(currentCustomer);
    document.getElementById('recommendProducts').innerHTML = products.map(product => `
        <div class="info-item">
            <span class="info-label">${product.name}</span>
            <span class="info-value">${product.reason}</span>
        </div>
    `).join('');

    // 营销建议
    document.getElementById('marketingSuggestions').innerHTML = `
        <div class="info-item">
            <span class="info-label">服务方式</span>
            <span class="info-value">${getServiceMethod(currentCustomer)}</span>
        </div>
        <div class="info-item">
            <span class="info-label">优惠策略</span>
            <span class="info-value">${getDiscountStrategy(currentCustomer)}</span>
        </div>
        <div class="info-item">
            <span class="info-label">关系维护</span>
            <span class="info-value">${getRelationshipStrategy(currentCustomer)}</span>
        </div>
    `;

    // 最佳接触时机
    document.getElementById('bestTiming').innerHTML = `
        <div class="info-item">
            <span class="info-label">最佳联系时间</span>
            <span class="info-value">每月25-30日（月末业务高峰期）</span>
        </div>
        <div class="info-item">
            <span class="info-label">下次跟进时间</span>
            <span class="info-value">2025年11月25日</span>
        </div>
        <div class="info-item">
            <span class="info-label">联系建议</span>
            <span class="info-value">提前预约，准备产品方案</span>
        </div>
    `;
}

// 绘制月度趋势图
function renderMonthlyTrendChart() {
    const data = monthlyTradeData[currentCustomer.id];
    if (!data) return;

    const ctx = document.getElementById('monthlyTrendChart');
    if (!ctx) return;

    if (monthlyTrendChart) {
        monthlyTrendChart.destroy();
    }

    monthlyTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.months,
            datasets: [{
                label: '交易金额（亿元）',
                data: data.amounts,
                borderColor: '#1890ff',
                backgroundColor: 'rgba(24, 144, 255, 0.1)',
                tension: 0.4,
                yAxisID: 'y'
            }, {
                label: '交易笔数',
                data: data.counts,
                borderColor: '#52c41a',
                backgroundColor: 'rgba(82, 196, 26, 0.1)',
                tension: 0.4,
                yAxisID: 'y1'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: '交易金额（亿元）'
                    }
                },
                y1: {
                    type: 'linear',
                    display: true,
                    position: 'right',
                    title: {
                        display: true,
                        text: '交易笔数'
                    },
                    grid: {
                        drawOnChartArea: false,
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}

// 绘制对比图表
function renderTradeCompareChart() {
    const ctx = document.getElementById('tradeCompareChart');
    if (!ctx) return;

    if (tradeCompareChart) {
        tradeCompareChart.destroy();
    }

    tradeCompareChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Q1', 'Q2', 'Q3', 'Q4（预测）'],
            datasets: [{
                label: '2024年',
                data: [280, 320, 350, 380],
                backgroundColor: 'rgba(189, 189, 189, 0.5)',
                borderColor: '#bdbdbd',
                borderWidth: 1
            }, {
                label: '2025年',
                data: [320, 380, 420, 450],
                backgroundColor: 'rgba(24, 144, 255, 0.5)',
                borderColor: '#1890ff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '交易金额（亿元）'
                    }
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top'
                }
            }
        }
    });
}

// 切换标签页
function switchTab(tabName) {
    // 隐藏所有标签页内容
    document.querySelectorAll('.tab-pane').forEach(pane => {
        pane.classList.remove('active');
    });

    // 移除所有标签按钮的active类
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // 显示选中的标签页
    document.getElementById(tabName).classList.add('active');

    // 高亮选中的标签按钮
    event.target.classList.add('active');

    // 如果切换到分析标签页，绘制图表
    if (tabName === 'analysis') {
        setTimeout(() => {
            renderTradeCompareChart();
        }, 100);
    } else if (tabName === 'business') {
        setTimeout(() => {
            renderMonthlyTrendChart();
        }, 100);
    }
}

// 辅助函数

function getIndustryFeature(industry) {
    const features = {
        '能源化工': '资金规模大，票据使用频繁',
        '电子信息': '业务增长快，创新能力强',
        '汽车制造': '供应链完善，票据流转活跃',
        '建筑业': '周期性明显，资金需求大',
        '批发零售': '交易频繁，票据种类多样',
        '金融业': '资金实力雄厚，风险控制严格',
        '食品饮料': '现金流稳定，季节性特征',
        '交通运输': '运营稳定，回款周期固定'
    };
    return features[industry] || '行业特征待分析';
}

function getCreditScore(customer) {
    let score = 80;
    if (customer.creditRating.startsWith('AAA')) score += 15;
    else if (customer.creditRating.startsWith('AA')) score += 10;
    else if (customer.creditRating.startsWith('A')) score += 5;

    if (customer.hasOverdue) score -= 20;
    if (customer.riskLevel === '低') score += 5;
    else if (customer.riskLevel === '高') score -= 10;

    return Math.max(0, Math.min(100, score));
}

function getRiskSuggestion(customer) {
    if (customer.riskLevel === '低') {
        return '可正常开展业务，适当提高授信额度';
    } else if (customer.riskLevel === '中') {
        return '密切关注业务动态，定期评估';
    } else if (customer.riskLevel === '中高') {
        return '加强风险监控，要求提供担保';
    } else {
        return '审慎审批新业务，加强贷后管理';
    }
}

function generateMarketingStrategy(customer) {
    if (customer.rateLevel === '强势客户' && customer.businessVolume === '成长型客户') {
        return `该客户为核心目标客户（${customer.companyType} + 年交易量${formatAmount(customer.yearlyTradeAmount)} + 偏好${customer.preferredTicketType} + 信用评级${customer.creditRating}${customer.hasTicketPool ? ' + 有票据池管理需求' : ''}）。
        建议：客户经理重点跟进，提供优惠利率，${!customer.hasTicketPool ? '推荐票据池综合服务方案，' : ''}建立战略合作关系。`;
    } else if (customer.businessVolume === '衰退或流失预警客户') {
        return `该客户业务量呈下降趋势，需要制定挽回策略。建议：及时沟通了解原因，提供个性化解决方案，优化服务质量，必要时给予利率优惠。`;
    } else if (customer.businessVolume === '新获取客户') {
        return `新获取客户，处于关系建立期。建议：提供优质服务体验，定期回访，了解业务需求，逐步提升客户黏性。`;
    } else {
        return `稳定型客户，建议保持常规服务，定期沟通，挖掘潜在需求，防止客户流失。`;
    }
}

function getRecommendedProducts(customer) {
    const products = [];

    if (!customer.hasTicketPool && customer.yearlyTradeAmount > 10000000000) {
        products.push({
            name: '票据池管理服务',
            reason: '业务量大，适合集中管理'
        });
    }

    if (customer.businessRoles.includes('贴现申请人')) {
        products.push({
            name: '快速贴现通道',
            reason: '频繁贴现需求，提供便捷服务'
        });
    }

    if (customer.preferredTicketType === '银票') {
        products.push({
            name: '银票承兑优惠套餐',
            reason: '偏好银票，提供优惠利率'
        });
    }

    if (customer.rateLevel === '强势客户') {
        products.push({
            name: 'VIP综合金融服务',
            reason: '高价值客户，提供一站式服务'
        });
    }

    if (products.length === 0) {
        products.push({
            name: '标准票据服务',
            reason: '满足日常业务需求'
        });
    }

    return products;
}

function getServiceMethod(customer) {
    if (customer.rateLevel === '强势客户') {
        return '专属客户经理一对一服务';
    } else if (customer.yearlyTradeAmount > 10000000000) {
        return '优先服务通道，定期回访';
    } else {
        return '标准服务，及时响应需求';
    }
}

function getDiscountStrategy(customer) {
    if (customer.rateLevel === '强势客户') {
        return '提供最优利率，手续费优惠';
    } else if (customer.businessVolume === '成长型客户') {
        return '阶梯优惠，业务量越大优惠越多';
    } else if (customer.businessVolume === '衰退或流失预警客户') {
        return '特别优惠，挽回客户';
    } else {
        return '标准利率，节假日优惠活动';
    }
}

function getRelationshipStrategy(customer) {
    if (customer.rateLevel === '强势客户') {
        return '定期高层拜访，建立战略合作';
    } else if (customer.businessVolume === '成长型客户') {
        return '加强互动，培养成核心客户';
    } else {
        return '定期联系，维护良好关系';
    }
}

// 格式化金额
function formatAmount(amount) {
    if (amount >= 100000000000) {
        return (amount / 100000000000).toFixed(1) + '千亿';
    } else if (amount >= 100000000) {
        return (amount / 100000000).toFixed(1) + '亿';
    } else if (amount >= 10000) {
        return (amount / 10000).toFixed(1) + '万';
    }
    return amount.toLocaleString();
}

function getBusinessVolumeBadgeClass(type) {
    const classMap = {
        '新获取客户': 'badge-info',
        '成长型客户': 'badge-success',
        '稳定型客户': 'badge-gray',
        '衰退或流失预警客户': 'badge-warning'
    };
    return classMap[type] || 'badge-gray';
}

function getCreditRatingBadgeClass(rating) {
    if (rating.startsWith('AAA')) return 'badge-success';
    if (rating.startsWith('AA')) return 'badge-info';
    if (rating.startsWith('A')) return 'badge-warning';
    return 'badge-gray';
}

function getRiskBadgeClass(risk) {
    const classMap = {
        '低': 'badge-success',
        '中': 'badge-info',
        '中高': 'badge-warning',
        '高': 'badge-danger'
    };
    return classMap[risk] || 'badge-gray';
}
