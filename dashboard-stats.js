// ====================================
// DASHBOARD & STATISTICS MODULE
// ====================================
// Tambahkan script ini ke HTML setelah Chart.js CDN

const Dashboard = {
    // Initialize
    init() {
        this.addChartJSCDN();
        this.addDashboardButton();
        this.addDashboardModal();
    },

    // Add Chart.js CDN
    addChartJSCDN() {
        if (!document.querySelector('script[src*="chart.js"]')) {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js';
            document.head.appendChild(script);
        }
    },

    // Add Dashboard Button to Header
    addDashboardButton() {
        const headerButtons = document.querySelector('header .flex.gap-2');
        const dashboardBtn = document.createElement('button');
        dashboardBtn.id = 'dashboardBtn';
        dashboardBtn.onclick = () => this.openDashboard();
        dashboardBtn.className = 'flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded text-sm font-medium shadow-sm transition-all active:scale-95';
        dashboardBtn.innerHTML = `
            <i data-lucide="bar-chart-3" width="18"></i>
            <span class="hidden sm:inline">Dashboard</span>
        `;
        
        // Insert setelah tombol GitHub (atau di posisi ke-2)
        const githubBtn = document.getElementById('githubSyncBtn');
        if (githubBtn && githubBtn.nextSibling) {
            headerButtons.insertBefore(dashboardBtn, githubBtn.nextSibling);
        } else {
            headerButtons.insertBefore(dashboardBtn, headerButtons.children[1]);
        }
        
        lucide.createIcons();
    },

    // Add Dashboard Modal
    addDashboardModal() {
        const modalHTML = `
            <div id="dashboardModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4 overflow-y-auto">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-6xl transform transition-all my-8">
                    <!-- Header -->
                    <div class="bg-gradient-to-r from-purple-600 to-purple-800 text-white p-5 rounded-t-xl flex items-center justify-between sticky top-0 z-10">
                        <div class="flex items-center gap-3">
                            <i data-lucide="bar-chart-3" width="24"></i>
                            <h3 class="text-xl font-bold">Dashboard & Statistics</h3>
                        </div>
                        <button onclick="Dashboard.closeDashboard()" class="hover:bg-white/20 p-2 rounded transition-colors">
                            <i data-lucide="x" width="24"></i>
                        </button>
                    </div>

                    <!-- Body -->
                    <div class="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
                        
                        <!-- Summary Cards -->
                        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <!-- Total Karyawan -->
                            <div class="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
                                <div class="flex items-center justify-between mb-2">
                                    <i data-lucide="users" width="32" class="opacity-80"></i>
                                    <span class="text-3xl font-bold" id="totalEmployees">0</span>
                                </div>
                                <p class="text-sm opacity-90">Total Karyawan</p>
                            </div>

                            <!-- Katapang -->
                            <div class="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg">
                                <div class="flex items-center justify-between mb-2">
                                    <i data-lucide="map-pin" width="32" class="opacity-80"></i>
                                    <span class="text-3xl font-bold" id="katapangCount">0</span>
                                </div>
                                <p class="text-sm opacity-90">Katapang</p>
                            </div>

                            <!-- Soreang -->
                            <div class="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white shadow-lg">
                                <div class="flex items-center justify-between mb-2">
                                    <i data-lucide="map-pin" width="32" class="opacity-80"></i>
                                    <span class="text-3xl font-bold" id="soreangCount">0</span>
                                </div>
                                <p class="text-sm opacity-90">Soreang</p>
                            </div>

                            <!-- Margahayu -->
                            <div class="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-5 text-white shadow-lg">
                                <div class="flex items-center justify-between mb-2">
                                    <i data-lucide="map-pin" width="32" class="opacity-80"></i>
                                    <span class="text-3xl font-bold" id="margahayuCount">0</span>
                                </div>
                                <p class="text-sm opacity-90">Margahayu</p>
                            </div>
                        </div>

                        <!-- Charts Row 1 -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <!-- K/P Distribution -->
                            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                                <h4 class="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                                    <i data-lucide="pie-chart" width="20" class="text-purple-600"></i>
                                    Distribusi K/P per Sektor
                                </h4>
                                <canvas id="kpChart" height="250"></canvas>
                            </div>

                            <!-- Kursus Status -->
                            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                                <h4 class="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                                    <i data-lucide="graduation-cap" width="20" class="text-purple-600"></i>
                                    Status Kursus
                                </h4>
                                <canvas id="kursusChart" height="250"></canvas>
                            </div>
                        </div>

                        <!-- Charts Row 2 -->
                        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <!-- HS Status -->
                            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                                <h4 class="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                                    <i data-lucide="check-circle" width="20" class="text-purple-600"></i>
                                    Halaqah Sunnah (HS)
                                </h4>
                                <canvas id="hsChart" height="200"></canvas>
                                <div class="mt-4 space-y-2 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">✔ Hadir:</span>
                                        <span class="font-semibold text-green-600" id="hsCheck">0</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">✕ Tidak:</span>
                                        <span class="font-semibold text-red-600" id="hsCross">0</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">- Tidak Ada Data:</span>
                                        <span class="font-semibold text-gray-500" id="hsDash">0</span>
                                    </div>
                                </div>
                            </div>

                            <!-- JM Status -->
                            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                                <h4 class="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                                    <i data-lucide="users" width="20" class="text-purple-600"></i>
                                    Jum'at Mubarak (JM)
                                </h4>
                                <canvas id="jmChart" height="200"></canvas>
                                <div class="mt-4 space-y-2 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">✔ Hadir:</span>
                                        <span class="font-semibold text-green-600" id="jmCheck">0</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">✕ Tidak:</span>
                                        <span class="font-semibold text-red-600" id="jmCross">0</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">- Tidak Ada Data:</span>
                                        <span class="font-semibold text-gray-500" id="jmDash">0</span>
                                    </div>
                                </div>
                            </div>

                            <!-- SPP Status -->
                            <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                                <h4 class="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                                    <i data-lucide="dollar-sign" width="20" class="text-purple-600"></i>
                                    Status SPP
                                </h4>
                                <canvas id="sppChart" height="200"></canvas>
                                <div class="mt-4 space-y-2 text-sm">
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">✔ Lunas:</span>
                                        <span class="font-semibold text-green-600" id="sppCheck">0</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">✕ Belum:</span>
                                        <span class="font-semibold text-red-600" id="sppCross">0</span>
                                    </div>
                                    <div class="flex justify-between">
                                        <span class="text-gray-600">- Tidak Ada Data:</span>
                                        <span class="font-semibold text-gray-500" id="sppDash">0</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Detailed Stats Table -->
                        <div class="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
                            <h4 class="font-bold text-lg mb-4 text-gray-800 flex items-center gap-2">
                                <i data-lucide="table" width="20" class="text-purple-600"></i>
                                Statistik Detail per Sektor
                            </h4>
                            <div class="overflow-x-auto">
                                <table class="w-full text-sm">
                                    <thead class="bg-gray-50 border-b border-gray-200">
                                        <tr>
                                            <th class="text-left p-3 font-semibold text-gray-700">Sektor</th>
                                            <th class="text-center p-3 font-semibold text-gray-700">Total</th>
                                            <th class="text-center p-3 font-semibold text-gray-700">K</th>
                                            <th class="text-center p-3 font-semibold text-gray-700">P</th>
                                            <th class="text-center p-3 font-semibold text-gray-700">Kursus ✔</th>
                                            <th class="text-center p-3 font-semibold text-gray-700">HS ✔</th>
                                            <th class="text-center p-3 font-semibold text-gray-700">JM ✔</th>
                                            <th class="text-center p-3 font-semibold text-gray-700">SPP ✔</th>
                                        </tr>
                                    </thead>
                                    <tbody id="detailStatsTable" class="divide-y divide-gray-100">
                                        <!-- Data will be populated by JavaScript -->
                                    </tbody>
                                </table>
                            </div>
                        </div>

                    </div>

                    <!-- Footer -->
                    <div class="bg-gray-50 px-6 py-4 rounded-b-xl border-t border-gray-200 flex justify-between items-center">
                        <p class="text-sm text-gray-600">
                            <i data-lucide="info" width="16" class="inline"></i>
                            Data diperbarui secara real-time
                        </p>
                        <button onclick="Dashboard.closeDashboard()" class="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm font-medium transition-all">
                            Tutup
                        </button>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    // Calculate Statistics
    calculateStats() {
        const allEmployees = employees || [];
        
        const stats = {
            total: allEmployees.length,
            sectors: {},
            kp: { K: 0, P: 0 },
            kursus: { '✔': 0, 'S': 0, 'I': 0, 'G': 0, 'T': 0, 'A': 0, '-': 0 },
            hs: { '✔': 0, '✕': 0, '-': 0 },
            jm: { '✔': 0, '✕': 0, '-': 0 },
            spp: { '✔': 0, '✕': 0, '-': 0 }
        };

        // Group by sector
        ['Katapang', 'Soreang', 'Margahayu'].forEach(sector => {
            const sectorData = allEmployees.filter(emp => emp.sector === sector);
            stats.sectors[sector] = {
                total: sectorData.length,
                K: sectorData.filter(emp => emp.kp === 'K').length,
                P: sectorData.filter(emp => emp.kp === 'P').length,
                kursusCheck: sectorData.filter(emp => emp.kursus === '✔').length,
                hsCheck: sectorData.filter(emp => emp.hs === '✔').length,
                jmCheck: sectorData.filter(emp => emp.jm === '✔').length,
                sppCheck: sectorData.filter(emp => emp.spp === '✔').length
            };
        });

        // Overall stats
        allEmployees.forEach(emp => {
            stats.kp[emp.kp] = (stats.kp[emp.kp] || 0) + 1;
            stats.kursus[emp.kursus] = (stats.kursus[emp.kursus] || 0) + 1;
            stats.hs[emp.hs] = (stats.hs[emp.hs] || 0) + 1;
            stats.jm[emp.jm] = (stats.jm[emp.jm] || 0) + 1;
            stats.spp[emp.spp] = (stats.spp[emp.spp] || 0) + 1;
        });

        return stats;
    },

    // Open Dashboard
    openDashboard() {
        const modal = document.getElementById('dashboardModal');
        modal.classList.remove('hidden');
        
        // Calculate stats
        const stats = this.calculateStats();
        
        // Update summary cards
        document.getElementById('totalEmployees').textContent = stats.total;
        document.getElementById('katapangCount').textContent = stats.sectors['Katapang']?.total || 0;
        document.getElementById('soreangCount').textContent = stats.sectors['Soreang']?.total || 0;
        document.getElementById('margahayuCount').textContent = stats.sectors['Margahayu']?.total || 0;

        // Update attendance numbers
        document.getElementById('hsCheck').textContent = stats.hs['✔'];
        document.getElementById('hsCross').textContent = stats.hs['✕'];
        document.getElementById('hsDash').textContent = stats.hs['-'];
        
        document.getElementById('jmCheck').textContent = stats.jm['✔'];
        document.getElementById('jmCross').textContent = stats.jm['✕'];
        document.getElementById('jmDash').textContent = stats.jm['-'];
        
        document.getElementById('sppCheck').textContent = stats.spp['✔'];
        document.getElementById('sppCross').textContent = stats.spp['✕'];
        document.getElementById('sppDash').textContent = stats.spp['-'];

        // Render charts
        this.renderCharts(stats);
        
        // Render detail table
        this.renderDetailTable(stats);
        
        // Re-render Lucide icons
        lucide.createIcons();
    },

    // Close Dashboard
    closeDashboard() {
        document.getElementById('dashboardModal').classList.add('hidden');
        
        // Destroy existing charts to prevent memory leaks
        ['kpChart', 'kursusChart', 'hsChart', 'jmChart', 'sppChart'].forEach(id => {
            const canvas = document.getElementById(id);
            const chart = Chart.getChart(canvas);
            if (chart) chart.destroy();
        });
    },

    // Render all charts
    renderCharts(stats) {
        // K/P Distribution by Sector
        this.renderKPChart(stats);
        
        // Kursus Status
        this.renderKursusChart(stats);
        
        // Attendance Charts
        this.renderAttendanceChart('hsChart', stats.hs, ['#10b981', '#ef4444', '#9ca3af']);
        this.renderAttendanceChart('jmChart', stats.jm, ['#10b981', '#ef4444', '#9ca3af']);
        this.renderAttendanceChart('sppChart', stats.spp, ['#10b981', '#ef4444', '#9ca3af']);
    },

    // Render K/P Chart (Grouped Bar)
    renderKPChart(stats) {
        const ctx = document.getElementById('kpChart');
        const existingChart = Chart.getChart(ctx);
        if (existingChart) existingChart.destroy();

        new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Katapang', 'Soreang', 'Margahayu'],
                datasets: [
                    {
                        label: 'Kader (K)',
                        data: [
                            stats.sectors['Katapang']?.K || 0,
                            stats.sectors['Soreang']?.K || 0,
                            stats.sectors['Margahayu']?.K || 0
                        ],
                        backgroundColor: '#3b82f6',
                        borderRadius: 6
                    },
                    {
                        label: 'Pendukung (P)',
                        data: [
                            stats.sectors['Katapang']?.P || 0,
                            stats.sectors['Soreang']?.P || 0,
                            stats.sectors['Margahayu']?.P || 0
                        ],
                        backgroundColor: '#ec4899',
                        borderRadius: 6
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            stepSize: 1
                        }
                    }
                }
            }
        });
    },

    // Render Kursus Chart (Doughnut)
    renderKursusChart(stats) {
        const ctx = document.getElementById('kursusChart');
        const existingChart = Chart.getChart(ctx);
        if (existingChart) existingChart.destroy();

        const kursusLabels = {
            '✔': 'Selesai',
            'G': 'Ghoib',
            'I': 'Izin',
            'S': 'Sakit',
            'T': 'Tamat',
            'A': 'Alpha',
            '-': 'Tidak Ada Data'
        };

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: Object.keys(stats.kursus).map(k => `${kursusLabels[k]} (${k})`),
                datasets: [{
                    data: Object.values(stats.kursus),
                    backgroundColor: [
                        '#10b981', // ✔ - Green
                        '#f59e0b', // G - Orange
                        '#3b82f6', // I - Blue
                        '#ef4444', // S - Red
                        '#8b5cf6', // T - Purple
                        '#6b7280', // A - Gray
                        '#d1d5db'  // - - Light Gray
                    ],
                    borderWidth: 2,
                    borderColor: '#fff'
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
                    }
                }
            }
        });
    },

    // Render Attendance Chart (Doughnut)
    renderAttendanceChart(canvasId, data, colors) {
        const ctx = document.getElementById(canvasId);
        const existingChart = Chart.getChart(ctx);
        if (existingChart) existingChart.destroy();

        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['✔', '✕', '-'],
                datasets: [{
                    data: [data['✔'], data['✕'], data['-']],
                    backgroundColor: colors,
                    borderWidth: 2,
                    borderColor: '#fff'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                cutout: '60%'
            }
        });
    },

    // Render Detail Table
    renderDetailTable(stats) {
        const tbody = document.getElementById('detailStatsTable');
        tbody.innerHTML = '';

        ['Katapang', 'Soreang', 'Margahayu'].forEach(sector => {
            const data = stats.sectors[sector] || {};
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-gray-50';
            tr.innerHTML = `
                <td class="p-3 font-medium text-gray-800">${sector}</td>
                <td class="p-3 text-center font-semibold text-blue-600">${data.total || 0}</td>
                <td class="p-3 text-center">${data.K || 0}</td>
                <td class="p-3 text-center">${data.P || 0}</td>
                <td class="p-3 text-center">${data.kursusCheck || 0}</td>
                <td class="p-3 text-center">${data.hsCheck || 0}</td>
                <td class="p-3 text-center">${data.jmCheck || 0}</td>
                <td class="p-3 text-center">${data.sppCheck || 0}</td>
            `;
            tbody.appendChild(tr);
        });

        // Total row
        const totalRow = document.createElement('tr');
        totalRow.className = 'bg-gray-100 font-bold border-t-2 border-gray-300';
        totalRow.innerHTML = `
            <td class="p-3 text-gray-800">TOTAL</td>
            <td class="p-3 text-center text-blue-600">${stats.total}</td>
            <td class="p-3 text-center">${stats.kp.K || 0}</td>
            <td class="p-3 text-center">${stats.kp.P || 0}</td>
            <td class="p-3 text-center">${stats.kursus['✔'] || 0}</td>
            <td class="p-3 text-center">${stats.hs['✔'] || 0}</td>
            <td class="p-3 text-center">${stats.jm['✔'] || 0}</td>
            <td class="p-3 text-center">${stats.spp['✔'] || 0}</td>
        `;
        tbody.appendChild(totalRow);
    }
};

// Auto-initialize when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Dashboard.init());
} else {
    Dashboard.init();
}

// Export untuk debugging
window.Dashboard = Dashboard;
