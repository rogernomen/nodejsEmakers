public class Constants{

	public enum RouteStatus{
		UNASSIGNED(1),
		ROUTE_TO_BE_DEFINED(2),
		READY(3),
		IN_COURSE(4),
		FINISHED(5),
		WITH_INCIDENTS(6),
		PERMANENT(7);

		int value;

		public RouteStatus(int value){
			this.value = value;
		}

		public int getValue(){
			return value;
		}
	};

	public enum ParcelStatus{
		UNASSIGNED(0),
		IN_DESTINATION_WAREHOUSE(1),
		WITH_INCIDENTS(2),
		DELIVERED(3),
		ABSENT_OR_CLOSED(4),
		WRONG_ADRESS(5),
		INCOMPLETE_ADRESS(6),
		TO_BE_COLLECTED(7),
		COLLECTED(8),
		IN_WAREHOUSE_PICK_UP(9),
		ON_ROUTE(10),
		FAILED_CASH_ON_DELIVERY(11),
		TO_RETURN_TO_SENDER(13),
		DELIVERY_POSTPONED_BY_CUSTOMER(14),
		RETURNED_TO_SENDER(15),
		ORIGIN_NOT_READY(16),
		IN_ORIGIN_WAREHOUSE(17),
		DEFINITELY_LOST(18),
		IN_TRANSIT(19),
		UNBOUND(20);

		int value;

		public ParcelStatus(int value){
			this.value = value;
		}

		public int getValue(){
			return value;
		}
	};

}
