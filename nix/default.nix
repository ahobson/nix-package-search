# Use https://ahobson.github.io/nix-package-search
# pinned versions

let
  pkgs = import <nixpkgs> {};
  inherit (pkgs) buildEnv;
in buildEnv {
  name = "nix-package-search-packages";
  paths = [

    (import (builtins.fetchGit {
      # Descriptive name to make the store path easier to identify
      name = "nodejs-20.19.5";
      url = "https://github.com/NixOS/nixpkgs/";
      ref = "refs/heads/nixpkgs-unstable";
      rev = "8ec68fd78a40d98a57bd20957169e6f9108d624f";
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
