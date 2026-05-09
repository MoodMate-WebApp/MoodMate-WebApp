#!/usr/bin/env python3
"""
MoodMate Backend Health Check
Run this script to verify the backend setup is correct.
"""

import sys
import os

def check_python_version():
    """Check if Python version is 3.11+"""
    if sys.version_info < (3, 11):
        print("❌ Python 3.11+ required")
        return False
    print(f"✅ Python {sys.version_info.major}.{sys.version_info.minor}.{sys.version_info.micro}")
    return True

def check_imports():
    """Check if all required packages are importable"""
    required_packages = [
        'fastapi',
        'uvicorn',
        'pydantic',
        'transformers',
        'torch',
    ]
    
    all_ok = True
    for package in required_packages:
        try:
            __import__(package)
            print(f"✅ {package}")
        except ImportError:
            print(f"❌ {package} - missing, run: pip install -r requirements.txt")
            all_ok = False
    return all_ok

def check_models():
    """Check if model files exist"""
    model_dir = os.path.join(os.path.dirname(__file__), 'app', 'ai', 'models')
    required_files = [
        'config.json',
        'model.safetensors',
        'tokenizer.json',
        'special_tokens_map.json',
        'tokenizer_config.json',
    ]
    
    all_ok = True
    for file in required_files:
        file_path = os.path.join(model_dir, file)
        if os.path.exists(file_path):
            size = os.path.getsize(file_path)
            print(f"✅ {file} ({size:,} bytes)")
        else:
            print(f"❌ {file} - missing")
            all_ok = False
    
    return all_ok

def main():
    print("\n🔍 MoodMate Backend Health Check\n")
    
    checks = [
        ("Python Version", check_python_version),
        ("Required Packages", check_imports),
        ("Model Files", check_models),
    ]
    
    results = []
    for check_name, check_func in checks:
        print(f"\n📋 Checking {check_name}...")
        result = check_func()
        results.append(result)
    
    print("\n" + "="*50)
    if all(results):
        print("✅ All checks passed! Ready to start backend.")
        print("\nStart the server with:")
        print("  python -m uvicorn app.main:app --reload")
        return 0
    else:
        print("❌ Some checks failed. Fix the issues above.")
        return 1

if __name__ == "__main__":
    sys.exit(main())
