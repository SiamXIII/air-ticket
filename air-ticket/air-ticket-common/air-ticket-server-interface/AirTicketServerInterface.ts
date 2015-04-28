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

		public toUrlQueryArg(): string {
			return encodeURIComponent(JSON.stringify(this));
		}

		public static parseFromUrlQueryArg(urlQueryString): TicketQuery {
			return JSON.parse(decodeURI(urlQueryString));
		}
	}
}

export = AirTicketServerInterface;