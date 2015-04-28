module AirTicketServerInterface {
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

		public ToUrlQuery(): string {
			return "";
		}

		public static ParseFromUrlQueryString(urlQueryString): TicketQuery {
			return new TicketQuery();
		}
	}
}