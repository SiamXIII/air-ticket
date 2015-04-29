npm install;

Push-Location -Path air-ticket-client-angular;
npm install;
tsd reinstall -os;

Pop-Location;
Push-Location -Path air-ticket-server;
npm install;
tsd reinstall -os;

Pop-Location;
grunt;