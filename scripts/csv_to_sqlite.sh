#!/usr/bin/env bash

sqlite3 <<_EOF
CREATE TABLE packages(
  "pname" TEXT NOT NULL,
  "nix_package_name" TEXT NOT NULL,
  "name" TEXT NUL NULL,
  "version" TEXT NOT NULL,
  "sha" TEXT NOT NULL);
CREATE INDEX packages_name_idx ON packages (name COLLATE NOCASE);
.mode csv
.import public/nix/nixpkgs-unstable/all_packages.csv packages
.save public/nix/nixpkgs-unstable/all_packages.sqlite3
_EOF
