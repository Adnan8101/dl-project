# Nanomaterial Toxicity Prediction Web Application

## Project Overview
This web application predicts the toxicity of nanomaterials based on their physicochemical properties using a machine learning approach. The application provides a user-friendly interface for researchers and safety assessors to quickly evaluate nanomaterial safety.

## Team Members
- **Adnan Qureshi** - 67
- **Chirayu Giri** - 68  
- **Abdul Adeen** - 69

**Guided by:** Mrs. Sampada Bhonde

## Features
- 🔬 **Real-time Prediction**: Enter nanomaterial properties and get instant toxicity predictions
- 📊 **Confidence Scoring**: Provides confidence levels for predictions
- 🎨 **Modern UI**: Beautiful, responsive design with gradient backgrounds
- 📱 **Mobile Friendly**: Works perfectly on all device sizes
- ⚡ **Fast Processing**: Lightweight backend for quick responses

## Input Parameters
The application considers the following nanomaterial properties:

1. **Particle Size (nm)**: Size of nanoparticles in nanometers
2. **Surface Area (m²/g)**: Specific surface area 
3. **Zeta Potential (mV)**: Surface charge measurement
4. **pH**: Acidity/alkalinity of the environment
5. **Concentration (mg/L)**: Concentration in the medium
6. **Material Type**: Metal (1) or Oxide (0)

## Prediction Algorithm
The application uses a rule-based prediction model that considers:
- Smaller particles tend to be more toxic
- Higher surface area increases potential toxicity
- Concentration effects on biological systems
- Material type differences (metals vs oxides)

## Technology Stack
- **Backend**: Flask (Python)
- **Frontend**: HTML5, CSS3, JavaScript
- **Styling**: Custom CSS with gradients and animations
- **Icons**: Unicode emojis for better UX

## Installation & Setup

### Prerequisites
- Python 3.8+
- Virtual environment (recommended)

### Steps
1. Clone or download the project
2. Navigate to the webapp directory:
   ```bash
   cd webapp
   ```

3. Create a virtual environment:
   ```bash
   python -m venv .venv
   source .venv/bin/activate  # On Windows: .venv\Scripts\activate
   ```

4. Install dependencies:
   ```bash
   pip install flask numpy
   ```

5. Run the application:
   ```bash
   python app.py
   ```

6. Open your browser and go to:
   ```
   http://localhost:5000
   ```

## Usage
1. Enter the nanomaterial properties in the form
2. Click "🔍 Predict Toxicity"
3. View the prediction result with confidence score
4. The result will show:
   - **Toxic** or **Non-Toxic** classification
   - Confidence percentage
   - Toxicity score (0-10 scale)

## API Endpoints
- `GET /` - Main application interface
- `POST /predict` - Toxicity prediction endpoint
- `GET /team` - Team information (JSON)

## Project Structure
```
webapp/
├── app.py              # Flask backend
├── requirements.txt    # Python dependencies
├── templates/
│   └── index.html     # Main HTML template
├── static/
│   ├── style.css      # CSS styling
│   └── app.js         # JavaScript functionality
└── README.md          # This file
```

## Future Enhancements
- Integration with real machine learning models (TensorFlow/PyTorch)
- Database storage for prediction history
- User authentication and sessions
- Advanced visualization of results
- Export functionality for reports
- Batch prediction capabilities

## Contributing
This project was developed as part of a deep learning course. For improvements or suggestions, please contact the team members.

## License
Educational project - developed for learning purposes.

---
**Built with ❤️ by the Deep Learning Team**
