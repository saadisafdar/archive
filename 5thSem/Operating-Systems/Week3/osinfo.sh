#!/bin/bash
echo "Username: $(whoami)"
echo "Date: $(date)"
echo "Kernel Version: $(uname -r)"

if [ -f "hello.trace" ]; then
    echo "Lines in hello.trace: $(wc -l < hello.trace)"
else
    echo "hello.trace not found. Generating hello.trace..."
    strace -o hello.trace ./hello
    echo "Lines in hello.trace: $(wc -l < hello.trace)"
fi
