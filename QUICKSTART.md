# Quick Start Guide - AI Learning Outcomes Generator

## 🚀 Getting Started in 3 Steps

### Step 1: Add Your Google Gemini API Key

1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Open the `.env` file in this directory
3. Replace the empty `GEMINI_API_KEY=` with your actual key:
   ```
   GEMINI_API_KEY=your_actual_api_key_here
   ```

### Step 2: Activate the Virtual Environment

**On macOS/Linux:**
```bash
source venv/bin/activate
```

**On Windows:**
```cmd
venv\Scripts\activate
```

You should see `(venv)` appear in your terminal prompt.

### Step 3: Run the Application

```bash
python app.py
```

The application will start on `http://localhost:5000`

Open your browser and navigate to that URL!

---

## 📋 How to Use the Application

### 1. Upload Your Syllabus
- Drag and drop your syllabus file or click to browse
- Supported formats: PDF, DOCX, TXT
- Maximum file size: 16MB

### 2. Review & Validate
- The AI will automatically extract learning outcomes and assessment methods
- Review the extracted information
- Edit, add, or remove items as needed
- Click "Proceed to Matching" when ready

### 3. View AI-Enhanced Results
- See your learning outcomes matched to the DEC AI Literacy Framework
- View AI-enhanced versions of your learning outcomes
- Read specific recommendations for each outcome
- Export results for documentation

---

## 🎨 About the DEC AI Literacy Framework

The application uses five key dimensions:

1. **Understanding AI** - Foundational AI knowledge
2. **Using AI** - Practical AI tool skills
3. **Evaluating AI** - Critical AI assessment
4. **AI Ethics & Society** - Societal implications
5. **Creating with AI** - AI innovation and development

---

## 🛠️ Troubleshooting

**Problem:** "Import could not be resolved" errors
- **Solution:** Make sure virtual environment is activated

**Problem:** Can't upload file
- **Solution:** Check file size (max 16MB) and format (PDF, DOCX, TXT)

**Problem:** AI extraction fails
- **Solution:** Verify your GEMINI_API_KEY is correct in .env file

**Problem:** No outcomes extracted
- **Solution:** Ensure your syllabus has a clear learning outcomes section

---

## 📁 Project Structure

```
google-ai-deployment/
├── app.py              # Main Flask application
├── .env               # Your API key and config (DO NOT COMMIT)
├── requirements.txt   # Python dependencies
├── README.md         # Full documentation
├── QUICKSTART.md     # This file
├── templates/
│   └── index.html    # Web interface
├── static/
│   ├── css/
│   │   └── style.css # Styling
│   └── js/
│       └── main.js   # Frontend logic
└── uploads/          # Uploaded files (auto-created)
```

---

## 🔒 Security Notes

- Never share your `.env` file or commit it to Git
- Keep your Gemini API key confidential
- The `.env` file is already in `.gitignore`

---

## 💡 Tips for Best Results

1. **Clear Learning Outcomes**: Ensure your syllabus has a dedicated section for learning outcomes
2. **Detailed Assessments**: Include assessment descriptions for better extraction
3. **Validate Carefully**: Review extracted data before matching
4. **Export Results**: Save your AI-enhanced outcomes for future reference

---

## 📞 Need Help?

- Review the full [README.md](README.md) for detailed documentation
- Check that all dependencies are installed: `pip list`
- Ensure virtual environment is activated
- Verify your Gemini API key is valid

---

## 🎯 Next Steps After Setup

1. Upload a sample syllabus to test the system
2. Review the AI-generated suggestions
3. Customize the DEC framework dimensions if needed (in `app.py`)
4. Share feedback with the Kogod team

---

**Made with ❤️ by Kogod School of Business × Google**
