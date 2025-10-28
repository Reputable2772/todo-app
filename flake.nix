{
  description = "Next.js Development Shell";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.nodePackages.nodejs
            pkgs.pnpm
            pkgs.git
            pkgs.nixfmt-rfc-style
            pkgs.bruno
          ];
          shellHook = ''
            echo "Node: $(node --version), npm: $(npm --version)"
          '';
        };
        formatter = pkgs.nixfmt-rfc-style;
      }
    );
}
