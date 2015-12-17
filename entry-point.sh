#!/usr/bin/env bash

set -u
set -e

for f in /etc/secrets/* ; do
    if test -f "$f"; then
        export $(echo $(basename $f) | awk '{print toupper($0)}')="$(eval "echo \"`<$f`\"")"
    fi
done

cat <<- EOF > dist/config.json
{
  "backend": "${BACKEND:-http://localhost:8000}"
}
EOF

exec "$@"
