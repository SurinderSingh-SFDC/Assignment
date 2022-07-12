public class activateOrderWrapper{

	public String accountNumber;
	public String orderNumber;
	public String type;
	public String status;
	public List<OrderProducts> orderProducts;

	public class OrderProducts {
		public String name;
		public String code;
		public Double unitPrice;
		public Integer quantity;
	}

	
	//public static JSON2Apex parse(String json) {
		//return (JSON2Apex) System.JSON.deserialize(json, JSON2Apex.class);
	//}
}
