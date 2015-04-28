import TicketsStore = require("./TicketsStore");
import AirTicketServerInterface = require("./custom_modules/air-ticket-server-interface/AirTicketServerInterface");

module TicketQueryMapper{
	export function map(query: AirTicketServerInterface.TicketQuery): TicketsStore.TicketQuery {
		return new TicketsStore.TicketQuery();
	}
}

export = TicketQueryMapper;