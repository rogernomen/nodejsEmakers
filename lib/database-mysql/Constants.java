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

	public enum DestinationTypes{
		UNASSIGNED(0),
		HOUSEHOLD(1),
		OFFICE(2),
		PREMISES(3);

		int value;

		public DestinationTypes(int value){
			this.value = value;
		}

		public int getValue(){
			return value;
		}
	};

	public enum ServiceTypes{
		UNASSIGNED(0),
		NEXT_DAY(1),
		SAME-DAY(2),
		RETURN(3),
		DIRECT(4),
		INTERNATIONAL(5),
		CORREO_POSTAL(6),
		CORREOS_EXPRESS(7);

		int value;

		public ServiceTypes(int value){
			this.value = value;
		}

		public int getValue(){
			return value;
		}
	};

	public enum DemandTypes{
		REGULAR(1),
		GROUPED(2),
		RETURN(3);

		int value;

		public DemandTypes(int value){
			this.value = value;
		}

		public int getValue(){
			return value;
		}
	};

	public enum StreetTypes{
		UNASSIGNED(0),
		CALLE(1),
		AVENIDA(2),
		PASEO(3),
		PLAZA(4),
		PASAJE(5);

		int value;

		public StreetTypes(int value){
			this.value = value;
		}

		public int getValue(){
			return value;
		}
	};

}
