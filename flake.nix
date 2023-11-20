{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.05";
    flake-utils.url = "github:numtide/flake-utils";
  };
  outputs = { self, nixpkgs, flake-utils, fedimint }:
    flake-utils.lib.eachDefaultSystem (system:
      let pkgs = import nixpkgs { inherit system; };
      in {
        devShells = fmLib.devShells // {
          default = fmLib.devShells.default.overrideAttrs (prev: {
            nativeBuildInputs = [ pkgs.nodejs ] ++ prev.nativeBuildInputs;
            shellHook = ''
              npm install
            '';
          });
        };
      });
}
