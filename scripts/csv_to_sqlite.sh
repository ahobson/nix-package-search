#!/usr/bin/env bash

set -x

if [[ -z "$1" || -z "$2" ]]; then
    echo "Usage: $0 csv_path sqlite_path"
    exit 2
fi

csv_path="$1"
sqlite_path="$2"

sqlite3 <<_EOF
CREATE TABLE packages(
  "pname" TEXT NOT NULL,
  "nix_package_name" TEXT NOT NULL,
  "name" TEXT NUL NULL,
  "version" TEXT NOT NULL,
  "sha" TEXT NOT NULL);
CREATE INDEX packages_name_idx ON packages (name COLLATE NOCASE);
CREATE INDEX packages_nix_package_name_idx ON packages (nix_package_name COLLATE NOCASE);
pragma journal_mode = delete;
pragma page_size = 4096;

.mode csv
.import ${csv_path} packages
VACUUM;
.save ${sqlite_path}
_EOF
