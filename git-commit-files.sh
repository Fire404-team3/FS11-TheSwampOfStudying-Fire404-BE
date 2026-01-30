#!/bin/bash

# 커밋 메시지 확인
if [ -z "$1" ]; then
  echo "Usage: ./git-commit-files.sh \"커밋 메시지\""
  exit 1
fi

COMMIT_MSG="$1"

# 파일 목록을 읽어서 add
echo "✅ 선택된 파일 add 중..."
while IFS= read -r file; do
  git add "$file"
done < files.txt

# commit
echo "✅ commit 메시지: $COMMIT_MSG"
git commit -m "$COMMIT_MSG"

# push
echo "✅ push 진행 중..."
git push

echo "✅ 완료!"
git status