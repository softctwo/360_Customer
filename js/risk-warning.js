// 风险预警页面脚本
let riskCharts = {};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    initRiskCharts();
});

// 初始化图表
function initRiskCharts() {
    initRiskTrendChart();
    initRiskDistributionChart();
}

// 风险客户数量趋势图
function initRiskTrendChart() {
    const ctx = document.getElementById('riskTrendChart');
    if (!ctx) return;

    riskCharts.riskTrend = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月'],
            datasets: [{
                label: '高风险',
                data: [2, 3, 2, 4, 3, 5, 4, 3, 4, 3, 3],
                borderColor: '#f5222d',
                backgroundColor: 'rgba(245, 34, 45, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointBackgroundColor: '#f5222d',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }, {
                label: '中高风险',
                data: [8, 9, 10, 11, 10, 12, 11, 10, 11, 10, 10],
                borderColor: '#faad14',
                backgroundColor: 'rgba(250, 173, 20, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointBackgroundColor: '#faad14',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }, {
                label: '中风险',
                data: [42, 45, 46, 47, 48, 48, 47, 48, 48, 47, 48],
                borderColor: '#1890ff',
                backgroundColor: 'rgba(24, 144, 255, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointBackgroundColor: '#1890ff',
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
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: '客户数量',
                        font: {
                            size: 12,
                            weight: '600'
                        }
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

// 风险等级分布图
function initRiskDistributionChart() {
    const ctx = document.getElementById('riskDistributionChart');
    if (!ctx) return;

    riskCharts.riskDistribution = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['低风险', '中风险', '中高风险', '高风险'],
            datasets: [{
                data: [45, 48, 10, 3],
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
                        },
                        generateLabels: function(chart) {
                            const data = chart.data;
                            return data.labels.map((label, i) => {
                                const value = data.datasets[0].data[i];
                                const total = data.datasets[0].data.reduce((a, b) => a + b, 0);
                                const percentage = ((value / total) * 100).toFixed(1);
                                return {
                                    text: `${label}: ${value}家 (${percentage}%)`,
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

// 处理风险预警
function handleRisk(customerId) {
    if (confirm('确定要处理这个风险预警吗？')) {
        showNotification('风险预警处理中...', 'info');

        setTimeout(() => {
            showNotification('风险预警已标记为处理中', 'success');
        }, 1500);
    }
}

// 查看客户详情
function viewDetails(customerId) {
    localStorage.setItem('selectedCustomerId', customerId);
    window.location.href = 'customer-detail.html';
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
