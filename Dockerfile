FROM node:18 AS frontend

WORKDIR /app/frontend
COPY Frontend_Compile_Club/package*.json ./
RUN npm install
COPY Frontend_Compile_Club .
RUN npm run build

FROM python:3.11-slim

WORKDIR /app

# Install Django & backend deps
COPY requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

# Copy backend
COPY Backend_Compile_Club ./Backend_Compile_Club

# Copy built frontend from stage 1
COPY --from=frontend /app/frontend/dist ./Frontend_Compile_Club/dist

# Start the Django server with Gunicorn
CMD ["gunicorn", "--chdir", "Backend_Compile_Club", "Backend_Compile_Club.wsgi:application", "--bind", "0.0.0.0:8080"]
