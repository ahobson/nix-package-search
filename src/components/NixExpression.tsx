import { IPackage } from './../config/DBConfig'

function formatRow(row: IPackage): string {
  return `
    (import (builtins.fetchGit {
      # Descriptive name to make the store path easier to identify
      name = "${row.name}";
      url = "https://github.com/NixOS/nixpkgs/";
      ref = "refs/heads/nixpkgs-unstable";
      rev = "${row.sha}";
    }) {}).${row.nixPackageName}
  `
}

export function NixExpression({ row }: { row: IPackage }) {
  return <pre>{formatRow(row)}</pre>
}
