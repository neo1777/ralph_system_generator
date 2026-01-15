# Google Antigravity / Project IDX Configuration
{ pkgs, ... }: {
  channel = "stable-23.11"; 
  
  packages = [
    pkgs.jq
    pkgs.google-cloud-sdk
    pkgs.python3
    
  ];
  
  env = {
    RALPH_PROJECT = "Test_ralph_test_antigravity";
  };
  
  idx = {
    extensions = [];
    workspace = {
      onCreate = {
        init-ralph = "chmod +x run_ralph.sh";
      };
    };
  };
}