"""
AI Learning Outcomes Generator
Kogod School of Business - Google AI Project

This application helps faculty match their syllabus learning outcomes 
to the DEC AI Literacy Framework using Google Gemini AI.
"""

import os
import json
from flask import Flask, render_template, request, jsonify, session
from werkzeug.utils import secure_filename
from google import genai
from google.genai import types
from dotenv import load_dotenv
import PyPDF2
import docx
from datetime import datetime

# Load environment variables
load_dotenv()

# Configure Flask app
app = Flask(__name__)
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-change-in-production')
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
app.config['ALLOWED_EXTENSIONS'] = {'pdf', 'docx', 'txt'}

# Ensure upload folder exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Configure Google Gemini AI - using new google.genai library
client = genai.Client(api_key=os.environ.get('GEMINI_API_KEY'))

# DEC AI Literacy Framework dimensions
DEC_FRAMEWORK = {
    "dimensions": [
        {
            "name": "Understanding AI",
            "description": "Foundational knowledge of AI concepts, capabilities, and limitations",
            "learning_outcomes": [
                "Explain what artificial intelligence is and how it works",
                "Identify different types of AI systems and their applications",
                "Understand the capabilities and limitations of current AI technologies",
                "Recognize the difference between narrow AI and general AI"
            ]
        },
        {
            "name": "Using AI",
            "description": "Practical skills in applying AI tools and technologies",
            "learning_outcomes": [
                "Effectively use AI-powered tools for various tasks",
                "Evaluate AI outputs critically and verify accuracy",
                "Apply AI tools ethically and responsibly",
                "Integrate AI tools into workflows and problem-solving processes"
            ]
        },
        {
            "name": "Evaluating AI",
            "description": "Critical assessment of AI systems, outputs, and impacts",
            "learning_outcomes": [
                "Critically assess the quality and reliability of AI-generated content",
                "Identify potential biases in AI systems",
                "Evaluate the appropriateness of AI for specific contexts",
                "Assess the ethical implications of AI applications"
            ]
        },
        {
            "name": "AI Ethics and Society",
            "description": "Understanding broader implications of AI on society",
            "learning_outcomes": [
                "Understand ethical considerations in AI development and deployment",
                "Recognize societal impacts of AI including equity and fairness issues",
                "Discuss privacy and data protection in AI contexts",
                "Consider the environmental impact of AI technologies"
            ]
        },
        {
            "name": "Creating with AI",
            "description": "Developing and innovating with AI technologies",
            "learning_outcomes": [
                "Design solutions that incorporate AI technologies",
                "Collaborate with AI systems in creative processes",
                "Develop AI-enhanced products or services",
                "Innovate using AI within specific domain contexts"
            ]
        }
    ]
}


def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


def extract_text_from_pdf(file_path):
    """Extract text from PDF file"""
    text = ""
    with open(file_path, 'rb') as file:
        pdf_reader = PyPDF2.PdfReader(file)
        for page in pdf_reader.pages:
            text += page.extract_text()
    return text


def extract_text_from_docx(file_path):
    """Extract text from DOCX file"""
    doc = docx.Document(file_path)
    return '\n'.join([paragraph.text for paragraph in doc.paragraphs])


def extract_text_from_txt(file_path):
    """Extract text from TXT file"""
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()


def extract_text_from_file(file_path):
    """Extract text from uploaded file based on extension"""
    extension = file_path.rsplit('.', 1)[1].lower()
    
    if extension == 'pdf':
        return extract_text_from_pdf(file_path)
    elif extension == 'docx':
        return extract_text_from_docx(file_path)
    elif extension == 'txt':
        return extract_text_from_txt(file_path)
    else:
        raise ValueError(f"Unsupported file type: {extension}")


def extract_learning_outcomes_and_assessments(syllabus_text):
    """Use Gemini AI to extract learning outcomes and assessment methods from syllabus"""
    
    prompt = f"""
    You are an expert educational content analyst. Analyze the following syllabus and extract:
    
    1. All learning outcomes (also look for objectives, goals, or competencies)
    2. All assessment methods mentioned (exams, projects, assignments, presentations, etc.)
    
    Return your response in the following JSON format:
    {{
        "learning_outcomes": [
            {{"outcome": "specific learning outcome text", "confidence": "high|medium|low"}}
        ],
        "assessment_methods": [
            {{"method": "assessment method", "description": "brief description", "weight": "percentage if mentioned"}}
        ]
    }}
    
    Syllabus text:
    {syllabus_text}
    
    Only return valid JSON, no additional text.
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt
        )
        # Extract JSON from response
        response_text = response.text.strip()
        # Remove markdown code blocks if present
        if response_text.startswith('```json'):
            response_text = response_text[7:]
        if response_text.startswith('```'):
            response_text = response_text[3:]
        if response_text.endswith('```'):
            response_text = response_text[:-3]
        
        return json.loads(response_text.strip())
    except Exception as e:
        print(f"Error extracting outcomes: {e}")
        return {"learning_outcomes": [], "assessment_methods": [], "error": str(e)}


def generate_ailos(learning_outcomes, selected_dimensions, ai_influence_percent):
    """Use Gemini AI to generate AI Learning Outcomes (AILOs) based on user preferences"""
    
    framework_json = json.dumps(DEC_FRAMEWORK, indent=2)
    outcomes_text = "\n".join([f"- {lo['outcome']}" for lo in learning_outcomes])
    
    # Calculate how many outcomes to transform based on percentage
    num_to_transform = max(1, int(len(learning_outcomes) * (ai_influence_percent / 100)))
    
    dimensions_text = ", ".join(selected_dimensions) if selected_dimensions else "any relevant dimensions"
    
    prompt = f"""
    You are an AI literacy expert familiar with the Digital Education Council (DEC) AI Literacy Framework.
    
    DEC AI Literacy Framework:
    {framework_json}
    
    Existing course learning outcomes:
    {outcomes_text}
    
    TASK: Transform approximately {num_to_transform} out of {len(learning_outcomes)} learning outcomes (about {ai_influence_percent}%) into AI-enhanced learning outcomes (AILOs).
    
    CONSTRAINTS:
    - Focus on incorporating these DEC dimensions: {dimensions_text}
    - For each AILO you create:
      1. Choose an existing learning outcome that would benefit most from AI literacy integration
      2. Determine which selected DEC dimension BEST fits
      3. REWRITE it to integrate AI literacy concepts while maintaining the core subject matter
      4. Recommend specific assessment methods to evaluate this AILO
      5. Explain WHY and HOW the DEC framework influenced this transformation
    
    Return your response in the following JSON format:
    {{
        "ailos": [
            {{
                "original_outcome": "the original learning outcome text",
                "ailo": "the AI-enhanced learning outcome (AILO)",
                "dec_dimension": "the DEC dimension used",
                "assessment_strategy": {{
                    "method": "specific assessment method (e.g., AI-assisted project, critical evaluation assignment)",
                    "description": "detailed description of how to assess this AILO",
                    "rubric_points": ["key rubric criterion 1", "key rubric criterion 2", "key rubric criterion 3"]
                }},
                "explanation": "Explain WHY this DEC dimension was selected for this outcome and HOW it influenced the transformation. Focus on the pedagogical reasoning behind aligning with this specific dimension of the DEC AI Literacy Framework."
            }}
        ]
    }}
    
    Only return valid JSON, no additional text.
    """
    
    try:
        response = client.models.generate_content(
            model='gemini-2.0-flash',
            contents=prompt
        )
        response_text = response.text.strip()
        # Remove markdown code blocks if present
        if response_text.startswith('```json'):
            response_text = response_text[7:]
        if response_text.startswith('```'):
            response_text = response_text[3:]
        if response_text.endswith('```'):
            response_text = response_text[:-3]
        
        return json.loads(response_text.strip())
    except Exception as e:
        print(f"Error generating AILOs: {e}")
        return {"ailos": [], "error": str(e)}


@app.route('/')
def index():
    """Render main page"""
    return render_template('index.html')


@app.route('/upload', methods=['POST'])
def upload_file():
    """Handle syllabus upload and processing"""
    
    # Check if file was uploaded
    if 'syllabus' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['syllabus']
    
    # Check if file is selected
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    # Check file type
    if not allowed_file(file.filename):
        return jsonify({'error': 'Invalid file type. Please upload PDF, DOCX, or TXT'}), 400
    
    try:
        # Save file
        filename = secure_filename(file.filename)
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        unique_filename = f"{timestamp}_{filename}"
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(file_path)
        
        # Extract text from file
        syllabus_text = extract_text_from_file(file_path)
        
        # Store in session for later use
        session['syllabus_text'] = syllabus_text
        session['filename'] = filename
        
        # Extract learning outcomes and assessments using AI
        extracted_data = extract_learning_outcomes_and_assessments(syllabus_text)
        
        # Check if there was an API error
        if extracted_data.get('error'):
            return jsonify({
                'error': f"AI extraction failed: {extracted_data['error'][:200]}... Please try again in a moment.",
                'fallback': True
            }), 503
        
        # Check if we got any results
        if not extracted_data.get('learning_outcomes') or len(extracted_data['learning_outcomes']) == 0:
            return jsonify({
                'warning': 'No learning outcomes were automatically extracted. Please add them manually in the next step.',
                'extracted_data': {
                    'learning_outcomes': [],
                    'assessment_methods': extracted_data.get('assessment_methods', [])
                }
            })
        
        return jsonify({
            'success': True,
            'filename': filename,
            'extracted_data': extracted_data
        })
        
    except Exception as e:
        return jsonify({'error': f'Error processing file: {str(e)}'}), 500


@app.route('/validate', methods=['POST'])
def validate_extraction():
    """Receive validated learning outcomes and assessments from user"""
    
    data = request.json
    validated_outcomes = data.get('learning_outcomes', [])
    validated_assessments = data.get('assessment_methods', [])
    
    # Store validated data in session
    session['validated_outcomes'] = validated_outcomes
    session['validated_assessments'] = validated_assessments
    
    return jsonify({'success': True})


@app.route('/generate-ailos', methods=['POST'])
def generate_ailos_endpoint():
    """Generate AI Learning Outcomes based on user configuration"""
    
    data = request.json
    learning_outcomes = data.get('learning_outcomes', [])
    selected_dimensions = data.get('selected_dimensions', [])
    ai_influence_percent = data.get('ai_influence_percent', 50)
    
    if not learning_outcomes:
        return jsonify({'error': 'No learning outcomes provided'}), 400
    
    if not selected_dimensions:
        return jsonify({'error': 'Please select at least one DEC AI Literacy dimension'}), 400
    
    try:
        # Generate AILOs using AI
        result = generate_ailos(learning_outcomes, selected_dimensions, ai_influence_percent)
        
        return jsonify({
            'success': True,
            'ailos': result.get('ailos', []),
            'error': result.get('error')
        })
        
    except Exception as e:
        return jsonify({'error': f'Error generating AILOs: {str(e)}'}), 500


@app.route('/framework')
def get_framework():
    """Return DEC AI Literacy Framework data"""
    return jsonify(DEC_FRAMEWORK)


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(debug=os.environ.get('FLASK_ENV') == 'development', host='0.0.0.0', port=port)
