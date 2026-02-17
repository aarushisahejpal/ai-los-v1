// Global state
let uploadedFile = null;
let extractedData = null;
let validatedOutcomes = [];
let validatedAssessments = [];
let ailos = null;
let selectedDimensions = [];
let aiInfluencePercent = 50;

// DOM Elements
const uploadSection = document.getElementById('upload-section');
const validationSection = document.getElementById('validation-section');
const configurationSection = document.getElementById('configuration-section');
const resultsSection = document.getElementById('results-section');
const uploadArea = document.getElementById('upload-area');
const fileInput = document.getElementById('file-input');
const browseBtn = document.getElementById('browse-btn');
const fileInfo = document.getElementById('file-info');
const fileName = document.getElementById('file-name');
const changeFileBtn = document.getElementById('change-file');
const processing = document.getElementById('processing');
const outcomesList = document.getElementById('outcomes-list');
const assessmentsList = document.getElementById('assessments-list');
const addOutcomeBtn = document.getElementById('add-outcome');
const addAssessmentBtn = document.getElementById('add-assessment');
const backToUploadBtn = document.getElementById('back-to-upload');
const proceedToConfigureBtn = document.getElementById('proceed-to-configure');
const backToValidationBtn = document.getElementById('back-to-validation');
const aiInfluenceSlider = document.getElementById('ai-influence');
const aiInfluenceValue = document.getElementById('ai-influence-value');
const generateAilosBtn = document.getElementById('generate-ailos');
const backToConfigureBtn = document.getElementById('back-to-configure');
const exportResultsBtn = document.getElementById('export-results');
const startOverBtn = document.getElementById('start-over');
const matchingProcessing = document.getElementById('matching-processing');
const resultsContainer = document.getElementById('results-container');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
});

function setupEventListeners() {
    // Upload area interactions
    browseBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent event bubbling to upload area
        fileInput.click();
    });
    fileInput.addEventListener('change', handleFileSelect);
    uploadArea.addEventListener('click', (e) => {
        // Only trigger if clicking on the upload area itself, not the button
        if (e.target === uploadArea || e.target.closest('.upload-icon, .upload-text, .upload-subtext')) {
            fileInput.click();
        }
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', handleDragOver);
    uploadArea.addEventListener('dragleave', handleDragLeave);
    uploadArea.addEventListener('drop', handleDrop);
    
    // File management
    changeFileBtn.addEventListener('click', resetUpload);
    
    // Validation buttons
    addOutcomeBtn.addEventListener('click', () => addNewItem('outcome'));
    addAssessmentBtn.addEventListener('click', () => addNewItem('assessment'));
    backToUploadBtn.addEventListener('click', () => showSection('upload'));
    proceedToConfigureBtn.addEventListener('click', handleProceedToConfigure);
    
    // Configuration buttons
    backToValidationBtn.addEventListener('click', () => showSection('validation'));
    aiInfluenceSlider.addEventListener('input', (e) => {
        aiInfluencePercent = parseInt(e.target.value);
        aiInfluenceValue.textContent = aiInfluencePercent;
    });
    
    // Dimension checkboxes
    document.querySelectorAll('.dimension-checkbox input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', updateSelectedDimensions);
    });
    
    generateAilosBtn.addEventListener('click', handleGenerateAilos);
    
    // Results buttons
    backToConfigureBtn.addEventListener('click', () => showSection('configuration'));
    exportResultsBtn.addEventListener('click', exportResults);
    startOverBtn.addEventListener('click', startOver);
}

// Drag and drop handlers
function handleDragOver(e) {
    e.preventDefault();
    uploadArea.classList.add('drag-over');
}

function handleDragLeave(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
}

function handleDrop(e) {
    e.preventDefault();
    uploadArea.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        fileInput.files = files;
        handleFileSelect({ target: { files: files } });
    }
}

// File handling
async function handleFileSelect(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    // Validate file type
    const validTypes = ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    if (!validTypes.includes(file.type)) {
        showError('Invalid file type. Please upload PDF, DOCX, or TXT files.');
        return;
    }
    
    // Validate file size (16MB)
    if (file.size > 16 * 1024 * 1024) {
        showError('File size exceeds 16MB limit.');
        return;
    }
    
    uploadedFile = file;
    fileName.textContent = file.name;
    uploadArea.classList.add('hidden');
    fileInfo.classList.remove('hidden');
    
    // Upload and process file
    await uploadFile(file);
}

async function uploadFile(file) {
    const formData = new FormData();
    formData.append('syllabus', file);
    
    processing.classList.remove('hidden');
    
    try {
        const response = await fetch('/upload', {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (response.status === 503 && data.fallback) {
            // API quota exceeded - show helpful message
            showError('AI service temporarily unavailable (quota exceeded). Please enter learning outcomes manually in the next step.');
            extractedData = {
                learning_outcomes: [],
                assessment_methods: []
            };
            processing.classList.add('hidden');
            setTimeout(() => {
                populateValidationSection();
                showSection('validation');
            }, 1000);
            return;
        }
        
        if (data.error) {
            showError(data.error);
            processing.classList.add('hidden');
            return;
        }
        
        if (data.warning) {
            showWarning(data.warning);
        }
        
        extractedData = data.extracted_data;
        processing.classList.add('hidden');
        
        // Show success and proceed to validation
        setTimeout(() => {
            populateValidationSection();
            showSection('validation');
        }, 500);
        
    } catch (error) {
        showError('Error uploading file: ' + error.message);
        processing.classList.add('hidden');
    }
}

function resetUpload() {
    fileInput.value = '';
    uploadedFile = null;
    uploadArea.classList.remove('hidden');
    fileInfo.classList.add('hidden');
}

// Validation section
function populateValidationSection() {
    // Populate learning outcomes
    outcomesList.innerHTML = '';
    if (extractedData.learning_outcomes && extractedData.learning_outcomes.length > 0) {
        extractedData.learning_outcomes.forEach((outcome, index) => {
            // Handle both outcome.outcome and direct string formats
            const outcomeText = typeof outcome === 'string' ? outcome : (outcome.outcome || '');
            const confidenceLevel = typeof outcome === 'object' ? (outcome.confidence || 'medium') : 'medium';
            addOutcomeItem(outcomeText, confidenceLevel, index);
        });
    } else {
        // Add empty item if no outcomes extracted
        addOutcomeItem('', 'medium', null);
    }
    
    // Populate assessment methods
    assessmentsList.innerHTML = '';
    if (extractedData.assessment_methods && extractedData.assessment_methods.length > 0) {
        extractedData.assessment_methods.forEach((assessment, index) => {
            addAssessmentItem(assessment, index);
        });
    } else {
        // Add empty item if no assessments extracted
        addAssessmentItem({}, null);
    }
}

function addOutcomeItem(text = '', confidence = 'medium', index = null) {
    const item = document.createElement('div');
    item.className = 'item';
    item.dataset.index = index !== null ? index : Date.now();
    
    // Ensure text is a string and trim it
    const outcomeText = String(text || '').trim();
    const confidenceBadge = outcomeText && confidence ? `<span class="confidence-badge confidence-${confidence.toLowerCase()}">${confidence.toUpperCase()}</span>` : '';
    
    item.innerHTML = `
        <div class="item-content">
            <textarea placeholder="Enter learning outcome...">${outcomeText}</textarea>
            ${confidenceBadge}
        </div>
        <div class="item-actions">
            <button onclick="deleteItem(this)" class="delete-btn" title="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        </div>
    `;
    
    outcomesList.appendChild(item);
}

function addAssessmentItem(assessment = {}, index = null) {
    const item = document.createElement('div');
    item.className = 'item';
    item.dataset.index = index !== null ? index : Date.now();
    
    const text = assessment.method ? `${assessment.method}${assessment.description ? ': ' + assessment.description : ''}${assessment.weight ? ' (' + assessment.weight + ')' : ''}` : '';
    
    item.innerHTML = `
        <div class="item-content">
            <textarea placeholder="Enter assessment method...">${text}</textarea>
        </div>
        <div class="item-actions">
            <button onclick="deleteItem(this)" class="delete-btn" title="Delete">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </button>
        </div>
    `;
    
    assessmentsList.appendChild(item);
}

function addNewItem(type) {
    if (type === 'outcome') {
        addOutcomeItem();
    } else {
        addAssessmentItem();
    }
}

function deleteItem(button) {
    button.closest('.item').remove();
}

async function handleProceedToConfigure() {
    // Collect validated outcomes
    validatedOutcomes = [];
    const outcomeItems = outcomesList.querySelectorAll('.item');
    outcomeItems.forEach(item => {
        const textarea = item.querySelector('textarea');
        if (textarea.value.trim()) {
            validatedOutcomes.push({
                outcome: textarea.value.trim()
            });
        }
    });
    
    if (validatedOutcomes.length === 0) {
        showError('Please add at least one learning outcome.');
        return;
    }
    
    // Collect validated assessments
    validatedAssessments = [];
    const assessmentItems = assessmentsList.querySelectorAll('.item');
    assessmentItems.forEach(item => {
        const textarea = item.querySelector('textarea');
        if (textarea.value.trim()) {
            validatedAssessments.push({
                method: textarea.value.trim()
            });
        }
    });
    
    // Validate extraction
    try {
        await fetch('/validate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                learning_outcomes: validatedOutcomes,
                assessment_methods: validatedAssessments
            })
        });
    } catch (error) {
        console.error('Error validating:', error);
    }
    
    // Proceed to configuration
    showSection('configuration');
}

function updateSelectedDimensions() {
    selectedDimensions = [];
    document.querySelectorAll('.dimension-checkbox input[type="checkbox"]:checked').forEach(checkbox => {
        selectedDimensions.push(checkbox.value);
    });
}

async function handleGenerateAilos() {
    if (selectedDimensions.length === 0) {
        showError('Please select at least one DEC AI Literacy dimension.');
        return;
    }
    
    showSection('results');
    await generateAilosRequest();
}

async function generateAilosRequest() {
    matchingProcessing.classList.remove('hidden');
    resultsContainer.innerHTML = '';
    
    try {
        const response = await fetch('/generate-ailos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                learning_outcomes: validatedOutcomes,
                selected_dimensions: selectedDimensions,
                ai_influence_percent: aiInfluencePercent
            })
        });
        
        const data = await response.json();
        
        if (data.error) {
            showError(data.error);
            matchingProcessing.classList.add('hidden');
            return;
        }
        
        ailos = data.ailos;
        displayResults(ailos);
        matchingProcessing.classList.add('hidden');
        
    } catch (error) {
        showError('Error generating AILOs: ' + error.message);
        matchingProcessing.classList.add('hidden');
    }
}

function displayResults(ailos) {
    if (!ailos || ailos.length === 0) {
        resultsContainer.innerHTML = '<p>No AILOs generated. Try adjusting your settings.</p>';
        return;
    }
    
    ailos.forEach((ailo, index) => {
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        
        const rubricHtml = ailo.assessment_strategy && ailo.assessment_strategy.rubric_points && ailo.assessment_strategy.rubric_points.length > 0
            ? `<div class="rubric-points">
                <strong>Key Assessment Criteria:</strong>
                <ul>
                    ${ailo.assessment_strategy.rubric_points.map(point => `<li>${point}</li>`).join('')}
                </ul>
               </div>`
            : '';
        
        resultItem.innerHTML = `
            <div class="result-header">
                <span class="dimension-badge">${ailo.dec_dimension}</span>
                <span class="ailo-number">AILO #${index + 1}</span>
            </div>
            
            <div class="existing-outcome">
                <strong style="font-size: 12px; color: var(--text-secondary); text-transform: uppercase;">Original Learning Outcome:</strong>
                <p style="margin-top: 8px;">${ailo.original_outcome}</p>
            </div>
            
            <div class="ai-outcome">
                <div class="ai-outcome-label">✨ AI Learning Outcome (AILO)</div>
                <p>${ailo.ailo}</p>
            </div>
            
            <div class="alignment-explanation">
                <div class="alignment-label">🎯 Why & How: DEC AI Framework Alignment</div>
                <p>${ailo.explanation}</p>
            </div>
            
            <div class="assessment-strategy">
                <div class="assessment-label">📋 Assessment Strategy</div>
                <div class="assessment-content">
                    <div class="assessment-method">
                        <strong>Method:</strong> ${ailo.assessment_strategy.method}
                    </div>
                    <div class="assessment-description">
                        <strong>Description:</strong>
                        <p>${ailo.assessment_strategy.description}</p>
                    </div>
                    ${rubricHtml}
                </div>
            </div>
        `;
        
        resultsContainer.appendChild(resultItem);
    });
}

// Section navigation
function showSection(section) {
    uploadSection.classList.remove('active');
    validationSection.classList.remove('active');
    configurationSection.classList.remove('active');
    resultsSection.classList.remove('active');
    
    if (section === 'upload') {
        uploadSection.classList.add('active');
    } else if (section === 'validation') {
        validationSection.classList.add('active');
    } else if (section === 'configuration') {
        configurationSection.classList.add('active');
    } else if (section === 'results') {
        resultsSection.classList.add('active');
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Export results
function exportResults() {
    if (!matchResults) return;
    
    const exportData = {
        filename: uploadedFile ? uploadedFile.name : 'syllabus',
        date: new Date().toISOString(),
        configuration: {
            ai_influence_percent: aiInfluencePercent,
            selected_dimensions: selectedDimensions
        },
        validated_outcomes: validatedOutcomes,
        validated_assessments: validatedAssessments,
        ailos: ailos
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `ai-learning-outcomes-${Date.now()}.json`;
    link.click();
    
    // Also create a readable text version
    let textContent = `AI Learning Outcomes Report\n`;
    textContent += `Generated: ${new Date().toLocaleString()}\n`;
    textContent += `Original Syllabus: ${uploadedFile ? uploadedFile.name : 'N/A'}\n`;
    textContent += `\n${'='.repeat(80)}\n\n`;
    
    if (matchResults.matches) {
        matchResults.matches.forEach((match, index) => {
            textContent += `${index + 1}. ${match.dec_dimension || 'General AI Literacy'}\n`;
            textContent += `   Alignment: ${match.alignment_strength || 'Medium'}\n\n`;
            textContent += `   EXISTING OUTCOME:\n   ${match.existing_outcome}\n\n`;
            textContent += `   AI-ENHANCED OUTCOME:\n   ${match.suggested_ai_outcome}\n\n`;
            textContent += `   RECOMMENDATIONS:\n   ${match.feedback}\n\n`;
            textContent += `${'-'.repeat(80)}\n\n`;
        });
    }
    
    const textBlob = new Blob([textContent], { type: 'text/plain' });
    const textLink = document.createElement('a');
    textLink.href = URL.createObjectURL(textBlob);
    textLink.download = `ai-learning-outcomes-${Date.now()}.txt`;
    textLink.click();
}

// Start over
function startOver() {
    if (confirm('Are you sure you want to start over? All progress will be lost.')) {
        uploadedFile = null;
        extractedData = null;
        validatedOutcomes = [];
        validatedAssessments = [];
        matchResults = null;
        
        resetUpload();
        outcomesList.innerHTML = '';
        assessmentsList.innerHTML = '';
        resultsContainer.innerHTML = '';
        
        showSection('upload');
    }
}

// Error handling
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    const currentSection = document.querySelector('.step-card.active .card-content');
    if (currentSection) {
        currentSection.insertBefore(errorDiv, currentSection.firstChild);
        
        setTimeout(() => {
            errorDiv.remove();
        }, 5000);
    }
}

function showWarning(message) {
    const warningDiv = document.createElement('div');
    warningDiv.className = 'warning-message';
    warningDiv.textContent = message;
    
    const currentSection = document.querySelector('.step-card.active .card-content');
    if (currentSection) {
        currentSection.insertBefore(warningDiv, currentSection.firstChild);
        
        setTimeout(() => {
            warningDiv.remove();
        }, 5000);
    }
}

// Make functions available globally
window.deleteItem = deleteItem;
