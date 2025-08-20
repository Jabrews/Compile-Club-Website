
echo "Building React frontend..."
cd Frontend_Compile_Club
npm install
npm run build

echo "Setting up Python virtual environment..."
cd /app
rm -rf .venv
python -m venv .venv
source .venv/bin/activate

echo "Installing Python dependencies..."
pip install --upgrade pip setuptools wheel
pip install -r requirements.txt

echo " Starting Gunicorn server..."
gunicorn --chdir Backend_Compile_Club Backend_Compile_Club.wsgi:application --bind 0.0.0.0:$PORT
