#!/bin/bash
cd /home/kavia/workspace/code-generation/kollywood-quizmaster-37557-7d74b15a/kollywood_quizmaster
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

