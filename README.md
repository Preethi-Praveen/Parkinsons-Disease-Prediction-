# Parkinson's Voice Biomarker Web App

Netlify-ready static front end for:

**Explainable AI for Early Parkinson’s Disease Detection Using Voice Biomarkers**

## Included
- `index.html` — complete responsive web page
- `style.css` — professional responsive styling
- `script.js` — browser voice recording + demo analysis interaction
- `architecture.png` — supplied system architecture image

## Deploy to Netlify
1. Unzip this folder.
2. Open Netlify and choose **Add new site → Deploy manually**.
3. Drag the unzipped folder into the deployment area.
4. No build command is required.

## Connect a real ML model
The current analysis result is intentionally demo data. Replace the analysis section in `script.js` with a `fetch()` request to your backend, for example a FastAPI/Flask endpoint.

Recommended backend flow:
Browser audio → preprocessing → biomarker extraction → feature selection → trained classifier → SHAP/LIME explanation → JSON report.

Example JSON response:
{
  "prediction": "Parkinson's screening positive",
  "confidence": 0.86,
  "biomarkers": {
    "jitter": 0.68,
    "shimmer": 3.21,
    "f0": 152,
    "harmonicity": 18.4
  },
  "explanation": [
    {"feature": "Jitter", "importance": 0.82},
    {"feature": "Shimmer", "importance": 0.68}
  ]
}

## Important
This is a research/academic prototype. It is not a medical diagnostic device. A real deployment should use a validated model, secure audio handling, informed consent, appropriate privacy controls, clinical validation, and suitable regulatory review.
