#!/bin/sh
# Morflow CLI dynamic installer bootstrap
# Always fetches and executes the latest installer from the GitHub main branch

set -e

INSTALLER_URL="https://raw.githubusercontent.com/JiraPit/Morflow/main/install.sh"

if command -v curl >/dev/null 2>&1; then
    exec curl -fsSL "$INSTALLER_URL" | bash -s -- "$@"
elif command -v wget >/dev/null 2>&1; then
    exec wget -qO- "$INSTALLER_URL" | bash -s -- "$@"
else
    echo "Error: Neither curl nor wget was found on your system. Please install curl or wget." >&2
    exit 1
fi
