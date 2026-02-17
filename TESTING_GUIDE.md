# Testing Guide - AI Learning Outcomes Generator

## Current Issue: API Quota Exceeded

The Gemini AI API has exceeded its free tier quota. Here are your options:

### Option 1: Manual Testing (Immediate)
1. Visit http://127.0.0.1:8080
2. Upload any syllabus file
3. You'll see a message: "AI service temporarily unavailable"
4. **Manually add** learning outcomes in Step 2:
   - Click "+ Add Learning Outcome"
   - Example: "Students will analyze financial data to make business decisions"
   - Add 3-5 outcomes
5. Add assessment methods:
   - Example: "Midterm Exam (30%)"
   - Add 2-3 methods
6. Configure AI settings (Step 3):
   - Set slider to 50%
   - Select "Using AI" and "Evaluating AI" dimensions
7. Generate AILOs

### Option 2: Wait for API Quota Reset
- Free tier quotas typically reset after 1 minute
- Current wait time: ~18-40 seconds
- Refresh and try uploading again

### Option 3: Use Paid API Key (Production Ready)
Update your `.env` file with a paid Gemini API key:
```
GEMINI_API_KEY=your-paid-api-key-here
```

## Testing Checklist

### Step 1: Upload ✓
- [x] Drag and drop works
- [x] Browse button works
- [x] File validation (PDF, DOCX, TXT only)
- [x] Size limit (16MB)
- [x] Processing indicator shows
- [x] Handles API errors gracefully

### Step 2: Validate ✓
- [ ] Extracted outcomes display correctly
- [x] Can edit outcomes
- [x] Can add new outcomes
- [x] Can delete outcomes
- [x] Assessment methods work same way
- [x] Validation before proceeding

### Step 3: Configure (NEW!)
- [ ] Slider works (0-100%)
- [ ] Value updates in real-time
- [ ] Can select multiple dimensions
- [ ] Visual feedback on selection
- [ ] Validates at least one dimension selected

### Step 4: Review AILOs
- [ ] Shows original → enhanced transformation
- [ ] Displays DEC dimension badge
- [ ] Shows assessment strategy
- [ ] Shows rubric points
- [ ] Transformation explanation visible
- [ ] "Refine Settings" returns to Step 3
- [ ] "Download AILOs" exports JSON + TXT

## Manual Test Data

If API is down, use these sample learning outcomes:

**Learning Outcomes:**
1. "Students will analyze financial statements to identify trends and make informed business recommendations"
2. "Apply statistical methods to evaluate business performance and forecast future outcomes"
3. "Create data visualizations to communicate complex financial information to stakeholders"
4. "Evaluate the ethical implications of data-driven decision making in business contexts"
5. "Develop analytical models to solve real-world accounting and finance problems"

**Assessment Methods:**
1. "Midterm Exam (25%) - Written examination covering core concepts"
2. "Final Project (30%) - Team-based data analysis project"
3. "Quizzes (20%) - Weekly online quizzes"
4. "Data Analysis Assignments (25%) - Individual assignments"

**Configuration:**
- AI Influence: 60%
- Dimensions: "Using AI", "Evaluating AI"

## Expected AILO Output (When API Works)

For outcome: "Students will analyze financial statements..."

**AILO:** "Students will use AI-powered financial analysis tools to analyze financial statements, critically evaluate AI-generated insights for accuracy and bias, and make informed business recommendations based on human judgment combined with AI analytics."

**Assessment Strategy:**
- Method: AI-Assisted Financial Statement Analysis
- Description: Students complete case studies using AI tools (e.g., predictive analytics) to analyze company financials, document their process, critique AI outputs, and justify final recommendations.
- Rubric:
  - Effective use of AI analytical tools
  - Critical evaluation of AI accuracy
  - Clear business justification
  - Ethical consideration of AI use

## Troubleshooting

### "MEDIUM" badges with empty textareas
**Cause:** API returned empty arrays due to quota
**Fix:** Implemented in latest update - now shows error message and allows manual entry

### Can't proceed to configuration
**Cause:** No learning outcomes entered
**Fix:** Add at least one outcome manually

### AILOs not generating
**Cause:** No dimensions selected OR API quota
**Fix:** Select at least one dimension, wait for API reset

## Next Steps

Once API quota resets (or with paid key):
1. Complete full workflow test
2. Verify AILO quality
3. Test export functionality
4. Deploy to Google Cloud Run: `./deploy-gcloud.sh`
