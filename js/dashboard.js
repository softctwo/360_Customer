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
