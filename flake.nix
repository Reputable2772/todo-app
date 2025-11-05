{
  description = "Next.js Development Shell with MySQL server";

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
            pkgs.mysql80
            pkgs.mysql-client
          ];

          shellHook = ''
            mkdir -p /tmp/mysql_server
            source .env

            echo "Node: $(node --version), npm: $(npm --version)"
            echo "MySQL: $(mysql --version)"
          '';
        };
        formatter = pkgs.nixfmt-rfc-style;
      }
    );
}
