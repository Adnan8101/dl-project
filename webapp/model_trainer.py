"""
Nanomaterial Toxicity Prediction Model Trainer
Creates and trains a neural network model for toxicity prediction
"""

import pandas as pd
import numpy as np
import tensorflow as tf
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import classification_report, confusion_matrix, accuracy_score
import pickle
import matplotlib.pyplot as plt
import seaborn as sns

# Set random seeds for reproducibility
np.random.seed(42)
tf.random.set_seed(42)

def generate_synthetic_nanotox_dataset(n_samples=1000):
    """Generate a synthetic nanotoxicology dataset"""
    np.random.seed(42)
    
    # Feature names
    features = [
        'particle_size_nm',
        'surface_area_m2g',
        'zeta_potential_mv',
        'ph',
        'concentration_mgl',
        'material_type',  # 0: Oxide, 1: Metal
        'crystallinity',  # 0-1 scale
        'porosity',       # 0-1 scale
        'hydrophobicity', # 0-1 scale
        'aspect_ratio'    # length/width ratio
    ]
    
    data = {}
    
    # Generate features with realistic distributions
    data['particle_size_nm'] = np.random.lognormal(mean=3.5, sigma=1, size=n_samples)  # 10-500nm typically
    data['surface_area_m2g'] = np.random.exponential(scale=80, size=n_samples) + 10    # 10-400 m²/g
    data['zeta_potential_mv'] = np.random.normal(loc=-20, scale=25, size=n_samples)     # -100 to +60 mV
    data['ph'] = np.random.normal(loc=7.2, scale=1.5, size=n_samples)                  # 4-11 pH
    data['concentration_mgl'] = np.random.lognormal(mean=3, sigma=1.5, size=n_samples) # 1-1000 mg/L
    data['material_type'] = np.random.binomial(1, 0.4, size=n_samples)                 # 40% metals
    data['crystallinity'] = np.random.beta(2, 2, size=n_samples)                       # 0-1
    data['porosity'] = np.random.beta(1.5, 3, size=n_samples)                          # 0-1 skewed low
    data['hydrophobicity'] = np.random.beta(2, 3, size=n_samples)                      # 0-1 skewed low
    data['aspect_ratio'] = np.random.gamma(2, 2, size=n_samples) + 1                   # 1-20 typically
    
    # Clip values to realistic ranges
    data['particle_size_nm'] = np.clip(data['particle_size_nm'], 1, 500)
    data['surface_area_m2g'] = np.clip(data['surface_area_m2g'], 5, 400)
    data['zeta_potential_mv'] = np.clip(data['zeta_potential_mv'], -100, 60)
    data['ph'] = np.clip(data['ph'], 3, 12)
    data['concentration_mgl'] = np.clip(data['concentration_mgl'], 0.1, 1000)
    data['aspect_ratio'] = np.clip(data['aspect_ratio'], 1, 20)
    
    # Create DataFrame
    df = pd.DataFrame(data)
    
    # Generate toxicity labels based on realistic toxicity principles
    toxicity_score = (
        # Smaller particles are more toxic
        (1 / (df['particle_size_nm'] / 50)) * 0.3 +
        # Higher surface area increases toxicity
        (df['surface_area_m2g'] / 200) * 0.2 +
        # Higher concentration increases toxicity
        (np.log(df['concentration_mgl']) / 5) * 0.25 +
        # Metals are generally more toxic than oxides
        df['material_type'] * 0.15 +
        # High aspect ratio (nanowires) can be more toxic
        (df['aspect_ratio'] / 10) * 0.1 +
        # Random component
        np.random.normal(0, 0.3, size=n_samples)
    )
    
    # Convert to binary classification (toxic if score > threshold)
    threshold = np.percentile(toxicity_score, 65)  # ~35% toxic samples
    df['toxicity'] = (toxicity_score > threshold).astype(int)
    
    return df

def create_and_train_model():
    """Create, train and save the neural network model"""
    print("🔬 Generating synthetic nanotoxicology dataset...")
    df = generate_synthetic_nanotox_dataset(n_samples=2000)
    
    print("📊 Dataset Info:")
    print(f"  - Total samples: {len(df)}")
    print(f"  - Toxic samples: {df['toxicity'].sum()} ({df['toxicity'].mean()*100:.1f}%)")
    print(f"  - Non-toxic samples: {(1-df['toxicity']).sum()} ({(1-df['toxicity']).mean()*100:.1f}%)")
    
    # Prepare features and target
    X = df.drop('toxicity', axis=1)
    y = df['toxicity']
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    
    # Scale the features
    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)
    
    print("\n🧠 Building neural network model...")
    
    # Create the neural network model
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(128, activation='relu', input_shape=(X_train.shape[1],)),
        tf.keras.layers.Dropout(0.3),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dropout(0.2),
        tf.keras.layers.Dense(32, activation='relu'),
        tf.keras.layers.Dropout(0.1),
        tf.keras.layers.Dense(1, activation='sigmoid')
    ])
    
    # Compile the model
    model.compile(
        optimizer='adam',
        loss='binary_crossentropy',
        metrics=['accuracy', 'precision', 'recall']
    )
    
    print("📈 Training model...")
    
    # Train the model
    history = model.fit(
        X_train_scaled, y_train,
        epochs=100,
        batch_size=32,
        validation_split=0.2,
        verbose=1,
        callbacks=[
            tf.keras.callbacks.EarlyStopping(patience=10, restore_best_weights=True),
            tf.keras.callbacks.ReduceLROnPlateau(factor=0.5, patience=5)
        ]
    )
    
    # Evaluate the model
    print("\n📊 Evaluating model...")
    y_pred_prob = model.predict(X_test_scaled)
    y_pred = (y_pred_prob > 0.5).astype(int)
    
    accuracy = accuracy_score(y_test, y_pred)
    print(f"Test Accuracy: {accuracy:.4f}")
    print("\nClassification Report:")
    print(classification_report(y_test, y_pred))
    
    # Save the model and scaler
    print("\n💾 Saving model and scaler...")
    model.save('nanomaterial_toxicity_model.h5')
    
    with open('feature_scaler.pkl', 'wb') as f:
        pickle.dump(scaler, f)
    
    # Save feature names
    feature_names = list(X.columns)
    with open('feature_names.pkl', 'wb') as f:
        pickle.dump(feature_names, f)
    
    print("✅ Model training completed!")
    print("📁 Files saved:")
    print("  - nanomaterial_toxicity_model.h5")
    print("  - feature_scaler.pkl")
    print("  - feature_names.pkl")
    
    return model, scaler, feature_names, history

if __name__ == "__main__":
    model, scaler, feature_names, history = create_and_train_model()
