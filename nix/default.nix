# Use https://ahobson.github.io/nix-package-search/#/search to find
# pinned versions

let
  pkgs = import <nixpkgs> {};
  inherit (pkgs) buildEnv;
in buildEnv {
  name = "nix-package-search-packages";
  paths = [

    (import (builtins.fetchGit {
      # Descriptive name to make the store path easier to identify
      name = "nodejs-20.9.0";
      url = "https://github.com/NixOS/nixpkgs/";
      ref = "refs/heads/nixpkgs-unstable";
      rev = "2699484d57ff42254c88197d4d4ac68c06d61df6";
    }) {}).nodejs_20

    (import (builtins.fetchGit {
      # Descriptive name to make the store path easier to identify
      name = "sqlite-3.35.5";
      url = "https://github.com/NixOS/nixpkgs/";
      ref = "refs/heads/nixpkgs-unstable";
      rev = "572c9219ad1f4ecffa2ff0459f2e0b1355c78dc5";
    }) {}).sqlite
  ];
}
