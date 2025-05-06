# Neuro-Find: AI-Based Vascular Dementia Classification

A deep learning-based system for detecting and classifying Vascular Dementia from MRI scans.

## Project Structure

- `/frontend`: NextJS web application
- `/script`: Flask APIs
  - `app.py`: Binary classification API (VaD vs. Non-VaD)
  - `subclass.py`: Subtype classification API (VaD subtypes)

## Setup Instructions

### Model Files (Required but not included in repository)

This application requires two model files that need to be placed in the `/script` directory:
- `binary_epoch50.h5`: Binary classification model
- `VGG16_4_real_subclass.h5`: Subclass classification model

### Running the Application

1. **Backend (Flask APIs)**:
   ```bash
   cd script
   # Install requirements
   pip install -r requirements.txt
   
   # Run binary classification API (Terminal 1)
   python app.py
   
   # Run subclass classification API (Terminal 2)
   python subclass.py   