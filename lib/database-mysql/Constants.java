public class Constants{

	public class RouteStatus{
		public static final int UNASSIGNED = 1;
		public static final int ROUTE_TO_BE_DEFINED = 2;
		public static final int READY = 3;
		public static final int IN_COURSE = 4;
		public static final int FINISHED = 5;
		public static final int WITH_INCIDENTS = 6;
		public static final int PERMANENT = 7;
	}

	public class ParcelStatus{
		public static final int UNASSIGNED = 0;
		public static final int IN_DESTINATION_WAREHOUSE = 1;
		public static final int WITH_INCIDENTS = 2;
		public static final int DELIVERED = 3;
		public static final int ABSENT_OR_CLOSED = 4;
		public static final int WRONG_ADRESS = 5;
		public static final int INCOMPLETE_ADRESS = 6;
		public static final int TO_BE_COLLECTED = 7;
		public static final int COLLECTED = 8;
		public static final int IN_WAREHOUSE_PICK_UP = 9;
		public static final int ON_ROUTE = 10;
		public static final int FAILED_CASH_ON_DELIVERY = 11;
		public static final int TO_RETURN_TO_SENDER = 13;
		public static final int DELIVERY_POSTPONED_BY_CUSTOMER = 14;
		public static final int RETURNED_TO_SENDER = 15;
		public static final int ORIGIN_NOT_READY = 16;
		public static final int IN_ORIGIN_WAREHOUSE = 17;
		public static final int DEFINITELY_LOST = 18;
		public static final int IN_TRANSIT = 19;
		public static final int UNBOUND = 20;
	}

	public class DestinationTypes{
		public static final int UNASSIGNED = 0;
		public static final int HOUSEHOLD = 1;
		public static final int OFFICE = 2;
		public static final int PREMISES = 3;
	}

	public class ServiceTypes{
		public static final int UNASSIGNED = 0;
		public static final int NEXT_DAY = 1;
		public static final int SAME-DAY = 2;
		public static final int RETURN = 3;
		public static final int DIRECT = 4;
		public static final int INTERNATIONAL = 5;
		public static final int CORREO_POSTAL = 6;
		public static final int CORREOS_EXPRESS = 7;
	}

	public class DemandTypes{
		public static final int REGULAR = 1;
		public static final int GROUPED = 2;
		public static final int RETURN = 3;
	}

	public class StreetTypes{
		public static final int UNASSIGNED = 0;
		public static final int CALLE = 1;
		public static final int AVENIDA = 2;
		public static final int PASEO = 3;
		public static final int PLAZA = 4;
		public static final int PASAJE = 5;
	}

}
