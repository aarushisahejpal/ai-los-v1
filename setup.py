"""
Setup script for development environment
"""

import os
import sys
import subprocess

def check_python_version():
    """Check if Python version is 3.8 or higher"""
    if sys.version_info < (3, 8):
        print("❌ Python 3.8 or higher is required")
        print(f"Current version: {sys.version}")
        return False
    print(f"✅ Python version: {sys.version.split()[0]}")
    return True

def create_virtual_environment():
    """Create virtual environment if it doesn't exist"""
    if os.path.exists('venv'):
        print("✅ Virtual environment already exists")
        return True
    
    print("📦 Creating virtual environment...")
    try:
        subprocess.run([sys.executable, '-m', 'venv', 'venv'], check=True)
        print("✅ Virtual environment created")
        return True
    except subprocess.CalledProcessError:
        print("❌ Failed to create virtual environment")
        return False

def install_dependencies():
    """Install required packages"""
    print("📦 Installing dependencies...")
    
    # Determine pip path based on OS
    if sys.platform == "win32":
        pip_path = os.path.join('venv', 'Scripts', 'pip')
    else:
        pip_path = os.path.join('venv', 'bin', 'pip')
    
    try:
        subprocess.run([pip_path, 'install', '--upgrade', 'pip'], check=True)
        subprocess.run([pip_path, 'install', '-r', 'requirements.txt'], check=True)
        print("✅ Dependencies installed successfully")
        return True
    except subprocess.CalledProcessError:
        print("❌ Failed to install dependencies")
        return False

def setup_env_file():
    """Create .env file from .env.example if it doesn't exist"""
    if os.path.exists('.env'):
        print("✅ .env file already exists")
        return True
    
    if not os.path.exists('.env.example'):
        print("❌ .env.example file not found")
        return False
    
    print("📝 Creating .env file...")
    try:
        with open('.env.example', 'r') as example:
            with open('.env', 'w') as env:
                env.write(example.read())
        print("✅ .env file created")
        print("⚠️  Please edit .env and add your GEMINI_API_KEY")
        return True
    except Exception as e:
        print(f"❌ Failed to create .env file: {e}")
        return False

def create_directories():
    """Create necessary directories"""
    directories = ['uploads', 'static/css', 'static/js', 'templates']
    
    for directory in directories:
        if not os.path.exists(directory):
            os.makedirs(directory)
            print(f"✅ Created directory: {directory}")
        else:
            print(f"✅ Directory exists: {directory}")
    
    return True

def main():
    """Main setup function"""
    print("🚀 Starting setup for AI Learning Outcomes Generator...\n")
    
    steps = [
        ("Checking Python version", check_python_version),
        ("Creating directories", create_directories),
        ("Creating virtual environment", create_virtual_environment),
        ("Installing dependencies", install_dependencies),
        ("Setting up environment file", setup_env_file)
    ]
    
    for step_name, step_func in steps:
        print(f"\n{'='*60}")
        print(f"Step: {step_name}")
        print('='*60)
        
        if not step_func():
            print(f"\n❌ Setup failed at: {step_name}")
            print("Please fix the error and run setup again")
            return False
    
    print("\n" + "="*60)
    print("🎉 Setup completed successfully!")
    print("="*60)
    print("\nNext steps:")
    print("1. Edit .env file and add your GEMINI_API_KEY")
    print("2. Activate virtual environment:")
    print("   - macOS/Linux: source venv/bin/activate")
    print("   - Windows: venv\\Scripts\\activate")
    print("3. Run the application: python app.py")
    print("4. Open browser to: http://localhost:5000")
    print("\n")
    
    return True

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)
