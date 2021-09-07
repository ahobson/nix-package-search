# to install
# nix-env -p /nix/var/nix/profiles/zoom-webhook -f nix -i
#
# use
#
# https://lazamar.co.uk/nix-versions/
# to find rev for specific package version

let
  pkgs = import <nixpkgs> {};
  inherit (pkgs) buildEnv;
in buildEnv {
  name = "nix-package-search-packages";
  paths = [

    (import (builtins.fetchGit {
      # Descriptive name to make the store path easier to identify
      name = "nodejs-14.17.1";
      url = "https://github.com/NixOS/nixpkgs/";
      ref = "refs/heads/nixpkgs-unstable";
      rev = "75916fb375eb571dceebef84263a6cb942372769";
    }) {}).nodejs-14_x

    (import (builtins.fetchGit {
      # Descriptive name to make the store path easier to identify
      name = "yarn-1.22.11";
      url = "https://github.com/NixOS/nixpkgs/";
      ref = "refs/heads/nixpkgs-unstable";
      rev = "319556224cdf20bef78a7395de9fcc5ff06d2d79";
    }) {}).yarn

    (import (builtins.fetchGit {
      # Descriptive name to make the store path easier to identify
      name = "pre-commit-2.13.0";
      url = "https://github.com/NixOS/nixpkgs/";
      ref = "refs/heads/nixpkgs-unstable";
      rev = "f62847d5655a6954fc946e5d9c81424171cc281e";
    }) {}).pre-commit

  ];
}
