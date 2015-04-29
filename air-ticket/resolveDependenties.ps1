npm install;

Push-Location -Path air-ticket-client-angular;
bower install;

Pop-Location;
Push-Location -Path air-ticket-server;
npm install;

Pop-Location;
grunt;