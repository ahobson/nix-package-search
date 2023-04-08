# Use https://ahobson.github.io/nix-package-search/#/search to find
# pinned versions

let
  pkgs = import <nixpkgs> {};
  inherit (pkgs) buildEnv;
in buildEnv {
  name = "nix-package-search-packages";
  paths = [

    (import
      (builtins.fetchGit {
        # Descriptive name to make the store path easier to identify
        name = "nodejs-18.13.0";
        url = "https://github.com/NixOS/nixpkgs/";
        ref = "refs/heads/nixpkgs-unstable";
        rev = "2d38b664b4400335086a713a0036aafaa002c003";
      })
      { }).nodejs-18_x

    (import (builtins.fetchGit {
      # Descriptive name to make the store path easier to identify
      name = "yarn-1.22.19";
      url = "https://github.com/NixOS/nixpkgs/";
      ref = "refs/heads/nixpkgs-unstable";
      rev = "d218e35480c7ea6cbb50ea68e6b1d88f5d2dc451";
    }) {}).yarn

    (import (builtins.fetchGit {
      # Descriptive name to make the store path easier to identify
      name = "pre-commit-2.13.0";
      url = "https://github.com/NixOS/nixpkgs/";
      ref = "refs/heads/nixpkgs-unstable";
      rev = "f62847d5655a6954fc946e5d9c81424171cc281e";
    }) {}).pre-commit

    (import (builtins.fetchGit {
      # Descriptive name to make the store path easier to identify
      name = "sqlite-3.35.5";
      url = "https://github.com/NixOS/nixpkgs/";
      ref = "refs/heads/nixpkgs-unstable";
      rev = "572c9219ad1f4ecffa2ff0459f2e0b1355c78dc5";
    }) {}).sqlite
  ];
}
