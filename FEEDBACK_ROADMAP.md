# Feedback Implementation Roadmap

## ✅ COMPLETED (Just Deployed)

### 1. Download Button Fixed
- **Issue**: Export/download feature wasn't working
- **Solution**: Updated `exportResults()` function to use correct `ailos` data structure
- **Status**: ✅ Fixed and committed

### 2. Hallucinations & Wrong Original Outcomes
- **Issue**: AI showing wrong "original outcomes" or paraphrasing them
- **Solution**: Added explicit instruction: "COPY THE EXACT ORIGINAL TEXT - DO NOT CHANGE ANY WORDS"
- **Status**: ✅ Fixed in prompt

### 3. Delete Individual AILOs
- **Issue**: Users could only delete all AILOs, not individual ones
- **Solution**: Added delete button (trash icon) on each AILO card
- **Status**: ✅ Implemented with confirmation dialog

### 4. Edit Individual AILOs
- **Issue**: No way to edit generated AILOs
- **Solution**: Made AILO text editable (click to edit, press Enter/blur to save)
- **Status**: ✅ Implemented with visual hover effect

### 5. DEC Dimension Label Matching
- **Issue**: Labels not exactly matching the 5 dimensions
- **Solution**: Added explicit constraint in prompt listing exact dimension names
- **Status**: ✅ Fixed in prompt

---

## 🚧 NEXT PHASE (Future Enhancements)

### 6. Add Completely New AI Learning Outcomes
**Requirement**: Allow users to add brand new AILOs (not just revise existing ones)

**Implementation**:
- Add "+ Add New AILO" button in results section
- Open modal/form with fields:
  - Original outcome (text input)
  - Select DEC dimension
  - Generate or manually write AILO
  - Assessment strategy fields
- Append to ailos array

**Estimated Effort**: Medium (2-3 hours)

---

### 7. Reinforcement Learning / Feedback Loop
**Requirement**: "Reinforcement learning through feedback to increase accuracy and quality"

**Implementation Options**:
A. **Simple Version**: Thumbs up/down on each AILO
   - Store feedback in database
   - Track which outcomes work well
   
B. **Advanced Version**: Full feedback form
   - Quality rating (1-5 stars)
   - What worked / what didn't
   - Suggested improvements
   - Feed into prompt engineering

**Database Needed**: 
- User feedback table
- AILO quality metrics
- Pattern analysis

**Estimated Effort**: High (5-8 hours for simple, 15+ for advanced)

---

### 8. Institutional Consistency 
**Requirement**: "Consistency between everything from institution standpoint"

**Implementation**:
- Add school/program configuration
- Store institution-specific preferences:
  - Preferred assessment methods
  - Standard rubric templates
  - Language style guide
  - Assessment weight guidelines
- Apply institutional standards to all generated content

**Estimated Effort**: High (8-12 hours)

---

### 9. Multiple Input Sources
**Requirement**: "Do we need more inputs? Syllabus + Projects and Assignments?"

**Implementation**:
- Step 1: Upload multiple files
  - Syllabus (required)
  - Project descriptions (optional)
  - Assignment rubrics (optional)
  - Course materials (optional)
- Extract context from all sources
- Better alignment with actual course structure

**Estimated Effort**: Medium-High (4-6 hours)

---

### 10. Benchmarking & Quality Metrics
**Requirement**: "How much better does this do? Vs. benchmarking"

**Implementation**:
- Compare with manual AILOs from faculty
- Quality metrics:
  - Bloom's taxonomy level
  - AI literacy depth
  - Assessment alignment score
- A/B testing different prompts
- Success rate tracking

**Needs**:
- Test dataset of "good" AILOs
- Evaluation rubric
- Comparison UI

**Estimated Effort**: High (10-15 hours)

---

### 11. Optimal Learning Outcome Count
**Requirement**: "Between 4-6 learning outcomes ideal, 7 +/- 2 range (5-9)"

**Implementation**:
- Add smart recommendations:
  - "You have 15 outcomes. Consider combining similar ones."
  - "Recommended: Transform 5-7 outcomes for AI literacy"
- Visual indicators when count is outside optimal range
- Grouping/consolidation suggestions

**Estimated Effort**: Low-Medium (2-3 hours)

---

### 12. Model Training / Fine-Tuning
**Requirement**: "Train model" with limited experience data

**Considerations**:
- **Current**: Using Gemini API (no custom training needed)
- **Option 1**: Fine-tune with institution data (requires Google Vertex AI)
- **Option 2**: Few-shot learning (add examples to prompt)
- **Option 3**: RAG (Retrieval Augmented Generation) with good examples

**Recommendation**: Start with Option 2 (easiest) → add 3-5 exemplar AILOs to prompt

**Estimated Effort**: 
- Few-shot (Option 2): Low (1-2 hours)
- Fine-tuning (Option 1): Very High (20+ hours + costs)
- RAG (Option 3): High (8-10 hours)

---

## 📊 Priority Ranking

1. **HIGH PRIORITY** (Do First):
   - ✅ Fix download (DONE)
   - ✅ Fix hallucinations (DONE)
   - ✅ Delete/Edit AILOs (DONE)
   - #11 - Optimal LO count warnings
   - #6 - Add new AILOs manually

2. **MEDIUM PRIORITY** (Do Next):
   - #12 - Few-shot learning with examples
   - #9 - Multiple input sources
   - #7A - Simple feedback (thumbs up/down)

3. **LOW PRIORITY** (Nice to Have):
   - #8 - Institutional consistency
   - #10 - Benchmarking
   - #7B - Advanced feedback system

---

## 🧪 Testing Plan

### Stress Test with IAAI Faculty Fellows
- Collect diverse syllabi formats
- Test with different disciplines:
  - IT/CS courses
  - Business courses
  - Project management
  - Marketing
- Document edge cases
- Collect quality feedback

### Key Metrics to Track:
- Extraction accuracy (% of LOs found)
- Hallucination rate (% wrong originals)
- User satisfaction (1-5 scale)
- Time saved vs manual process
- AILO quality ratings

---

## 📝 Notes from Feedback Session

- ITEC 643 (Project Management) worked well - extracted all 15 LOs correctly
- UG IT class (350 students) - good results
- Hallucinations noticed in original outcome matching
- Users want granular control (edit/delete individual AILOs)
- Need better DEC dimension label consistency
- Assessment strategies are helpful but text-heavy
- Consider program-level consistency (4-6 LOs optimal)

