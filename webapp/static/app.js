/**
 * Enhanced JavaScript for Nanomaterial Toxicity Prediction Platform
 * Features: Real-time status updates, dynamic form generation, advanced UI interactions
 */

class ToxicityPredictor {
    constructor() {
        this.features = null;
        this.modelInfo = null;
        this.isProcessing = false;
        
        this.init();
    }
    
    async init() {
        console.log('🚀 Initializing Nanomaterial Toxicity Predictor...');
        
        // Load features and model info
        await this.loadFeatures();
        await this.loadModelInfo();
        
        // Setup form
        this.setupForm();
        this.setupEventListeners();
        
        console.log('✅ Initialization complete!');
    }
    
    async loadFeatures() {
        try {
            const response = await fetch('/features');
            if (response.ok) {
                this.features = await response.json();
                console.log('📊 Features loaded:', this.features);
            } else {
                throw new Error('Failed to load features');
            }
        } catch (error) {
            console.error('❌ Error loading features:', error);
            this.showError('Failed to load feature information');
        }
    }
    
    async loadModelInfo() {
        try {
            const response = await fetch('/model-info');
            if (response.ok) {
                this.modelInfo = await response.json();
                this.displayModelInfo();
                console.log('🤖 Model info loaded:', this.modelInfo);
            } else {
                throw new Error('Failed to load model info');
            }
        } catch (error) {
            console.error('❌ Error loading model info:', error);
            document.getElementById('modelInfo').innerHTML = 
                '<div class="error">Failed to load model information</div>';
        }
    }
    
    setupForm() {
        if (!this.features) {
            console.error('❌ Cannot setup form: features not loaded');
            return;
        }
        
        const inputFieldsContainer = document.getElementById('inputFields');
        inputFieldsContainer.innerHTML = '';
        
        this.features.names.forEach(featureName => {
            const inputGroup = this.createInputField(featureName);
            inputFieldsContainer.appendChild(inputGroup);
        });
        
        console.log('📝 Form setup complete with', this.features.names.length, 'fields');
    }
    
    createInputField(featureName) {
        const inputGroup = document.createElement('div');
        inputGroup.className = 'input-group';
        
        const label = document.createElement('label');
        label.setAttribute('for', featureName);
        label.innerHTML = `<i class="fas fa-flask"></i> ${this.getDisplayName(featureName)}`;
        
        const input = document.createElement('input');
        input.type = 'number';
        input.id = featureName;
        input.name = featureName;
        input.required = true;
        input.step = 'any';
        
        // Set input properties based on feature type
        const inputConfig = this.getInputConfig(featureName);
        Object.assign(input, inputConfig);
        
        const helpText = document.createElement('div');
        helpText.className = 'input-help';
        helpText.textContent = this.features.descriptions[featureName] || '';
        
        inputGroup.appendChild(label);
        inputGroup.appendChild(input);
        inputGroup.appendChild(helpText);
        
        return inputGroup;
    }
    
    getDisplayName(featureName) {
        const displayNames = {
            'particle_size_nm': 'Particle Size (nm)',
            'surface_area_m2g': 'Surface Area (m²/g)',
            'zeta_potential_mv': 'Zeta Potential (mV)',
            'ph': 'pH Value',
            'concentration_mgl': 'Concentration (mg/L)',
            'material_type': 'Material Type',
            'crystallinity': 'Crystallinity',
            'porosity': 'Porosity',
            'hydrophobicity': 'Hydrophobicity',
            'aspect_ratio': 'Aspect Ratio'
        };
        return displayNames[featureName] || featureName;
    }
    
    getInputConfig(featureName) {
        const configs = {
            'particle_size_nm': {
                placeholder: 'e.g., 50',
                min: 1,
                max: 500
            },
            'surface_area_m2g': {
                placeholder: 'e.g., 100',
                min: 5,
                max: 400
            },
            'zeta_potential_mv': {
                placeholder: 'e.g., -25',
                min: -100,
                max: 60
            },
            'ph': {
                placeholder: 'e.g., 7.0',
                min: 3,
                max: 12,
                step: 0.1
            },
            'concentration_mgl': {
                placeholder: 'e.g., 10',
                min: 0.1,
                max: 1000
            },
            'material_type': {
                placeholder: '0 for Oxide, 1 for Metal',
                min: 0,
                max: 1,
                step: 1
            },
            'crystallinity': {
                placeholder: '0.0 to 1.0',
                min: 0,
                max: 1,
                step: 0.01
            },
            'porosity': {
                placeholder: '0.0 to 1.0',
                min: 0,
                max: 1,
                step: 0.01
            },
            'hydrophobicity': {
                placeholder: '0.0 to 1.0',
                min: 0,
                max: 1,
                step: 0.01
            },
            'aspect_ratio': {
                placeholder: 'e.g., 3.5',
                min: 1,
                max: 20,
                step: 0.1
            }
        };
        return configs[featureName] || {};
    }
    
    setupEventListeners() {
        const form = document.getElementById('predictForm');
        const resetBtn = document.getElementById('resetBtn');
        
        form.addEventListener('submit', (e) => this.handleSubmit(e));
        resetBtn.addEventListener('click', () => this.resetForm());
        
        // Add input validation listeners
        this.features.names.forEach(featureName => {
            const input = document.getElementById(featureName);
            if (input) {
                input.addEventListener('input', (e) => this.validateInput(e));
                input.addEventListener('blur', (e) => this.validateInput(e));
            }
        });
    }
    
    validateInput(event) {
        const input = event.target;
        const value = parseFloat(input.value);
        
        if (input.value && (isNaN(value) || value < input.min || value > input.max)) {
            input.setCustomValidity(`Value must be between ${input.min} and ${input.max}`);
        } else {
            input.setCustomValidity('');
        }
    }
    
    async handleSubmit(event) {
        event.preventDefault();
        
        if (this.isProcessing) {
            console.log('⏳ Already processing, ignoring submit');
            return;
        }
        
        this.isProcessing = true;
        
        try {
            // Collect form data
            const formData = this.collectFormData();
            
            // Show status section
            this.showStatusSection();
            
            // Update UI
            this.updateSubmitButton(true);
            
            // Make prediction
            await this.makePrediction(formData);
            
        } catch (error) {
            console.error('❌ Prediction error:', error);
            this.showError('Prediction failed: ' + error.message);
        } finally {
            this.isProcessing = false;
            this.updateSubmitButton(false);
        }
    }
    
    collectFormData() {
        const data = {};
        
        this.features.names.forEach(featureName => {
            const input = document.getElementById(featureName);
            if (input) {
                const value = parseFloat(input.value);
                if (isNaN(value)) {
                    throw new Error(`Invalid value for ${this.getDisplayName(featureName)}`);
                }
                data[featureName] = value;
            }
        });
        
        console.log('📊 Form data collected:', data);
        return data;
    }
    
    showStatusSection() {
        const statusSection = document.getElementById('statusSection');
        const resultsSection = document.getElementById('resultsSection');
        
        statusSection.style.display = 'block';
        resultsSection.style.display = 'none';
        
        // Clear previous status
        const statusMonitor = document.getElementById('statusMonitor');
        statusMonitor.innerHTML = '';
        
        // Scroll to status section
        statusSection.scrollIntoView({ behavior: 'smooth' });
    }
    
    updateSubmitButton(isLoading) {
        const submitBtn = document.querySelector('.predict-btn');
        const icon = submitBtn.querySelector('i');
        const text = submitBtn.querySelector('span');
        
        if (isLoading) {
            submitBtn.disabled = true;
            icon.className = 'fas fa-spinner fa-spin';
            text.textContent = 'Analyzing...';
        } else {
            submitBtn.disabled = false;
            icon.className = 'fas fa-play';
            text.textContent = 'Run Analysis';
        }
    }
    
    async makePrediction(formData) {
        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.error || 'Prediction failed');
            }
            
            console.log('🎯 Prediction result:', result);
            
            // Show status updates
            this.displayStatusUpdates(result.status_log);
            
            // Show results after status updates
            setTimeout(() => {
                this.displayResults(result);
            }, 1000);
            
        } catch (error) {
            console.error('❌ Prediction request failed:', error);
            throw error;
        }
    }
    
    displayStatusUpdates(statusLog) {
        const statusMonitor = document.getElementById('statusMonitor');
        
        statusLog.forEach((status, index) => {
            setTimeout(() => {
                const statusItem = this.createStatusItem(status);
                statusMonitor.appendChild(statusItem);
                
                // Scroll to bottom
                statusMonitor.scrollTop = statusMonitor.scrollHeight;
            }, index * 300);
        });
    }
    
    createStatusItem(status) {
        const statusItem = document.createElement('div');
        statusItem.className = `status-item ${status.status}`;
        
        const icon = document.createElement('div');
        icon.className = `status-icon ${status.status}`;
        
        if (status.status === 'processing') {
            icon.innerHTML = '<i class=\"fas fa-spinner fa-spin\"></i>';
        } else if (status.status === 'completed') {
            icon.innerHTML = '<i class=\"fas fa-check\"></i>';
        } else {
            icon.innerHTML = '<i class=\"fas fa-times\"></i>';
        }
        
        const textDiv = document.createElement('div');
        textDiv.className = 'status-text';
        
        const stepDiv = document.createElement('div');
        stepDiv.className = 'status-step';
        stepDiv.textContent = status.step.charAt(0).toUpperCase() + status.step.slice(1);
        
        const messageDiv = document.createElement('div');
        messageDiv.className = 'status-message';
        messageDiv.textContent = status.message;
        
        const timeDiv = document.createElement('div');
        timeDiv.className = 'status-time';
        timeDiv.textContent = `${status.timestamp.toFixed(2)}s`;
        
        textDiv.appendChild(stepDiv);
        textDiv.appendChild(messageDiv);
        
        statusItem.appendChild(icon);
        statusItem.appendChild(textDiv);
        statusItem.appendChild(timeDiv);
        
        return statusItem;
    }
    
    displayResults(result) {
        const resultsSection = document.getElementById('resultsSection');
        const resultContainer = document.getElementById('result');
        
        const html = this.generateResultsHTML(result);
        resultContainer.innerHTML = html;
        
        resultsSection.style.display = 'block';
        
        // Show detailed analysis button
        const detailedBtn = document.getElementById('detailedAnalysisBtn');
        detailedBtn.style.display = 'inline-flex';
        detailedBtn.onclick = () => this.generateDetailedAnalysis();
        
        // Store current form data for detailed analysis
        this.currentFormData = this.collectFormData();
        
        resultsSection.scrollIntoView({ behavior: 'smooth' });
        
        // Animate feature importance bars
        setTimeout(() => {
            this.animateImportanceBars();
        }, 500);
    }
    
    async generateDetailedAnalysis() {
        try {
            const detailedBtn = document.getElementById('detailedAnalysisBtn');
            const originalText = detailedBtn.innerHTML;
            
            // Update button state
            detailedBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating Report...';
            detailedBtn.disabled = true;
            
            // Make detailed analysis request
            const response = await fetch('/detailed-analysis', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.currentFormData)
            });
            
            const analysis = await response.json();
            
            if (!response.ok) {
                throw new Error(analysis.error || 'Detailed analysis failed');
            }
            
            console.log('📈 Detailed analysis result:', analysis);
            
            // Display detailed analysis
            this.displayDetailedAnalysis(analysis);
            
            // Reset button
            detailedBtn.innerHTML = originalText;
            detailedBtn.disabled = false;
            
        } catch (error) {
            console.error('❌ Detailed analysis error:', error);
            this.showError('Failed to generate detailed analysis: ' + error.message);
        }
    }
    
    displayDetailedAnalysis(analysis) {
        const detailedSection = document.getElementById('detailedAnalysisSection');
        const contentContainer = document.getElementById('detailedAnalysisContent');
        
        const html = this.generateDetailedAnalysisHTML(analysis);
        contentContainer.innerHTML = html;
        
        detailedSection.style.display = 'block';
        detailedSection.scrollIntoView({ behavior: 'smooth' });
        
        // Initialize charts
        setTimeout(() => {
            this.initializeCharts(analysis);
        }, 500);
    }
    
    generateResultsHTML(result) {
        return `
            <div class=\"prediction-result ${result.prediction === 1 ? 'toxic' : 'non-toxic'}\">
                <div class=\"prediction-title\">
                    <i class=\"fas ${result.prediction === 1 ? 'fa-exclamation-triangle' : 'fa-shield-alt'}\"></i>
                    ${result.prediction_text}
                </div>
                <div class=\"prediction-confidence\">
                    Confidence: ${result.confidence}%
                </div>
                <div class=\"prediction-probabilities\">
                    <div class=\"probability-item\">
                        <div class=\"probability-value\">${result.probabilities.non_toxic}%</div>
                        <div class=\"probability-label\">Non-Toxic</div>
                    </div>
                    <div class=\"probability-item\">
                        <div class=\"probability-value\">${result.probabilities.toxic}%</div>
                        <div class=\"probability-label\">Toxic</div>
                    </div>
                </div>
            </div>
            
            <div class=\"result-details\">
                <div class=\"detail-card\">
                    <h4><i class=\"fas fa-exclamation-circle\"></i> Risk Assessment</h4>
                    <div class=\"risk-level ${result.risk_level.toLowerCase()}\">${result.risk_level} Risk</div>
                    <ul class=\"risk-factors\">
                        ${result.risk_factors.map(factor => `<li><i class=\"fas fa-arrow-right\"></i> ${factor}</li>`).join('')}
                    </ul>
                </div>
                
                <div class=\"detail-card\">
                    <h4><i class=\"fas fa-chart-bar\"></i> Feature Importance</h4>
                    <div class=\"feature-importance\">
                        ${Object.entries(result.feature_importance).map(([feature, importance]) => `
                            <div class=\"importance-item\">
                                <span>${this.getDisplayName(feature)}</span>
                                <div class=\"importance-bar\">
                                    <div class=\"importance-fill\" data-width=\"${importance * 100}\"></div>
                                </div>
                                <span>${(importance * 100).toFixed(1)}%</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class=\"detail-card\">
                    <h4><i class=\"fas fa-info-circle\"></i> Analysis Info</h4>
                    <p><strong>Processing Time:</strong> ${result.processing_time}s</p>
                    <p><strong>Analysis Date:</strong> ${new Date(result.timestamp).toLocaleString()}</p>
                    <p><strong>Model Type:</strong> Random Forest</p>
                    <p><strong>Features Analyzed:</strong> ${this.features.names.length}</p>
                </div>
            </div>
        `;
    }
    
    generateDetailedAnalysisHTML(analysis) {
        return `
            <!-- Analysis Overview -->
            <div class="analysis-overview">
                <div class="analysis-card">
                    <h3>🎯 Prediction</h3>
                    <div class="metric">${analysis.prediction.text}</div>
                    <div class="description">${analysis.prediction.confidence}% confidence</div>
                </div>
                <div class="analysis-card">
                    <h3>⚠️ Risk Level</h3>
                    <div class="metric">${analysis.risk_assessment.overall_risk}</div>
                    <div class="description">Overall assessment</div>
                </div>
                <div class="analysis-card">
                    <h3>🔍 Features</h3>
                    <div class="metric">${Object.keys(analysis.feature_analysis).length}</div>
                    <div class="description">Parameters analyzed</div>
                </div>
                <div class="analysis-card">
                    <h3>💡 Recommendations</h3>
                    <div class="metric">${analysis.risk_assessment.safety_recommendations.length}</div>
                    <div class="description">Safety suggestions</div>
                </div>
            </div>
            
            <!-- Charts Section -->
            <div class="charts-section">
                <div class="chart-container">
                    <h3 class="chart-title">📊 Toxicity Probability Distribution</h3>
                    <div id="probabilityChart" class="pie-chart">
                        <div class="pie-visual" id="pieVisual">
                            <div class="pie-center">
                                <div class="pie-percentage">${analysis.prediction.probabilities.toxic}%</div>
                                <div class="pie-label">Toxic</div>
                            </div>
                        </div>
                        <div class="pie-legend">
                            <div class="legend-item">
                                <div class="legend-color" style="background: var(--success-color);"></div>
                                <div class="legend-text">Non-Toxic (${analysis.prediction.probabilities.non_toxic}%)</div>
                            </div>
                            <div class="legend-item">
                                <div class="legend-color" style="background: var(--danger-color);"></div>
                                <div class="legend-text">Toxic (${analysis.prediction.probabilities.toxic}%)</div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="chart-container">
                    <h3 class="chart-title">📈 Feature Importance Ranking</h3>
                    <div id="importanceChart" class="bar-chart">
                        ${analysis.charts_data.feature_importance.map(item => `
                            <div class="bar-item">
                                <div class="bar-label">${this.getDisplayName(item.feature)}</div>
                                <div class="bar-visual">
                                    <div class="bar-fill" data-width="${item.importance}" style="--bar-width: ${item.importance}%;">
                                        <div class="bar-value">${item.importance}%</div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                
                <div class="chart-container">
                    <h3 class="chart-title">🎯 Risk Factor Distribution</h3>
                    <div id="riskChart" class="bar-chart">
                        ${analysis.charts_data.risk_distribution.map(item => `
                            <div class="bar-item">
                                <div class="bar-label">${item.category}</div>
                                <div class="bar-visual">
                                    <div class="bar-fill" data-width="${(item.count / 10) * 100}" style="--bar-width: ${(item.count / 10) * 100}%;">
                                        <div class="bar-value">${item.count}</div>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
            
            <!-- Feature Analysis -->
            <div class="feature-analysis-section">
                <h3>🔬 Detailed Feature Analysis</h3>
                <div class="feature-analysis-grid">
                    ${Object.entries(analysis.feature_analysis).map(([feature, data]) => `
                        <div class="feature-card ${data.risk_level.toLowerCase()}-risk">
                            <div class="feature-header">
                                <div class="feature-name">${this.getDisplayName(feature)}</div>
                                <div class="risk-badge ${data.risk_level.toLowerCase()}">${data.risk_level}</div>
                            </div>
                            <div class="feature-details">
                                <div class="feature-detail">
                                    <span class="detail-label">Current Value</span>
                                    <span class="detail-value">${data.value}</span>
                                </div>
                                <div class="feature-detail">
                                    <span class="detail-label">Normalized</span>
                                    <span class="detail-value">${data.normalized_value}</span>
                                </div>
                                <div class="feature-detail">
                                    <span class="detail-label">Importance</span>
                                    <span class="detail-value">${(data.importance * 100).toFixed(2)}%</span>
                                </div>
                                <div class="feature-detail">
                                    <span class="detail-label">Description</span>
                                    <span class="detail-value">${data.description}</span>
                                </div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
            
            <!-- Recommendations -->
            ${analysis.risk_assessment.safety_recommendations.length > 0 ? `
                <div class="recommendations-section">
                    <h3 class="recommendations-title">
                        <i class="fas fa-lightbulb"></i>
                        Safety Recommendations
                    </h3>
                    <ul class="recommendations-list">
                        ${analysis.risk_assessment.safety_recommendations.map(rec => `
                            <li class="recommendation-item">
                                <i class="fas fa-check-circle recommendation-icon"></i>
                                <div class="recommendation-text">${rec}</div>
                            </li>
                        `).join('')}
                    </ul>
                </div>
            ` : ''}
        `;
    }
    
    initializeCharts(analysis) {
        // Initialize pie chart
        const pieVisual = document.getElementById('pieVisual');
        const toxicPercentage = analysis.prediction.probabilities.toxic;
        const nonToxicDeg = (analysis.prediction.probabilities.non_toxic / 100) * 360;
        
        pieVisual.style.setProperty('--non-toxic-deg', `${nonToxicDeg}deg`);
        
        // Animate bar charts
        const barFills = document.querySelectorAll('.bar-fill');
        barFills.forEach((bar, index) => {
            setTimeout(() => {
                const width = bar.getAttribute('data-width');
                bar.style.width = width + '%';
            }, index * 100);
        });
    }
    
    animateImportanceBars() {
        const bars = document.querySelectorAll('.importance-fill');
        bars.forEach(bar => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width + '%';
        });
    }
    
    displayModelInfo() {
        if (!this.modelInfo) return;
        
        const modelInfoElement = document.getElementById('modelInfo');
        modelInfoElement.innerHTML = `
            <div class=\"model-stats\">
                <div class=\"stat-card\">
                    <div class=\"stat-value\">${this.modelInfo.model_type}</div>
                    <div class=\"stat-label\">Model Type</div>
                </div>
                <div class=\"stat-card\">
                    <div class=\"stat-value\">${this.modelInfo.training_accuracy}</div>
                    <div class=\"stat-label\">Accuracy</div>
                </div>
                <div class=\"stat-card\">
                    <div class=\"stat-value\">${this.modelInfo.n_estimators}</div>
                    <div class=\"stat-label\">Estimators</div>
                </div>
                <div class=\"stat-card\">
                    <div class=\"stat-value\">${this.modelInfo.n_features}</div>
                    <div class=\"stat-label\">Features</div>
                </div>
                <div class=\"stat-card\">
                    <div class=\"stat-value\">${this.modelInfo.model_size}</div>
                    <div class=\"stat-label\">Model Size</div>
                </div>
            </div>
        `;
    }
    
    resetForm() {
        const form = document.getElementById('predictForm');
        form.reset();
        
        // Hide results and status sections
        document.getElementById('statusSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'none';
        
        // Clear custom validity
        this.features.names.forEach(featureName => {
            const input = document.getElementById(featureName);
            if (input) {
                input.setCustomValidity('');
            }
        });
        
        console.log('🔄 Form reset');
    }
    
    showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error';
        errorDiv.innerHTML = `<i class=\"fas fa-exclamation-triangle\"></i> ${message}`;
        
        // Show error in results section
        const resultsSection = document.getElementById('resultsSection');
        const resultContainer = document.getElementById('result');
        
        resultContainer.innerHTML = '';
        resultContainer.appendChild(errorDiv);
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌟 DOM loaded, starting application...');
    new ToxicityPredictor();
});

// Service worker for offline functionality (optional)
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/static/sw.js')
        .then(registration => console.log('📱 SW registered'))
        .catch(error => console.log('❌ SW registration failed'));
}
