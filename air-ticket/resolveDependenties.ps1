npm install;

Push-Location -Path air-ticket-client-angular;
npm install;

Pop-Location;
Push-Location -Path air-ticket-server;
npm install;

Pop-Location;
grunt;