# Requirements
# a. pyenv and virtualenv (https://github.com/pyenv/pyenv-virtualenv?tab=readme-ov-file#installing-as-a-pyenv-plugin and further)
# b. pyenv local 3.12.6 (for example)
# c. Ensure that the specified Python version exists

function pyenv_venv() {
    if [ $# -ne 2 ]; then
        echo "Usage: venv <VERSION> <ENVIRONMENT_NAME>"
        return 1
    fi
    
    VERSION=$1
    ENVIRONMENT_NAME=$2

    if ! pyenv versions | grep -q "$VERSION"; then
        pyenv install "$VERSION"
    fi

    pyenv virtualenv "$VERSION" "$ENVIRONMENT_NAME"
    pyenv activate "$ENVIRONMENT_NAME"

    ln -s "$(pyenv prefix "$ENVIRONMENT_NAME")" "$ENVIRONMENT_NAME"
}

function start() {
    if ! command -v uvicorn &> /dev/null; then
        echo "Error: uvicorn is not installed or not available in the current environment"
        return 1
    fi

    if [ -f main.py ]; then
        if [ -n "$1" ] && [ -n "$2" ]; then
            uvicorn main:app --reload --host "$1" --port "$2"
        elif [ -n "$1" ]; then
            uvicorn main:app --reload --host "$1" --port 8000
        else
            uvicorn main:app --reload
        fi
    else
        echo "Error: main.py not found"
        return 1
    fi
}
