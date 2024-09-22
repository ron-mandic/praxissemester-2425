function init() {
    python -m venv .venv
}

function install() {
    if [ -f requirements.txt ]; then
        # Install local packages
        .venv/Scripts/pip install -r requirements.txt
        # https://pytorch.org/get-started/locally/
        .venv/Scripts/pip3 install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu118
    else 
        echo "Error: requirements.txt not found"
    fi
}

function start() {
    if [ -f main.py ]; then
        .venv/Scripts/uvicorn main:app --reload
    else
        echo "Error: main.py not found"
    fi
}