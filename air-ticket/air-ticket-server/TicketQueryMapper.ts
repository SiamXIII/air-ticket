/// <reference path="ticketDb.ts" />
/// <reference path="custom_modules/air-ticket-server-interface/ticketQuery.ts" />


module TicketQueryMapper{
	export function map(query: AirTicketServerInterface.TicketQuery): Db.TicketQuery {
		return new Db.TicketQuery();
	}
}