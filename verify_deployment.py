#!/usr/bin/env python3
"""
Deployment verification script for Vercel
Tests the deployed API endpoints
"""

import requests
import json
import sys

def test_vercel_deployment(base_url):
    """Test the deployed API on Vercel"""
    print(f"🌐 Testing deployment at: {base_url}")
    print("=" * 60)
    
    # Test health endpoint
    try:
        print("1️⃣ Testing health endpoint...")
        response = requests.get(f"{base_url}/health", timeout=30)
        if response.status_code == 200:
            health_data = response.json()
            print(f"   ✅ Health check passed")
            print(f"   📊 Model loaded: {health_data.get('model_loaded', False)}")
            print(f"   📊 Scaler loaded: {health_data.get('scaler_loaded', False)}")
            print(f"   📊 Features loaded: {health_data.get('features_loaded', False)}")
        else:
            print(f"   ❌ Health check failed: {response.status_code}")
            print(f"   Response: {response.text}")
            return False
    except Exception as e:
        print(f"   ❌ Health check error: {e}")
        return False
    
    # Test features endpoint
    try:
        print("\n2️⃣ Testing features endpoint...")
        response = requests.get(f"{base_url}/features", timeout=30)
        if response.status_code == 200:
            print("   ✅ Features endpoint working")
        else:
            print(f"   ❌ Features endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"   ❌ Features endpoint error: {e}")
    
    # Test prediction endpoint
    try:
        print("\n3️⃣ Testing prediction endpoint...")
        test_data = {
            "particle_size_nm": 25.0,
            "surface_area_m2g": 150.0,
            "concentration_mgl": 100.0,
            "ph": 7.4,
            "temperature_c": 25.0,
            "zeta_potential_mv": -30.0,
            "material_type": 1,
            "exposure_time_h": 24.0,
            "aspect_ratio": 1.5
        }
        
        response = requests.post(f"{base_url}/predict", 
                               json=test_data, 
                               headers={'Content-Type': 'application/json'},
                               timeout=60)
        
        if response.status_code == 200:
            result = response.json()
            print("   ✅ Prediction endpoint working")
            print(f"   🎯 Prediction: {result.get('prediction_text', 'Unknown')}")
            print(f"   📈 Confidence: {result.get('confidence', 0)}%")
        else:
            print(f"   ❌ Prediction failed: {response.status_code}")
            print(f"   Response: {response.text}")
    except Exception as e:
        print(f"   ❌ Prediction error: {e}")
    
    print("\n✅ Deployment verification completed!")
    return True

if __name__ == "__main__":
    if len(sys.argv) > 1:
        url = sys.argv[1]
    else:
        url = input("Enter your Vercel deployment URL (e.g., https://your-app.vercel.app): ").strip()
    
    if not url.startswith('http'):
        url = f"https://{url}"
    
    test_vercel_deployment(url)
