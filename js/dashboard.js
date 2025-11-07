// 仪表板图表管理
let charts = {};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initializeDashboard();
});

// 初始化仪表板
function initializeDashboard() {
    initMonthlyTrendChart();
    initIndustryPieChart();
    initRegionBarChart();
    initRiskDoughnutChart();
    initCustomerTypePieChart();
    initTicketTypeCompareChart();
    initCustomerGrowthChart();
    initCustomerValueScatterChart();
    initIndustryHeatmap();
    initIndustryAnalysis();
    initMonitorCharts();
}

// 1. 月度交易趋势图
function initMonthlyTrendChart() {
    const ctx = document.getElementById('monthlyTrendChart');
    if (!ctx) return;

    charts.monthlyTrend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月'],
            datasets: [{
                label: '交易金额（亿元）',
                data: [980, 1050, 1120, 1180, 1250, 1320, 1280, 1350, 1420, 1480, 1100],
                borderColor: '#1890ff',
                backgroundColor: 'rgba(24, 144, 255, 0.1)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y',
                pointRadius: 5,
                pointHoverRadius: 7,
                pointBackgroundColor: '#1890ff',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }, {
                label: '交易笔数',
                data: [1850, 1920, 2010, 2100, 2180, 2250, 2200, 2320, 2400, 2480, 2150],
                borderColor: '#52c41a',
                backgroundColor: 'rgba(82, 196, 26, 0.1)',
                tension: 0.4,
                fill: true,
                yAxisID: 'y1',
                pointRadius: 5,
                pointHoverRadius: 7,
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
                        padding: 15,
                        font: {
                            size: 12,
                            weight: '500'
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: {
                        size: 14,
                        weight: 'bold'
                    },
                    bodyFont: {
                        size: 13
                    },
                    borderColor: '#1890ff',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    type: 'linear',
                    display: true,
                    position: 'left',
                    title: {
                        display: true,
                        text: '交易金额（亿元）',
                        font: {
                            size: 12,
                            weight: '600'
                        }
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
                        text: '交易笔数',
                        font: {
                            size: 12,
                            weight: '600'
                        }
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

// 2. 行业分布饼图
function initIndustryPieChart() {
    const ctx = document.getElementById('industryPieChart');
    if (!ctx) return;

    charts.industryPie = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: industryDistribution.map(i => i.name),
            datasets: [{
                data: industryDistribution.map(i => i.count),
                backgroundColor: [
                    '#1890ff',
                    '#52c41a',
                    '#faad14',
                    '#f5222d',
                    '#13c2c2',
                    '#722ed1',
                    '#eb2f96',
                    '#fa8c16'
                ],
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
                    position: 'right',
                    labels: {
                        padding: 15,
                        font: {
                            size: 11
                        },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            return data.labels.map((label, i) => {
                                const value = data.datasets[0].data[i];
                                return {
                                    text: `${label} (${value})`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    hidden: false,
                                    index: i
                                };
                            });
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value}家 (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// 3. 地区分布条形图
function initRegionBarChart() {
    const ctx = document.getElementById('regionBarChart');
    if (!ctx) return;

    charts.regionBar = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: regionDistribution.map(r => r.name),
            datasets: [{
                label: '客户数量',
                data: regionDistribution.map(r => r.count),
                backgroundColor: [
                    'rgba(24, 144, 255, 0.8)',
                    'rgba(82, 196, 26, 0.8)',
                    'rgba(250, 173, 20, 0.8)',
                    'rgba(245, 34, 45, 0.8)',
                    'rgba(19, 194, 194, 0.8)',
                    'rgba(114, 46, 209, 0.8)'
                ],
                borderColor: [
                    '#1890ff',
                    '#52c41a',
                    '#faad14',
                    '#f5222d',
                    '#13c2c2',
                    '#722ed1'
                ],
                borderWidth: 2,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    callbacks: {
                        afterLabel: function(context) {
                            const index = context.dataIndex;
                            const amount = regionDistribution[index].amount;
                            return `交易额: ${formatAmount(amount)}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    grid: {
                        display: false
                    }
                }
            }
        }
    });
}

// 4. 风险等级环形图
function initRiskDoughnutChart() {
    const ctx = document.getElementById('riskDoughnutChart');
    if (!ctx) return;

    charts.riskDoughnut = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: riskDistribution.map(r => r.level + '风险'),
            datasets: [{
                data: riskDistribution.map(r => r.count),
                backgroundColor: [
                    'rgba(82, 196, 26, 0.8)',
                    'rgba(24, 144, 255, 0.8)',
                    'rgba(250, 173, 20, 0.8)',
                    'rgba(245, 34, 45, 0.8)'
                ],
                borderWidth: 3,
                borderColor: '#fff',
                hoverOffset: 15
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '65%',
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
                            const label = context.label || '';
                            const value = context.parsed;
                            const percentage = riskDistribution[context.dataIndex].percentage;
                            return `${label}: ${value}家 (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// 5. 客户类型饼图
function initCustomerTypePieChart() {
    const ctx = document.getElementById('customerTypePieChart');
    if (!ctx) return;

    charts.customerTypePie = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: customerTypeDistribution.map(c => c.type),
            datasets: [{
                data: customerTypeDistribution.map(c => c.count),
                backgroundColor: [
                    'rgba(24, 144, 255, 0.8)',
                    'rgba(82, 196, 26, 0.8)',
                    'rgba(189, 189, 189, 0.8)',
                    'rgba(250, 173, 20, 0.8)'
                ],
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
                        padding: 12,
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
                            const label = context.label || '';
                            const value = context.parsed;
                            const percentage = customerTypeDistribution[context.dataIndex].percentage;
                            return `${label}: ${value}家 (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// 6. 票据种类对比图
function initTicketTypeCompareChart() {
    const ctx = document.getElementById('ticketTypeCompareChart');
    if (!ctx) return;

    charts.ticketTypeCompare = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月'],
            datasets: [{
                label: '银票',
                data: [680, 720, 780, 820, 870, 910, 890, 940, 990, 1030, 760],
                backgroundColor: 'rgba(24, 144, 255, 0.8)',
                borderColor: '#1890ff',
                borderWidth: 2,
                borderRadius: 6
            }, {
                label: '商票',
                data: [300, 330, 340, 360, 380, 410, 390, 410, 430, 450, 340],
                backgroundColor: 'rgba(82, 196, 26, 0.8)',
                borderColor: '#52c41a',
                borderWidth: 2,
                borderRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
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
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '交易金额（亿元）'
                    },
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

// 7. 客户增长趋势图
function initCustomerGrowthChart() {
    const ctx = document.getElementById('customerGrowthChart');
    if (!ctx) return;

    charts.customerGrowth = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月'],
            datasets: [{
                label: '累计客户数',
                data: [78, 82, 85, 89, 92, 95, 98, 101, 103, 105, 106],
                borderColor: '#722ed1',
                backgroundColor: 'rgba(114, 46, 209, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointBackgroundColor: '#722ed1',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
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
                    title: {
                        display: true,
                        text: '客户数量'
                    },
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

// 8. 客户价值散点图
function initCustomerValueScatterChart() {
    const ctx = document.getElementById('customerValueScatterChart');
    if (!ctx) return;

    // 准备散点数据
    const scatterData = mockCustomers.map(customer => ({
        x: customer.yearlyTradeAmount / 100000000, // 转换为亿元
        y: customer.yearlyTradeCount,
        label: customer.shortName,
        riskLevel: customer.riskLevel,
        businessVolume: customer.businessVolume
    }));

    // 按业务类型分组
    const newCustomers = scatterData.filter(d => d.businessVolume === '新获取客户');
    const growingCustomers = scatterData.filter(d => d.businessVolume === '成长型客户');
    const stableCustomers = scatterData.filter(d => d.businessVolume === '稳定型客户');
    const decliningCustomers = scatterData.filter(d => d.businessVolume === '衰退或流失预警客户');

    charts.customerValueScatter = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [{
                label: '新获取客户',
                data: newCustomers,
                backgroundColor: 'rgba(24, 144, 255, 0.6)',
                borderColor: '#1890ff',
                borderWidth: 2,
                pointRadius: 8,
                pointHoverRadius: 12
            }, {
                label: '成长型客户',
                data: growingCustomers,
                backgroundColor: 'rgba(82, 196, 26, 0.6)',
                borderColor: '#52c41a',
                borderWidth: 2,
                pointRadius: 8,
                pointHoverRadius: 12
            }, {
                label: '稳定型客户',
                data: stableCustomers,
                backgroundColor: 'rgba(189, 189, 189, 0.6)',
                borderColor: '#bdbdbd',
                borderWidth: 2,
                pointRadius: 8,
                pointHoverRadius: 12
            }, {
                label: '衰退或流失预警客户',
                data: decliningCustomers,
                backgroundColor: 'rgba(250, 173, 20, 0.6)',
                borderColor: '#faad14',
                borderWidth: 2,
                pointRadius: 8,
                pointHoverRadius: 12
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
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
                    padding: 12,
                    callbacks: {
                        title: function(context) {
                            return context[0].raw.label;
                        },
                        label: function(context) {
                            const data = context.raw;
                            return [
                                `年交易额: ${data.x.toFixed(1)}亿元`,
                                `年交易笔数: ${data.y}笔`,
                                `风险等级: ${data.riskLevel}`
                            ];
                        }
                    }
                }
            },
            scales: {
                x: {
                    type: 'logarithmic',
                    title: {
                        display: true,
                        text: '年交易额（亿元）- 对数刻度',
                        font: {
                            size: 13,
                            weight: '600'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '年交易笔数',
                        font: {
                            size: 13,
                            weight: '600'
                        }
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.05)'
                    }
                }
            }
        }
    });
}

// 9. 实时监控小图表
function initMonitorCharts() {
    // 今日新增票据趋势
    const ctx1 = document.getElementById('todayTicketsChart');
    if (ctx1) {
        charts.todayTickets = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: Array.from({length: 24}, (_, i) => `${i}时`),
                datasets: [{
                    data: [20, 25, 30, 28, 35, 40, 50, 65, 80, 90, 85, 75, 70, 80, 85, 90, 95, 88, 82, 75, 60, 50, 40, 30],
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                scales: {
                    x: { display: false },
                    y: { display: false }
                }
            }
        });
    }

    // 贴现业务量
    const ctx2 = document.getElementById('discountChart');
    if (ctx2) {
        charts.discount = new Chart(ctx2, {
            type: 'bar',
            data: {
                labels: Array.from({length: 24}, (_, i) => `${i}时`),
                datasets: [{
                    data: [15, 18, 22, 20, 25, 30, 35, 45, 55, 60, 58, 52, 48, 55, 58, 62, 65, 60, 56, 50, 42, 35, 28, 22],
                    backgroundColor: 'rgba(255, 255, 255, 0.6)',
                    borderRadius: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                scales: {
                    x: { display: false },
                    y: { display: false }
                }
            }
        });
    }

    // 平均处理时长
    const ctx3 = document.getElementById('processingTimeChart');
    if (ctx3) {
        charts.processingTime = new Chart(ctx3, {
            type: 'line',
            data: {
                labels: Array.from({length: 24}, (_, i) => `${i}时`),
                datasets: [{
                    data: [3.2, 3.0, 2.8, 2.6, 2.5, 2.3, 2.2, 2.1, 2.0, 1.9, 2.0, 2.1, 2.2, 2.1, 2.0, 1.9, 1.8, 2.0, 2.2, 2.4, 2.6, 2.8, 3.0, 3.1],
                    borderColor: 'rgba(255, 255, 255, 0.8)',
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    borderWidth: 2,
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                },
                scales: {
                    x: { display: false },
                    y: { display: false }
                }
            }
        });
    }

    // 业务成功率
    const ctx4 = document.getElementById('successRateChart');
    if (ctx4) {
        charts.successRate = new Chart(ctx4, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [98.7, 1.3],
                    backgroundColor: [
                        'rgba(255, 255, 255, 0.9)',
                        'rgba(255, 255, 255, 0.2)'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '75%',
                plugins: {
                    legend: { display: false },
                    tooltip: { enabled: false }
                }
            }
        });
    }
}

// 切换图表类型
function switchChartType(type) {
    // 更新按钮状态
    const buttons = document.querySelectorAll('.chart-action-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    // 重新渲染图表
    if (charts.monthlyTrend) {
        charts.monthlyTrend.destroy();
    }

    const ctx = document.getElementById('monthlyTrendChart');
    const config = {
        type: type,
        data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月'],
            datasets: [{
                label: '交易金额（亿元）',
                data: [980, 1050, 1120, 1180, 1250, 1320, 1280, 1350, 1420, 1480, 1100],
                borderColor: '#1890ff',
                backgroundColor: type === 'bar' ? 'rgba(24, 144, 255, 0.8)' : 'rgba(24, 144, 255, 0.1)',
                tension: 0.4,
                fill: type === 'line',
                borderWidth: 2,
                borderRadius: type === 'bar' ? 6 : 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    grid: { color: 'rgba(0, 0, 0, 0.05)' }
                },
                x: {
                    grid: { display: false }
                }
            }
        }
    };

    charts.monthlyTrend = new Chart(ctx, config);
}

// 刷新数据
function refreshData() {
    const btn = event.target;
    const originalText = btn.innerHTML;
    btn.innerHTML = '<span class="loading-spinner"></span> 刷新中...';
    btn.disabled = true;

    setTimeout(() => {
        // 模拟数据刷新
        btn.innerHTML = originalText;
        btn.disabled = false;
        showNotification('数据已刷新', 'success');
    }, 1500);
}

// 导出报告
function exportReport() {
    showNotification('报告生成中，请稍候...', 'info');

    setTimeout(() => {
        showNotification('报告已生成并下载', 'success');
    }, 2000);
}

// 排序功能
function sortBy(field) {
    showNotification(`按${field === 'amount' ? '金额' : field === 'count' ? '笔数' : '增长率'}排序`, 'info');
}

// 显示通知
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <span class="notification-icon">${type === 'success' ? '✓' : type === 'error' ? '✗' : 'ℹ'}</span>
        <span class="notification-message">${message}</span>
    `;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
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

// 行业贴现量热力图数据
let heatmapData = {
    current: 'amount', // 当前显示指标：amount, count, growth
    data: {}
};

// 9. 行业贴现量热力图
function initIndustryHeatmap() {
    // 生成热力图数据
    generateHeatmapData();

    // 渲染热力图
    renderHeatmap('amount');
}

// 生成热力图模拟数据
function generateHeatmapData() {
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月'];
    const industries = industryDistribution.map(i => i.name);

    heatmapData.data = {
        amount: {}, // 贴现金额（亿元）
        count: {},  // 贴现笔数
        growth: {}  // 增长率（%）
    };

    // 为每个行业生成11个月的数据
    industries.forEach((industry, idx) => {
        heatmapData.data.amount[industry] = [];
        heatmapData.data.count[industry] = [];
        heatmapData.data.growth[industry] = [];

        // 基准值（基于行业分布数据）
        const baseAmount = industryDistribution[idx].amount / 100000000 / 11; // 转为亿元并平均
        const baseCount = industryDistribution[idx].count * 50; // 每月平均笔数

        for (let i = 0; i < 11; i++) {
            // 生成金额数据（带波动）
            const seasonFactor = 1 + Math.sin(i / 11 * Math.PI * 2) * 0.3; // 季节性波动
            const randomFactor = 0.8 + Math.random() * 0.4; // 随机波动 ±20%
            const amount = Math.round(baseAmount * seasonFactor * randomFactor);
            heatmapData.data.amount[industry].push(amount);

            // 生成笔数数据（带波动）
            const count = Math.round(baseCount * seasonFactor * randomFactor);
            heatmapData.data.count[industry].push(count);

            // 计算增长率（相比上月，第一个月为0）
            if (i === 0) {
                heatmapData.data.growth[industry].push(0);
            } else {
                const prevAmount = heatmapData.data.amount[industry][i - 1];
                const growth = ((amount - prevAmount) / prevAmount * 100);
                heatmapData.data.growth[industry].push(Math.round(growth * 10) / 10);
            }
        }
    });
}

// 渲染热力图
function renderHeatmap(metric) {
    const container = document.getElementById('industryHeatmap');
    if (!container) return;

    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月'];
    const industries = industryDistribution.map(i => i.name);
    const data = heatmapData.data[metric];

    // 计算数据范围用于颜色映射
    let allValues = [];
    industries.forEach(industry => {
        allValues = allValues.concat(data[industry]);
    });
    const minValue = Math.min(...allValues);
    const maxValue = Math.max(...allValues);

    // 生成HTML
    let html = '<div class="heatmap-grid">';

    // 表头（空白 + 月份）
    html += '<div class="heatmap-header-cell"></div>';
    months.forEach(month => {
        html += `<div class="heatmap-header-cell">${month}</div>`;
    });

    // 数据行
    industries.forEach((industry, rowIdx) => {
        // 行标签
        html += `<div class="heatmap-row-label">${industry}</div>`;

        // 数据单元格
        data[industry].forEach((value, colIdx) => {
            const level = getColorLevel(value, minValue, maxValue, metric);
            const formattedValue = formatHeatmapValue(value, metric);

            html += `
                <div class="heatmap-cell level-${level}"
                     data-industry="${industry}"
                     data-month="${months[colIdx]}"
                     data-value="${value}"
                     data-metric="${metric}"
                     onmouseenter="showHeatmapTooltip(event, '${industry}', '${months[colIdx]}', ${value}, '${metric}')"
                     onmouseleave="hideHeatmapTooltip()">
                    ${formattedValue}
                </div>
            `;
        });
    });

    html += '</div>';
    container.innerHTML = html;
}

// 计算颜色等级（0-10）
function getColorLevel(value, min, max, metric) {
    if (metric === 'growth') {
        // 增长率使用不同的映射逻辑
        if (value < -20) return 0;
        if (value < -10) return 1;
        if (value < -5) return 2;
        if (value < 0) return 3;
        if (value < 5) return 4;
        if (value < 10) return 5;
        if (value < 15) return 6;
        if (value < 20) return 7;
        if (value < 30) return 8;
        if (value < 40) return 9;
        return 10;
    }

    // 金额和笔数使用线性映射
    if (max === min) return 5;
    const ratio = (value - min) / (max - min);
    return Math.min(10, Math.floor(ratio * 11));
}

// 格式化热力图显示值
function formatHeatmapValue(value, metric) {
    if (metric === 'amount') {
        if (value >= 1000) {
            return (value / 1000).toFixed(1) + '千亿';
        }
        return value.toFixed(0) + '亿';
    } else if (metric === 'count') {
        if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'k';
        }
        return value.toString();
    } else if (metric === 'growth') {
        return value >= 0 ? '+' + value.toFixed(1) + '%' : value.toFixed(1) + '%';
    }
    return value.toString();
}

// 显示热力图提示框
function showHeatmapTooltip(event, industry, month, value, metric) {
    // 移除已有的提示框
    hideHeatmapTooltip();

    // 创建提示框
    const tooltip = document.createElement('div');
    tooltip.className = 'heatmap-tooltip';
    tooltip.id = 'heatmapTooltip';

    let metricLabel = '';
    let metricValue = '';

    if (metric === 'amount') {
        metricLabel = '贴现金额';
        metricValue = value >= 1000 ? (value / 1000).toFixed(2) + ' 千亿元' : value.toFixed(2) + ' 亿元';
    } else if (metric === 'count') {
        metricLabel = '贴现笔数';
        metricValue = value.toLocaleString() + ' 笔';
    } else if (metric === 'growth') {
        metricLabel = '增长率';
        metricValue = (value >= 0 ? '+' : '') + value.toFixed(2) + '%';
    }

    tooltip.innerHTML = `
        <div class="tooltip-title">${industry} - ${month}</div>
        <div class="tooltip-content">
            <strong>${metricLabel}:</strong> ${metricValue}
        </div>
    `;

    document.body.appendChild(tooltip);

    // 定位提示框
    const rect = event.target.getBoundingClientRect();
    tooltip.style.left = (rect.left + rect.width / 2) + 'px';
    tooltip.style.top = (rect.top - 10) + 'px';

    // 添加显示类
    setTimeout(() => {
        tooltip.classList.add('show');
    }, 10);
}

// 隐藏热力图提示框
function hideHeatmapTooltip() {
    const tooltip = document.getElementById('heatmapTooltip');
    if (tooltip) {
        tooltip.classList.remove('show');
        setTimeout(() => {
            if (tooltip.parentNode) {
                tooltip.parentNode.removeChild(tooltip);
            }
        }, 200);
    }
}

// 更新热力图指标
function updateHeatmapMetric() {
    const metric = document.getElementById('heatmapMetric').value;
    heatmapData.current = metric;
    renderHeatmap(metric);
}

// 行业综合分析数据
let industryAnalysisData = {
    currentIndustry: '全部',
    currentSort: 'amount',
    currentSortOrder: 'desc'
};

// 初始化行业综合分析
function initIndustryAnalysis() {
    updateIndustryAnalysis();
}

// 更新行业综合分析
function updateIndustryAnalysis() {
    const industry = document.getElementById('industrySelector').value;
    industryAnalysisData.currentIndustry = industry;

    // 筛选该行业的客户
    const filteredCustomers = industry === '全部'
        ? mockCustomers
        : mockCustomers.filter(c => c.industry === industry);

    // 更新概览数据
    updateIndustryOverview(filteredCustomers);

    // 更新表格
    updateIndustryTable(filteredCustomers);

    // 更新风险分布
    updateIndustryRiskDistribution(filteredCustomers);
}

// 更新行业概览数据
function updateIndustryOverview(customers) {
    // 客户数
    document.getElementById('industryCustomerCount').textContent = customers.length;

    // 总交易额
    const totalAmount = customers.reduce((sum, c) => sum + c.yearlyTradeAmount, 0);
    document.getElementById('industryTotalAmount').textContent = formatAmount(totalAmount);

    // 总交易笔数
    const totalCount = customers.reduce((sum, c) => sum + c.yearlyTradeCount, 0);
    document.getElementById('industryTotalCount').textContent = totalCount.toLocaleString();

    // 平均风险等级
    const riskScores = { '低': 1, '中': 2, '中高': 3, '高': 4 };
    const avgRiskScore = customers.reduce((sum, c) => sum + (riskScores[c.riskLevel] || 2), 0) / customers.length;
    let avgRisk = '中风险';
    if (avgRiskScore < 1.5) avgRisk = '低风险';
    else if (avgRiskScore < 2.5) avgRisk = '中风险';
    else if (avgRiskScore < 3.5) avgRisk = '中高风险';
    else avgRisk = '高风险';
    document.getElementById('industryAvgRisk').textContent = avgRisk;

    // 强势客户占比
    const premiumCount = customers.filter(c => c.rateLevel === '强势客户').length;
    const premiumRate = customers.length > 0 ? (premiumCount / customers.length * 100).toFixed(1) : 0;
    document.getElementById('industryPremiumRate').textContent = premiumRate + '%';
}

// 更新行业表格
function updateIndustryTable(customers) {
    const sortedCustomers = sortCustomers(customers, industryAnalysisData.currentSort, industryAnalysisData.currentSortOrder);
    renderIndustryTable(sortedCustomers);
}

// 排序客户数据
function sortCustomers(customers, sortBy, order = 'desc') {
    const sorted = [...customers].sort((a, b) => {
        let valueA, valueB;

        switch(sortBy) {
            case 'amount':
                valueA = a.yearlyTradeAmount;
                valueB = b.yearlyTradeAmount;
                break;
            case 'count':
                valueA = a.yearlyTradeCount;
                valueB = b.yearlyTradeCount;
                break;
            case 'risk':
                const riskScores = { '低': 1, '中': 2, '中高': 3, '高': 4 };
                valueA = riskScores[a.riskLevel] || 2;
                valueB = riskScores[b.riskLevel] || 2;
                break;
            case 'credit':
                const creditScores = { 'AAA': 5, 'AA+': 4.5, 'AA': 4, 'A+': 3.5, 'A': 3, 'BBB+': 2.5, 'BBB': 2, 'BB': 1 };
                valueA = creditScores[a.creditRating] || 0;
                valueB = creditScores[b.creditRating] || 0;
                break;
            default:
                valueA = a.yearlyTradeAmount;
                valueB = b.yearlyTradeAmount;
        }

        return order === 'desc' ? valueB - valueA : valueA - valueB;
    });

    return sorted;
}

// 渲染行业表格
function renderIndustryTable(customers) {
    const tbody = document.getElementById('industryTableBody');
    if (!tbody) return;

    let html = '';

    customers.forEach((customer, index) => {
        const rank = index + 1;
        const rankClass = rank === 1 ? 'top-1' : rank === 2 ? 'top-2' : rank === 3 ? 'top-3' : 'normal';

        // 客户类型徽章
        let typeBadge = '';
        if (customer.businessVolume === '新获取客户') {
            typeBadge = '<span class="badge badge-new">新获取</span>';
        } else if (customer.businessVolume === '成长型客户') {
            typeBadge = '<span class="badge badge-growing">成长型</span>';
        } else if (customer.businessVolume === '稳定型客户') {
            typeBadge = '<span class="badge badge-stable">稳定型</span>';
        } else if (customer.businessVolume === '衰退或流失预警客户') {
            typeBadge = '<span class="badge badge-declining">衰退预警</span>';
        }

        // 信用评级徽章
        const creditClass = customer.creditRating.toLowerCase().replace('+', '');
        const creditBadge = `<span class="badge-credit ${creditClass}">${customer.creditRating}</span>`;

        // 风险等级徽章
        let riskBadge = '';
        if (customer.riskLevel === '低') {
            riskBadge = '<span class="risk-badge risk-low">低风险</span>';
        } else if (customer.riskLevel === '中') {
            riskBadge = '<span class="risk-badge risk-medium">中风险</span>';
        } else if (customer.riskLevel === '中高') {
            riskBadge = '<span class="risk-badge risk-high">中高风险</span>';
        } else if (customer.riskLevel === '高') {
            riskBadge = '<span class="risk-badge risk-critical">高风险</span>';
        }

        // 强势等级
        const rateBadge = customer.rateLevel === '强势客户'
            ? '<span class="rate-badge strong">强势客户</span>'
            : '<span class="rate-badge normal">普通客户</span>';

        // 增长趋势（模拟数据）
        const growthRate = (Math.random() * 30 - 10).toFixed(1);
        const growthClass = growthRate > 0 ? 'growth-up' : growthRate < 0 ? 'growth-down' : 'growth-stable';
        const growthArrow = growthRate > 0 ? '↑' : growthRate < 0 ? '↓' : '→';
        const growthIndicator = `
            <div class="growth-indicator ${growthClass}">
                <span class="growth-arrow">${growthArrow}</span>
                <span class="growth-value">${growthRate >= 0 ? '+' : ''}${growthRate}%</span>
            </div>
        `;

        html += `
            <tr>
                <td class="col-rank">
                    <span class="rank-number ${rankClass}">${rank}</span>
                </td>
                <td class="col-name">
                    <div class="customer-name-cell">${customer.name}</div>
                    <div style="font-size: 12px; color: #999; margin-top: 2px;">${customer.region}</div>
                </td>
                <td class="col-type">${typeBadge}</td>
                <td class="col-amount">
                    <div style="font-weight: 600;">${formatAmount(customer.yearlyTradeAmount)}</div>
                </td>
                <td class="col-count">
                    <div>${customer.yearlyTradeCount.toLocaleString()}</div>
                </td>
                <td class="col-credit">${creditBadge}</td>
                <td class="col-risk">${riskBadge}</td>
                <td class="col-rate">${rateBadge}</td>
                <td class="col-growth">${growthIndicator}</td>
                <td class="col-action">
                    <div class="action-buttons">
                        <button class="action-btn" onclick="viewCustomerDetail(${customer.id})">详情</button>
                        <button class="action-btn" onclick="contactCustomer(${customer.id})">联系</button>
                    </div>
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

// 更新行业风险分布
function updateIndustryRiskDistribution(customers) {
    const riskCounts = {
        '低': 0,
        '中': 0,
        '中高': 0,
        '高': 0
    };

    customers.forEach(c => {
        riskCounts[c.riskLevel] = (riskCounts[c.riskLevel] || 0) + 1;
    });

    const total = customers.length;

    // 更新低风险
    document.getElementById('riskLowCount').textContent = riskCounts['低'] + ' 家';
    document.getElementById('riskLowBar').style.width = total > 0 ? (riskCounts['低'] / total * 100) + '%' : '0%';

    // 更新中风险
    document.getElementById('riskMediumCount').textContent = riskCounts['中'] + ' 家';
    document.getElementById('riskMediumBar').style.width = total > 0 ? (riskCounts['中'] / total * 100) + '%' : '0%';

    // 更新中高风险
    document.getElementById('riskHighMediumCount').textContent = riskCounts['中高'] + ' 家';
    document.getElementById('riskHighMediumBar').style.width = total > 0 ? (riskCounts['中高'] / total * 100) + '%' : '0%';

    // 更新高风险
    document.getElementById('riskCriticalCount').textContent = riskCounts['高'] + ' 家';
    document.getElementById('riskCriticalBar').style.width = total > 0 ? (riskCounts['高'] / total * 100) + '%' : '0%';
}

// 排序行业表格
function sortIndustryTable(sortBy) {
    // 更新排序状态
    industryAnalysisData.currentSort = sortBy;

    // 如果点击的是同一个排序字段，则切换排序顺序
    if (industryAnalysisData.currentSort === sortBy) {
        industryAnalysisData.currentSortOrder =
            industryAnalysisData.currentSortOrder === 'desc' ? 'asc' : 'desc';
    } else {
        industryAnalysisData.currentSortOrder = 'desc';
    }

    // 更新按钮状态
    const buttons = document.querySelectorAll('.table-actions .sort-btn');
    buttons.forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.closest('.sort-btn').classList.add('active');

    // 重新渲染表格
    updateIndustryAnalysis();
}

// 查看客户详情
function viewCustomerDetail(customerId) {
    window.location.href = `customer-detail.html?id=${customerId}`;
}

// 联系客户
function contactCustomer(customerId) {
    const customer = mockCustomers.find(c => c.id === customerId);
    if (customer) {
        showNotification(`正在联系 ${customer.name}...`, 'info');
    }
}
