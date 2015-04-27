module Db {
	export enum SortDirection { Asc, Desc };

	export class SortSetting {
		public fieldName: string;
		public sortDirection: SortDirection;
	}

	export class PageSetting {
		public pageSize: number;
		public pageNumber: number;

		constructor(pageSize, pageNumber) {
			this.pageSize = pageSize;
			this.pageNumber = pageNumber;
		}
	}

	export class TicketQuery {
		public id: string;
		public sortSettings: Array<SortSetting>;
		public pageSetting: PageSetting;
		public fieldNames: Array<string>;
	}

	export interface ITicketsDb {
		getTickets(ticketQuery: TicketQuery);
	}

	export class MongoTicketsDb implements ITicketsDb {
		getTickets(ticketQuery: TicketQuery) {
			return [
				{
					id: 1
				},
				{
					id: 2
				},
				{
					id: 3
				}
			];
		}
	}
}