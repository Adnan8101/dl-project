# 🧬 Nanomaterial Toxicity Prediction Platform

![Platform Preview](https://img.shields.io/badge/Status-Ready%20for%20Deployment-brightgreen)
![ML Model](https://img.shields.io/badge/Model-Random%20Forest-blue)
![Accuracy](https://img.shields.io/badge/Accuracy-86.25%25-success)

An AI-powered web platform for predicting nanomaterial toxicity using machine learning. Built with Flask, scikit-learn, and modern web technologies.

## 🌟 Features

- **Real-time ML Predictions**: Random Forest model with 86.25% accuracy
- **Interactive Web Interface**: Modern, responsive design with real-time status updates
- **Comprehensive Analysis**: Detailed reports with charts and visualizations
- **Risk Assessment**: Multi-level risk classification with safety recommendations
- **Feature Analysis**: Individual parameter breakdown with importance scoring

## 🚀 Live Demo

**Deploy to Vercel:** [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Adnan8101/dl-project)

## 🏗️ Deployment Instructions

### Vercel Deployment

1. **Fork this repository** to your GitHub account

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your forked repository

3. **Configure Environment:**
   - No additional environment variables needed
   - Vercel will automatically detect the Python runtime

4. **Deploy:**
   - Click "Deploy"
   - Your app will be live at `https://your-project-name.vercel.app`

### Local Development

```bash
# Clone the repository
git clone https://github.com/Adnan8101/dl-project.git
cd dl-project

# Create virtual environment
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the application
python api/index.py
```

Visit `http://localhost:8080` to access the application.

## 📊 Technical Stack

- **Backend:** Flask (Python)
- **ML Model:** scikit-learn Random Forest Classifier
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Styling:** Custom CSS with CSS Grid/Flexbox
- **Icons:** Font Awesome
- **Deployment:** Vercel (Serverless)

## 🔬 Model Information

- **Algorithm:** Random Forest Classifier
- **Features:** 10 physicochemical properties
- **Training Accuracy:** 86.25%
- **Parameters Analyzed:**
  - Particle Size (nm)
  - Surface Area (m²/g)
  - Zeta Potential (mV)
  - pH Value
  - Concentration (mg/L)
  - Material Type
  - Crystallinity
  - Porosity
  - Hydrophobicity
  - Aspect Ratio

## 📁 Project Structure

```
├── api/
│   └── index.py           # Vercel serverless function
├── static/
│   ├── style.css          # Modern CSS styling
│   └── app.js             # Frontend JavaScript
├── templates/
│   └── index.html         # Main HTML template
├── *.pkl                  # ML model files
├── vercel.json            # Vercel configuration
├── requirements.txt       # Python dependencies
└── README.md              # This file
```

## 🎯 Usage

1. **Input Parameters:** Enter nanomaterial properties in the form
2. **Run Analysis:** Click "Run Analysis" to start prediction
3. **View Results:** See real-time status and prediction results
4. **Detailed Report:** Generate comprehensive analysis with charts

## 👥 Development Team

- **Adnan Qureshi** (Roll: 67) - Lead Developer
- **Chirayu Giri** (Roll: 68) - ML Engineer  
- **Abdul Adeen** (Roll: 69) - Web Developer

**Guided by:** Mrs. Sampada Bhonde  
**Project:** Deep Learning Course - 2025

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Contact

For questions or support, please contact the development team.

---

🔬 **Built with AI & Machine Learning for Safer Nanomaterial Research**
