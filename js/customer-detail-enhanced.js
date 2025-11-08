// 客户详情页面增强脚本
let currentCustomer = null;
let detailCharts = {};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    loadCustomerData();
});

// 加载客户数据
function loadCustomerData() {
    const customerId = parseInt(localStorage.getItem('selectedCustomerId'));
    currentCustomer = mockCustomers.find(c => c.id === customerId);

    if (!currentCustomer) {
        alert('未找到客户信息');
        window.location.href = 'index.html';
        return;
    }

    renderCustomerOverview();
    renderRiskAlert();
    renderBusinessCharts();
    renderRiskAssessment();
    renderRevenue();
    renderDimensions();
    renderRelationship();
}

// 渲染客户概览
function renderCustomerOverview() {
    // 设置头像图标
    const icons = {
        '能源化工': '⚡',
        '电子信息': '💻',
        '汽车制造': '🚗',
        '建筑业': '🏗️',
        '批发零售': '🏪',
        '金融业': '🏦',
        '食品饮料': '🍜',
        '交通运输': '🚛'
    };
    document.getElementById('customerIcon').textContent = icons[currentCustomer.industry] || '🏢';

    // 设置客户名称
    document.getElementById('customerNameMain').textContent = currentCustomer.name;

    // 设置标签
    document.getElementById('industryTag').textContent = currentCustomer.industry;
    document.getElementById('regionTag').textContent = currentCustomer.region;
    document.getElementById('scaleTag').textContent = currentCustomer.companyScale;

    // 设置徽章
    document.getElementById('rateBadge').querySelector('.badge-text').textContent = currentCustomer.rateLevel;
    document.getElementById('volumeBadge').querySelector('.badge-text').textContent = currentCustomer.businessVolume;

    // 设置关键指标
    document.getElementById('metricAmount').textContent = formatAmount(currentCustomer.yearlyTradeAmount);
    document.getElementById('metricCount').textContent = currentCustomer.yearlyTradeCount.toLocaleString() + ' 笔';
    document.getElementById('metricRating').textContent = currentCustomer.creditRating;

    // 设置客户价值
    const value = currentCustomer.yearlyTradeAmount > 50000000000 ? '高价值' :
                  currentCustomer.yearlyTradeAmount > 10000000000 ? '中等价值' : '一般';
    document.getElementById('metricValue').textContent = value;

    // 设置风险等级
    document.getElementById('metricRisk').textContent = currentCustomer.riskLevel;

    // 设置合作时长
    const registrationDate = new Date(currentCustomer.registrationDate);
    const now = new Date();
    const years = Math.floor((now - registrationDate) / (365 * 24 * 60 * 60 * 1000));
    const months = Math.floor(((now - registrationDate) % (365 * 24 * 60 * 60 * 1000)) / (30 * 24 * 60 * 60 * 1000));
    document.getElementById('metricDuration').textContent = years > 0 ? `${years}年${months}月` : `${months}月`;
}

// 渲染风险预警
function renderRiskAlert() {
    const alertBanner = document.getElementById('riskAlertBanner');

    if (currentCustomer.hasOverdue) {
        alertBanner.innerHTML = `
            <div class="alert alert-danger" style="margin-bottom: 24px;">
                <span class="alert-icon">🚨</span>
                <div>
                    <strong>高风险预警！</strong>
                    该客户存在逾期记录，且授信额度使用率过高（${((currentCustomer.usedCredit / currentCustomer.creditLimit) * 100).toFixed(1)}%），
                    建议加强贷后检查，审慎审批新业务。
                </div>
            </div>
        `;
    } else if (currentCustomer.riskLevel === '中高' || currentCustomer.riskLevel === '高') {
        alertBanner.innerHTML = `
            <div class="alert alert-warning" style="margin-bottom: 24px;">
                <span class="alert-icon">⚠️</span>
                <div>
                    <strong>风险提示：</strong>
                    该客户风险等级为${currentCustomer.riskLevel}，建议密切关注业务动态。
                </div>
            </div>
        `;
    }
}

// 渲染业务图表
function renderBusinessCharts() {
    initTradeTrendChart();
    initBusinessRadarChart();
    initTicketTypeChart();
    initBusinessRoleChart();
    initMonthlyVolumeChart();
}

// 1. 交易趋势图
function initTradeTrendChart() {
    const ctx = document.getElementById('tradeTrendChart');
    if (!ctx) return;

    const data = monthlyTradeData[currentCustomer.id] || {
        months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月'],
        amounts: [100, 110, 120, 115, 125, 130, 135, 140, 145, 150, 120],
        counts: [50, 55, 60, 58, 62, 65, 68, 70, 72, 75, 60]
    };

    detailCharts.tradeTrend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.months,
            datasets: [{
                label: '交易金额（亿元）',
                data: data.amounts,
                borderColor: '#1890ff',
                backgroundColor: 'rgba(24, 144, 255, 0.1)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y',
                pointRadius: 5,
                pointHoverRadius: 8,
                pointBackgroundColor: '#1890ff',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }, {
                label: '交易笔数',
                data: data.counts,
                borderColor: '#52c41a',
                backgroundColor: 'rgba(82, 196, 26, 0.1)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y1',
                pointRadius: 5,
                pointHoverRadius: 8,
                pointBackgroundColor: '#52c41a',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 15
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: '交易金额（亿元）'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
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
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// 2. 业务能力雷达图
function initBusinessRadarChart() {
    const ctx = document.getElementById('businessRadarChart');
    if (!ctx) return;

    // 计算各维度评分
    const scores = {
        '交易规模': Math.min(100, (currentCustomer.yearlyTradeAmount / 100000000000) * 100),
        '交易频率': Math.min(100, (currentCustomer.yearlyTradeCount / 5000) * 100),
        '信用等级': getCreditScore(currentCustomer),
        '业务稳定性': currentCustomer.businessVolume === '稳定型客户' ? 90 :
                       currentCustomer.businessVolume === '成长型客户' ? 85 :
                       currentCustomer.businessVolume === '新获取客户' ? 60 : 50,
        '合作意愿': currentCustomer.rateLevel === '强势客户' ? 95 : 75,
        '盈利贡献': Math.min(100, (currentCustomer.yearlyTradeAmount * 0.002 / 10000000) * 100)
    };

    detailCharts.businessRadar = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: Object.keys(scores),
            datasets: [{
                label: currentCustomer.shortName,
                data: Object.values(scores),
                borderColor: '#1890ff',
                backgroundColor: 'rgba(24, 144, 255, 0.2)',
                pointBackgroundColor: '#1890ff',
                pointBorderColor: '#fff',
                pointHoverBackgroundColor: '#fff',
                pointHoverBorderColor: '#1890ff',
                pointRadius: 5,
                pointHoverRadius: 7
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.1)'
                    },
                    pointLabels: {
                        font: {
                            size: 12
                        }
                    },
                    ticks: {
                        beginAtZero: true,
                        max: 100,
                        stepSize: 20,
                        backdropColor: 'transparent'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed.r.toFixed(0) + '分';
                        }
                    }
                }
            }
        }
    });
}

// 3. 票据类型分布
function initTicketTypeChart() {
    const ctx = document.getElementById('ticketTypeChart');
    if (!ctx) return;

    const data = currentCustomer.preferredTicketType === '银票' ? [75, 25] : [35, 65];

    detailCharts.ticketType = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['银票', '商票'],
            datasets: [{
                data: data,
                backgroundColor: [
                    'rgba(24, 144, 255, 0.8)',
                    'rgba(82, 196, 26, 0.8)'
                ],
                borderWidth: 3,
                borderColor: '#fff',
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 15,
                        font: {
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return context.label + ': ' + context.parsed + '%';
                        }
                    }
                }
            }
        }
    });
}

// 4. 业务角色分布
function initBusinessRoleChart() {
    const ctx = document.getElementById('businessRoleChart');
    if (!ctx) return;

    const roles = currentCustomer.businessRoles;
    const allRoles = ['出票人', '收票人', '背书人', '贴现申请人'];

    // 为每个角色生成更真实的业务量占比
    const roleData = {};
    const baseValues = {
        '出票人': 30,
        '收票人': 25,
        '背书人': 20,
        '贴现申请人': 35
    };

    // 计算实际参与角色的数据
    let totalValue = 0;
    roles.forEach(role => {
        const variance = (Math.random() - 0.5) * 10; // ±5%的随机波动
        roleData[role] = baseValues[role] + variance;
        totalValue += roleData[role];
    });

    // 归一化到100%
    roles.forEach(role => {
        roleData[role] = (roleData[role] / totalValue) * 100;
    });

    // 生成图表数据
    const chartData = allRoles.map(role => roleData[role] || 0);
    const activeLabels = allRoles.filter((role, idx) => chartData[idx] > 0);
    const activeData = chartData.filter(d => d > 0);
    const activeColors = [
        'rgba(24, 144, 255, 0.8)',
        'rgba(82, 196, 26, 0.8)',
        'rgba(250, 173, 20, 0.8)',
        'rgba(245, 34, 45, 0.8)'
    ].filter((_, idx) => chartData[idx] > 0);

    detailCharts.businessRole = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: activeLabels,
            datasets: [{
                data: activeData,
                backgroundColor: activeColors,
                borderWidth: 2,
                borderColor: '#fff',
                hoverOffset: 10
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        padding: 10,
                        font: {
                            size: 11
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const percentage = context.parsed.toFixed(1);
                            return context.label + ': ' + percentage + '%';
                        }
                    }
                }
            }
        }
    });
}

// 5. 月度业务量
function initMonthlyVolumeChart() {
    const ctx = document.getElementById('monthlyVolumeChart');
    if (!ctx) return;

    // 获取该客户的月度数据，如果没有则生成模拟数据
    const customerMonthlyData = monthlyTradeData[currentCustomer.id];
    let months, data;

    if (customerMonthlyData) {
        months = customerMonthlyData.months;
        data = customerMonthlyData.counts;
    } else {
        // 如果没有预设数据，则生成合理的模拟数据
        months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月'];
        const avgMonthly = currentCustomer.yearlyTradeCount / 11;
        data = months.map((_, i) => {
            const variation = (Math.random() - 0.5) * 0.3;
            return Math.round(avgMonthly * (1 + variation));
        });
    }

    detailCharts.monthlyVolume = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: months,
            datasets: [{
                label: '交易笔数',
                data: data,
                backgroundColor: 'rgba(24, 144, 255, 0.8)',
                borderColor: '#1890ff',
                borderWidth: 2,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            return '交易笔数: ' + context.parsed.y.toLocaleString() + ' 笔';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '交易笔数',
                        font: {
                            size: 12,
                            weight: '600'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    },
                    ticks: {
                        callback: function(value) {
                            return value.toLocaleString();
                        }
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// 渲染风险评估
function renderRiskAssessment() {
    initRiskGaugeChart();
    renderCreditUsage();
    renderRiskIndicators();
}

// 风险仪表盘
function initRiskGaugeChart() {
    const ctx = document.getElementById('riskGaugeChart');
    if (!ctx) return;

    const score = getCreditScore(currentCustomer);
    document.getElementById('riskScoreText').textContent = score;

    // 根据分数设置颜色
    const scoreColor = score >= 80 ? '#52c41a' : score >= 60 ? '#1890ff' : score >= 40 ? '#faad14' : '#f5222d';
    document.getElementById('riskScoreText').style.color = scoreColor;

    // 设置描述
    const desc = score >= 80 ? '风险可控，建议保持现有策略' :
                 score >= 60 ? '风险较低，建议定期监控' :
                 score >= 40 ? '风险偏高，建议加强管理' :
                 '高风险，建议立即处理';
    document.getElementById('riskLevelDesc').textContent = desc;

    detailCharts.riskGauge = new Chart(ctx, {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [score, 100 - score],
                backgroundColor: [scoreColor, '#f0f0f0'],
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '75%',
            rotation: -90,
            circumference: 180,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            }
        }
    });
}

// 授信使用情况
function renderCreditUsage() {
    const total = currentCustomer.creditLimit;
    const used = currentCustomer.usedCredit;
    const available = total - used;
    const usageRate = (used / total) * 100;

    document.getElementById('creditTotal').textContent = formatAmount(total);
    document.getElementById('creditUsed').textContent = formatAmount(used);
    document.getElementById('creditAvailable').textContent = formatAmount(available);
    document.getElementById('creditUsageFill').style.width = usageRate + '%';
    document.getElementById('creditUsageText').textContent = `使用率: ${usageRate.toFixed(1)}%`;

    // 设置颜色
    const fill = document.getElementById('creditUsageFill');
    if (usageRate > 80) {
        fill.style.background = 'linear-gradient(90deg, #f5222d, #ff4d4f)';
    } else if (usageRate > 60) {
        fill.style.background = 'linear-gradient(90deg, #faad14, #ffc53d)';
    }
}

// 风险指标
function renderRiskIndicators() {
    const indicators = [];

    // 信用评级
    indicators.push({
        name: '信用评级',
        status: currentCustomer.creditRating.startsWith('AAA') ? 'good' :
                currentCustomer.creditRating.startsWith('AA') ? 'good' : 'warning',
        text: currentCustomer.creditRating.startsWith('AAA') ? '优秀' :
              currentCustomer.creditRating.startsWith('AA') ? '良好' : '一般'
    });

    // 逾期记录
    indicators.push({
        name: '逾期记录',
        status: currentCustomer.hasOverdue ? 'bad' : 'good',
        text: currentCustomer.hasOverdue ? '存在逾期' : '无逾期'
    });

    // 授信使用率
    const usageRate = (currentCustomer.usedCredit / currentCustomer.creditLimit) * 100;
    indicators.push({
        name: '授信使用率',
        status: usageRate > 80 ? 'bad' : usageRate > 60 ? 'warning' : 'good',
        text: usageRate > 80 ? '偏高' : usageRate > 60 ? '正常' : '良好'
    });

    // 业务活跃度
    indicators.push({
        name: '业务活跃度',
        status: currentCustomer.businessVolume === '稳定型客户' || currentCustomer.businessVolume === '成长型客户' ? 'good' : 'warning',
        text: currentCustomer.businessVolume === '稳定型客户' || currentCustomer.businessVolume === '成长型客户' ? '活跃' : '待提升'
    });

    const html = indicators.map(ind => `
        <div class="risk-indicator-item">
            <span class="indicator-name">${ind.name}</span>
            <span class="indicator-status ${ind.status}">${ind.text}</span>
        </div>
    `).join('');

    document.getElementById('riskIndicatorList').innerHTML = html;
}

// 渲染收益分析
function renderRevenue() {
    const totalRevenue = currentCustomer.yearlyTradeAmount * 0.002; // 0.2%收益率
    const acceptanceRevenue = totalRevenue * 0.6;
    const discountRevenue = totalRevenue * 0.4;

    document.getElementById('totalRevenue').textContent = formatAmount(totalRevenue);
    document.getElementById('acceptanceRevenue').textContent = formatAmount(acceptanceRevenue);
    document.getElementById('discountRevenue').textContent = formatAmount(discountRevenue);

    // 客户排名
    const sortedCustomers = [...mockCustomers].sort((a, b) => b.yearlyTradeAmount - a.yearlyTradeAmount);
    const rank = sortedCustomers.findIndex(c => c.id === currentCustomer.id) + 1;
    document.getElementById('customerRank').textContent = `TOP ${rank}`;

    // 收益趋势图
    initRevenueChart();
}

// 收益趋势图
function initRevenueChart() {
    const ctx = document.getElementById('revenueChartCanvas');
    if (!ctx) return;

    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月'];
    const avgRevenue = (currentCustomer.yearlyTradeAmount * 0.002) / 11;
    const data = months.map(() => {
        const variation = (Math.random() - 0.5) * 0.3;
        return avgRevenue * (1 + variation) / 10000; // 转换为万元
    });

    detailCharts.revenue = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [{
                label: '收益（万元）',
                data: data,
                borderColor: '#52c41a',
                backgroundColor: 'rgba(82, 196, 26, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 4,
                pointBackgroundColor: '#52c41a'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                x: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// 渲染画像维度
function renderDimensions() {
    const dimensions = [
        {
            icon: '💎',
            title: '利率维度',
            details: [
                { label: '客户等级', value: currentCustomer.rateLevel },
                { label: '利率优势', value: currentCustomer.rateLevel === '强势客户' ? '可获得最优利率' : '普通利率' }
            ]
        },
        {
            icon: '🏭',
            title: '行业分类',
            details: [
                { label: '所属行业', value: currentCustomer.industry },
                { label: '行业特征', value: getIndustryFeature(currentCustomer.industry) }
            ]
        },
        {
            icon: '🎯',
            title: '业务量维度',
            details: [
                { label: '客户分类', value: currentCustomer.businessVolume },
                { label: '入网时间', value: currentCustomer.registrationDate },
                { label: '年交易额', value: formatAmount(currentCustomer.yearlyTradeAmount) }
            ]
        },
        {
            icon: '🎫',
            title: '票据业务',
            details: [
                { label: '偏好票据', value: currentCustomer.preferredTicketType },
                { label: '业务角色', value: currentCustomer.businessRoles.join('、') },
                { label: '平均票面', value: formatAmount(currentCustomer.avgTicketAmount) }
            ]
        }
    ];

    const html = dimensions.map((dim, index) => `
        <div class="dimension-accordion-item ${index === 0 ? 'active' : ''}" onclick="toggleDimension(this)">
            <div class="dimension-accordion-header">
                <div class="dimension-accordion-title">
                    <span class="dimension-accordion-icon">${dim.icon}</span>
                    ${dim.title}
                </div>
                <span class="dimension-accordion-arrow">▼</span>
            </div>
            <div class="dimension-accordion-body">
                <div class="dimension-accordion-content">
                    <div class="dimension-detail-grid">
                        ${dim.details.map(detail => `
                            <div class="dimension-detail-item">
                                <span class="dimension-detail-label">${detail.label}</span>
                                <span class="dimension-detail-value">${detail.value}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    document.getElementById('dimensionsAccordion').innerHTML = html;
}

// 切换手风琴
function toggleDimension(element) {
    const isActive = element.classList.contains('active');

    // 关闭所有
    document.querySelectorAll('.dimension-accordion-item').forEach(item => {
        item.classList.remove('active');
    });

    // 打开当前
    if (!isActive) {
        element.classList.add('active');
    }
}

// 渲染关系管理
function renderRelationship() {
    document.getElementById('managerName').textContent = currentCustomer.customerManager;
    document.getElementById('managerPhone').textContent = currentCustomer.phone;
    document.getElementById('registrationDate').textContent = currentCustomer.registrationDate;
    document.getElementById('lastTradeDate').textContent = currentCustomer.lastTradeDate;
}

// 辅助函数
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
