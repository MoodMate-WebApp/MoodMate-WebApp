# Use the official Python 3.11 image
FROM python:3.11-slim

# Set the working directory in the container
WORKDIR /code

# Install system dependencies (needed for some ML libraries)
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy the requirements file into the container
COPY ./requirements.txt /code/requirements.txt

# Install the Python dependencies
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt

# Copy the entire backend directory into the container
COPY . /code

# Set environment variables (Supabase, etc. will be set in HF Space settings)
ENV PYTHONUNBUFFERED=1

# Expose the port Hugging Face Spaces expects
EXPOSE 7860

# Start the FastAPI server using uvicorn
# We use port 7860 because that is the default for HF Spaces
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "7860"]
