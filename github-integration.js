// ====================================
// GITHUB INTEGRATION MODULE
// ====================================
// Tambahkan script ini ke HTML Anda sebelum tag </body>

const GitHubSync = {
    // Konfigurasi
    config: {
        apiUrl: 'https://api.github.com',
        storedTokenKey: 'github_token_karyawan',
        storedRepoKey: 'github_repo_karyawan',
        fileName: 'karyawan-data.json',
        commitMessage: 'Update data karyawan'
    },

    // State
    state: {
        token: null,
        username: null,
        repoName: null,
        isConnected: false
    },

    // Initialize
    init() {
        this.loadStoredCredentials();
        this.addUIElements();
        this.attachEventListeners();
        this.updateConnectionStatus();
    },

    // Load stored credentials dari localStorage
    loadStoredCredentials() {
        const token = localStorage.getItem(this.config.storedTokenKey);
        const repo = localStorage.getItem(this.config.storedRepoKey);
        
        if (token && repo) {
            this.state.token = token;
            const [username, repoName] = repo.split('/');
            this.state.username = username;
            this.state.repoName = repoName;
            this.state.isConnected = true;
        }
    },

    // Save credentials ke localStorage
    saveCredentials() {
        localStorage.setItem(this.config.storedTokenKey, this.state.token);
        localStorage.setItem(this.config.storedRepoKey, `${this.state.username}/${this.state.repoName}`);
    },

    // Clear credentials
    clearCredentials() {
        this.state.token = null;
        this.state.username = null;
        this.state.repoName = null;
        this.state.isConnected = false;
        localStorage.removeItem(this.config.storedTokenKey);
        localStorage.removeItem(this.config.storedRepoKey);
    },

    // Add UI Elements (Modal & Button)
    addUIElements() {
        // Tambah button "Save to GitHub" di header
        const headerButtons = document.querySelector('header .flex.gap-2');
        const githubBtn = document.createElement('button');
        githubBtn.id = 'githubSyncBtn';
        githubBtn.className = 'flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded text-sm font-medium shadow-sm transition-all active:scale-95';
        githubBtn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span class="hidden sm:inline">GitHub</span>
        `;
        headerButtons.insertBefore(githubBtn, headerButtons.firstChild);

        // Tambah Modal HTML
        const modalHTML = `
            <div id="githubModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
                <div class="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all">
                    <!-- Header -->
                    <div class="bg-gradient-to-r from-gray-800 to-gray-900 text-white p-5 rounded-t-xl flex items-center justify-between">
                        <div class="flex items-center gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                            </svg>
                            <h3 class="text-lg font-bold">GitHub Sync</h3>
                        </div>
                        <button onclick="GitHubSync.closeModal()" class="hover:bg-white/20 p-1 rounded transition-colors">
                            <i data-lucide="x" width="20"></i>
                        </button>
                    </div>

                    <!-- Body -->
                    <div class="p-6">
                        <!-- Connection Status -->
                        <div id="connectionStatus" class="mb-5 p-3 rounded-lg hidden">
                            <div class="flex items-center gap-2 text-sm font-medium">
                                <i data-lucide="check-circle" width="18"></i>
                                <span>Connected to <strong id="connectedRepo"></strong></span>
                            </div>
                        </div>

                        <!-- Login Form -->
                        <div id="loginForm" class="space-y-4">
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">GitHub Username</label>
                                <input type="text" id="githubUsername" placeholder="username" 
                                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all">
                            </div>
                            
                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Personal Access Token</label>
                                <input type="password" id="githubToken" placeholder="ghp_xxxxxxxxxxxx" 
                                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all">
                                <a href="https://github.com/settings/tokens/new?scopes=repo" target="_blank" 
                                    class="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block">
                                    Buat token baru (perlu scope: repo)
                                </a>
                            </div>

                            <div>
                                <label class="block text-sm font-semibold text-gray-700 mb-2">Repository Name</label>
                                <input type="text" id="githubRepo" placeholder="data-karyawan" 
                                    class="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-800 focus:border-transparent outline-none transition-all">
                                <p class="text-xs text-gray-500 mt-1">Otomatis dibuat jika belum ada</p>
                            </div>

                            <button onclick="GitHubSync.connect()" 
                                class="w-full bg-gray-800 hover:bg-gray-900 text-white font-semibold py-3 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                                <i data-lucide="link" width="18"></i>
                                Connect to GitHub
                            </button>
                        </div>

                        <!-- Action Buttons (Hidden initially) -->
                        <div id="actionButtons" class="space-y-3 hidden">
                            <button onclick="GitHubSync.saveToGitHub()" 
                                class="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                                <i data-lucide="upload-cloud" width="18"></i>
                                Save Data to GitHub
                            </button>

                            <button onclick="GitHubSync.loadFromGitHub()" 
                                class="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                                <i data-lucide="download-cloud" width="18"></i>
                                Load Data from GitHub
                            </button>

                            <button onclick="GitHubSync.disconnect()" 
                                class="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-lg transition-all active:scale-95 flex items-center justify-center gap-2">
                                <i data-lucide="log-out" width="18"></i>
                                Disconnect
                            </button>
                        </div>

                        <!-- Status Message -->
                        <div id="statusMessage" class="mt-4 p-3 rounded-lg hidden text-sm"></div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    },

    // Attach event listeners
    attachEventListeners() {
        document.getElementById('githubSyncBtn').addEventListener('click', () => this.openModal());
        
        // Enter key untuk connect
        ['githubUsername', 'githubToken', 'githubRepo'].forEach(id => {
            document.getElementById(id)?.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') this.connect();
            });
        });
    },

    // Open Modal
    openModal() {
        document.getElementById('githubModal').classList.remove('hidden');
        this.updateConnectionStatus();
        lucide.createIcons();
    },

    // Close Modal
    closeModal() {
        document.getElementById('githubModal').classList.add('hidden');
    },

    // Update connection status UI
    updateConnectionStatus() {
        const loginForm = document.getElementById('loginForm');
        const actionButtons = document.getElementById('actionButtons');
        const connectionStatus = document.getElementById('connectionStatus');
        const connectedRepo = document.getElementById('connectedRepo');

        if (this.state.isConnected) {
            loginForm.classList.add('hidden');
            actionButtons.classList.remove('hidden');
            connectionStatus.classList.remove('hidden');
            connectedRepo.textContent = `${this.state.username}/${this.state.repoName}`;
        } else {
            loginForm.classList.remove('hidden');
            actionButtons.classList.add('hidden');
            connectionStatus.classList.add('hidden');
        }
    },

    // Show status message
    showMessage(message, type = 'info') {
        const statusMessage = document.getElementById('statusMessage');
        statusMessage.className = `mt-4 p-3 rounded-lg text-sm ${
            type === 'success' ? 'bg-green-100 text-green-800 border border-green-200' :
            type === 'error' ? 'bg-red-100 text-red-800 border border-red-200' :
            'bg-blue-100 text-blue-800 border border-blue-200'
        }`;
        statusMessage.textContent = message;
        statusMessage.classList.remove('hidden');
        
        setTimeout(() => {
            statusMessage.classList.add('hidden');
        }, 5000);
    },

    // Connect to GitHub
    async connect() {
        const username = document.getElementById('githubUsername').value.trim();
        const token = document.getElementById('githubToken').value.trim();
        const repoName = document.getElementById('githubRepo').value.trim();

        if (!username || !token || !repoName) {
            this.showMessage('Semua field harus diisi!', 'error');
            return;
        }

        this.showMessage('Connecting...', 'info');

        try {
            // Verify token dengan user API
            const userResponse = await fetch(`${this.config.apiUrl}/user`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!userResponse.ok) {
                throw new Error('Token tidak valid atau expired');
            }

            const userData = await userResponse.json();
            
            if (userData.login.toLowerCase() !== username.toLowerCase()) {
                throw new Error('Username tidak sesuai dengan token');
            }

            // Check if repo exists, jika tidak buat baru
            const repoResponse = await fetch(`${this.config.apiUrl}/repos/${username}/${repoName}`, {
                headers: {
                    'Authorization': `token ${token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (repoResponse.status === 404) {
                // Buat repo baru
                await this.createRepository(token, repoName);
            } else if (!repoResponse.ok) {
                throw new Error('Gagal mengakses repository');
            }

            // Save credentials
            this.state.token = token;
            this.state.username = username;
            this.state.repoName = repoName;
            this.state.isConnected = true;
            this.saveCredentials();

            this.showMessage('✓ Berhasil terhubung ke GitHub!', 'success');
            this.updateConnectionStatus();
            lucide.createIcons();

        } catch (error) {
            this.showMessage(`Error: ${error.message}`, 'error');
            console.error('GitHub connection error:', error);
        }
    },

    // Create new repository
    async createRepository(token, repoName) {
        const response = await fetch(`${this.config.apiUrl}/user/repos`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: repoName,
                description: 'Data Karyawan Backup',
                private: true,
                auto_init: true
            })
        });

        if (!response.ok) {
            throw new Error('Gagal membuat repository baru');
        }

        // Tunggu sebentar agar repo siap
        await new Promise(resolve => setTimeout(resolve, 2000));
    },

    // Save data to GitHub
    async saveToGitHub() {
        if (!this.state.isConnected) {
            this.showMessage('Belum terhubung ke GitHub!', 'error');
            return;
        }

        this.showMessage('Uploading data...', 'info');

        try {
            // Ambil data karyawan dari localStorage
            const data = localStorage.getItem('karyawanData_v3');
            if (!data) {
                throw new Error('Tidak ada data untuk disimpan');
            }

            // Format data dengan timestamp
            const payload = {
                version: '3.0',
                lastUpdated: new Date().toISOString(),
                employees: JSON.parse(data)
            };

            const content = btoa(unescape(encodeURIComponent(JSON.stringify(payload, null, 2))));

            // Check if file already exists
            let sha = null;
            try {
                const checkResponse = await fetch(
                    `${this.config.apiUrl}/repos/${this.state.username}/${this.state.repoName}/contents/${this.config.fileName}`,
                    {
                        headers: {
                            'Authorization': `token ${this.state.token}`,
                            'Accept': 'application/vnd.github.v3+json'
                        }
                    }
                );
                if (checkResponse.ok) {
                    const fileData = await checkResponse.json();
                    sha = fileData.sha;
                }
            } catch (e) {
                // File doesn't exist, that's okay
            }

            // Upload/update file
            const uploadResponse = await fetch(
                `${this.config.apiUrl}/repos/${this.state.username}/${this.state.repoName}/contents/${this.config.fileName}`,
                {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${this.state.token}`,
                        'Accept': 'application/vnd.github.v3+json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        message: `${this.config.commitMessage} - ${new Date().toLocaleString('id-ID')}`,
                        content: content,
                        ...(sha && { sha })
                    })
                }
            );

            if (!uploadResponse.ok) {
                throw new Error('Gagal upload data ke GitHub');
            }

            const result = await uploadResponse.json();
            this.showMessage('✓ Data berhasil disimpan ke GitHub!', 'success');
            
            // Tambahkan link ke file
            setTimeout(() => {
                this.showMessage(`View: ${result.content.html_url}`, 'success');
            }, 2000);

        } catch (error) {
            this.showMessage(`Error: ${error.message}`, 'error');
            console.error('GitHub save error:', error);
        }
    },

    // Load data from GitHub
    async loadFromGitHub() {
        if (!this.state.isConnected) {
            this.showMessage('Belum terhubung ke GitHub!', 'error');
            return;
        }

        if (!confirm('Load data dari GitHub akan menimpa data lokal saat ini. Lanjutkan?')) {
            return;
        }

        this.showMessage('Downloading data...', 'info');

        try {
            const response = await fetch(
                `${this.config.apiUrl}/repos/${this.state.username}/${this.state.repoName}/contents/${this.config.fileName}`,
                {
                    headers: {
                        'Authorization': `token ${this.state.token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                }
            );

            if (!response.ok) {
                throw new Error('File tidak ditemukan di GitHub');
            }

            const fileData = await response.json();
            const content = decodeURIComponent(escape(atob(fileData.content)));
            const payload = JSON.parse(content);

            // Validasi structure
            if (!payload.employees || !Array.isArray(payload.employees)) {
                throw new Error('Format data tidak valid');
            }

            // Save ke localStorage
            localStorage.setItem('karyawanData_v3', JSON.stringify(payload.employees));
            
            this.showMessage('✓ Data berhasil dimuat dari GitHub!', 'success');
            
            // Reload page untuk apply data baru
            setTimeout(() => {
                location.reload();
            }, 1500);

        } catch (error) {
            this.showMessage(`Error: ${error.message}`, 'error');
            console.error('GitHub load error:', error);
        }
    },

    // Disconnect
    disconnect() {
        if (confirm('Disconnect dari GitHub? Credentials akan dihapus.')) {
            this.clearCredentials();
            this.updateConnectionStatus();
            this.showMessage('Disconnected from GitHub', 'info');
        }
    }
};

// Auto-initialize when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => GitHubSync.init());
} else {
    GitHubSync.init();
}

// Export untuk debugging
window.GitHubSync = GitHubSync;