# Flask backend for nanomaterial toxicity prediction
# Provides /predict and /team endpoints
# Loads model and scaler
# Team and guide info included

from flask import Flask, request, jsonify, render_template
import numpy as np
import pickle
import os
import time
import json
from datetime import datetime

app = Flask(__name__, template_folder='templates', static_folder='static')

# Global variables for model and scaler
model = None
scaler = None
feature_info = None

def load_ml_model():
    """Load the trained ML model, scaler, and feature info"""
    global model, scaler, feature_info
    
    try:
        # Load model
        with open('nanomaterial_toxicity_model.pkl', 'rb') as f:
            model = pickle.load(f)
        
        # Load scaler
        with open('feature_scaler.pkl', 'rb') as f:
            scaler = pickle.load(f)
            
        # Load feature info
        with open('feature_info.pkl', 'rb') as f:
            feature_info = pickle.load(f)
            
        print("✅ ML Model loaded successfully!")
        return True
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return False

# Load model on startup
load_ml_model()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/features')
def get_features():
    """Get feature information for the frontend"""
    if feature_info:
        return jsonify(feature_info)
    else:
        return jsonify({'error': 'Model not loaded'}), 500

@app.route('/predict', methods=['POST'])
def predict():
    """Predict nanomaterial toxicity with real-time status updates"""
    if not model or not scaler or not feature_info:
        return jsonify({'error': 'Model not loaded properly'}), 500
    
    try:
        # Get input data
        data = request.get_json()
        
        # Create status log for real-time updates
        status_log = []
        start_time = time.time()
        
        # Step 1: Data validation
        status_log.append({
            'step': 'validation',
            'message': 'Validating input parameters...',
            'timestamp': time.time() - start_time,
            'status': 'processing'
        })
        
        # Extract features in correct order
        features = []
        feature_names = feature_info['names']
        
        for feature_name in feature_names:
            if feature_name in data:
                value = float(data[feature_name])
                features.append(value)
            else:
                return jsonify({
                    'error': f'Missing feature: {feature_name}',
                    'status_log': status_log
                }), 400
        
        status_log.append({
            'step': 'validation',
            'message': '✅ Input validation completed',
            'timestamp': time.time() - start_time,
            'status': 'completed'
        })
        
        # Step 2: Feature preprocessing
        status_log.append({
            'step': 'preprocessing',
            'message': 'Normalizing features using StandardScaler...',
            'timestamp': time.time() - start_time,
            'status': 'processing'
        })
        
        # Scale features
        features_array = np.array(features).reshape(1, -1)
        features_scaled = scaler.transform(features_array)
        
        status_log.append({
            'step': 'preprocessing',
            'message': '✅ Feature scaling completed',
            'timestamp': time.time() - start_time,
            'status': 'completed'
        })
        
        # Step 3: Model prediction
        status_log.append({
            'step': 'prediction',
            'message': 'Running Random Forest model inference...',
            'timestamp': time.time() - start_time,
            'status': 'processing'
        })
        
        # Make prediction
        prediction_prob = model.predict_proba(features_scaled)[0]
        prediction_class = model.predict(features_scaled)[0]
        
        # Get feature importance for this prediction
        feature_importance = dict(zip(feature_names, model.feature_importances_))
        
        status_log.append({
            'step': 'prediction',
            'message': '✅ Model inference completed',
            'timestamp': time.time() - start_time,
            'status': 'completed'
        })
        
        # Step 4: Result interpretation
        status_log.append({
            'step': 'interpretation',
            'message': 'Analyzing prediction results...',
            'timestamp': time.time() - start_time,
            'status': 'processing'
        })
        
        # Calculate confidence and risk factors
        confidence = max(prediction_prob) * 100
        non_toxic_prob = prediction_prob[0] * 100
        toxic_prob = prediction_prob[1] * 100
        
        # Risk assessment
        risk_level = 'Low'
        if toxic_prob > 70:
            risk_level = 'High'
        elif toxic_prob > 40:
            risk_level = 'Medium'
        
        # Key risk factors
        risk_factors = []
        if data.get('particle_size_nm', 0) < 50:
            risk_factors.append('Small particle size increases bioavailability')
        if data.get('surface_area_m2g', 0) > 100:
            risk_factors.append('High surface area enhances reactivity')
        if data.get('concentration_mgl', 0) > 100:
            risk_factors.append('High concentration increases exposure risk')
        if data.get('material_type', 0) == 1:
            risk_factors.append('Metal nanoparticles can have higher toxicity')
        if data.get('aspect_ratio', 1) > 10:
            risk_factors.append('High aspect ratio (fiber-like) may cause inflammation')
        
        status_log.append({
            'step': 'interpretation',
            'message': '✅ Result analysis completed',
            'timestamp': time.time() - start_time,
            'status': 'completed'
        })
        
        # Final result
        total_time = time.time() - start_time
        
        result = {
            'prediction': int(prediction_class),
            'prediction_text': 'Toxic' if prediction_class == 1 else 'Non-Toxic',
            'confidence': round(confidence, 2),
            'probabilities': {
                'non_toxic': round(non_toxic_prob, 2),
                'toxic': round(toxic_prob, 2)
            },
            'risk_level': risk_level,
            'risk_factors': risk_factors,
            'feature_importance': {k: round(v, 4) for k, v in sorted(feature_importance.items(), key=lambda x: x[1], reverse=True)[:5]},
            'processing_time': round(total_time, 3),
            'status_log': status_log,
            'timestamp': datetime.now().isoformat()
        }
        
        return jsonify(result)
        
    except Exception as e:
        return jsonify({
            'error': f'Prediction failed: {str(e)}',
            'status_log': status_log if 'status_log' in locals() else []
        }), 500

@app.route('/model-info')
def model_info():
    """Get information about the trained model"""
    if not model:
        return jsonify({'error': 'Model not loaded'}), 500
    
    try:
        info = {
            'model_type': 'Random Forest Classifier',
            'n_estimators': model.n_estimators,
            'max_depth': model.max_depth,
            'n_features': model.n_features_in_,
            'feature_names': feature_info['names'] if feature_info else [],
            'training_accuracy': '86.25%',  # From training results
            'model_size': f"{len(pickle.dumps(model)) / 1024:.1f} KB"
        }
        return jsonify(info)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/team')
def team():
    return jsonify({
        'project': 'Nanomaterial Toxicity Prediction Using Deep Learning',
        'team': [
            {'name': 'Adnan Qureshi', 'roll': 67, 'role': 'Lead Developer'},
            {'name': 'Chirayu Giri', 'roll': 68, 'role': 'ML Engineer'},
            {'name': 'Abdul Adeen', 'roll': 69, 'role': 'Web Developer'}
        ],
        'guide': 'Mrs. Sampada Bhonde',
        'institution': 'Deep Learning Course Project',
        'year': '2025'
    })

@app.route('/detailed-analysis', methods=['POST'])
def detailed_analysis():
    """Generate detailed analysis report with statistics and insights"""
    if not model or not scaler or not feature_info:
        return jsonify({'error': 'Model not loaded properly'}), 500
    
    try:
        data = request.get_json()
        
        # Extract features
        features = []
        feature_names = feature_info['names']
        
        for feature_name in feature_names:
            if feature_name in data:
                value = float(data[feature_name])
                features.append(value)
            else:
                return jsonify({'error': f'Missing feature: {feature_name}'}), 400
        
        # Scale features and make prediction
        features_array = np.array(features).reshape(1, -1)
        features_scaled = scaler.transform(features_array)
        prediction_prob = model.predict_proba(features_scaled)[0]
        prediction_class = model.predict(features_scaled)[0]
        
        # Generate comprehensive analysis
        analysis = {
            'prediction': {
                'class': int(prediction_class),
                'text': 'Toxic' if prediction_class == 1 else 'Non-Toxic',
                'confidence': round(max(prediction_prob) * 100, 2),
                'probabilities': {
                    'non_toxic': round(prediction_prob[0] * 100, 2),
                    'toxic': round(prediction_prob[1] * 100, 2)
                }
            },
            'feature_analysis': {},
            'risk_assessment': {
                'overall_risk': 'Low',
                'risk_factors': [],
                'safety_recommendations': []
            },
            'statistical_analysis': {},
            'comparative_analysis': {},
            'charts_data': {}
        }
        
        # Feature-by-feature analysis
        for i, (name, value) in enumerate(zip(feature_names, features)):
            desc = feature_info['descriptions'][name]
            importance = model.feature_importances_[i]
            
            # Risk assessment per feature
            risk_level = 'Low'
            if name == 'particle_size_nm' and value < 50:
                risk_level = 'High'
            elif name == 'surface_area_m2g' and value > 200:
                risk_level = 'Medium'
            elif name == 'concentration_mgl' and value > 500:
                risk_level = 'High'
            elif name == 'zeta_potential_mv' and abs(value) < 15:
                risk_level = 'Medium'
            
            analysis['feature_analysis'][name] = {
                'value': value,
                'description': desc,
                'importance': round(importance, 4),
                'risk_level': risk_level,
                'normalized_value': round(features_scaled[0][i], 3)
            }
        
        # Risk assessment
        if prediction_prob[1] > 0.7:
            analysis['risk_assessment']['overall_risk'] = 'High'
        elif prediction_prob[1] > 0.4:
            analysis['risk_assessment']['overall_risk'] = 'Medium'
        
        # Generate recommendations
        recommendations = []
        if data.get('particle_size_nm', 0) < 50:
            recommendations.append('Consider larger particle sizes to reduce bioavailability')
        if data.get('concentration_mgl', 0) > 500:
            recommendations.append('Reduce concentration to minimize exposure risk')
        if data.get('surface_area_m2g', 0) > 200:
            recommendations.append('Monitor surface reactivity due to high surface area')
        
        analysis['risk_assessment']['safety_recommendations'] = recommendations
        
        # Chart data for visualization
        analysis['charts_data'] = {
            'probability_chart': [
                {'label': 'Non-Toxic', 'value': analysis['prediction']['probabilities']['non_toxic']},
                {'label': 'Toxic', 'value': analysis['prediction']['probabilities']['toxic']}
            ],
            'feature_importance': [
                {'feature': name, 'importance': round(imp * 100, 2)} 
                for name, imp in zip(feature_names, model.feature_importances_)
            ],
            'risk_distribution': [
                {'category': 'Low Risk Features', 'count': sum(1 for f in analysis['feature_analysis'].values() if f['risk_level'] == 'Low')},
                {'category': 'Medium Risk Features', 'count': sum(1 for f in analysis['feature_analysis'].values() if f['risk_level'] == 'Medium')},
                {'category': 'High Risk Features', 'count': sum(1 for f in analysis['feature_analysis'].values() if f['risk_level'] == 'High')}
            ]
        }
        
        return jsonify(analysis)
        
    except Exception as e:
        return jsonify({'error': f'Analysis failed: {str(e)}'}), 500

@app.route('/health')
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'scaler_loaded': scaler is not None,
        'features_loaded': feature_info is not None,
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    print("🚀 Starting Nanomaterial Toxicity Prediction Server...")
    print("📊 Model Status:")
    print(f"  - Model Loaded: {'✅' if model else '❌'}")
    print(f"  - Scaler Loaded: {'✅' if scaler else '❌'}")
    print(f"  - Features Loaded: {'✅' if feature_info else '❌'}")
    
    app.run(debug=True, host='0.0.0.0', port=8080)
