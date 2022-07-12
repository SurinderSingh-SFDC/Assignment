public with sharing class OrderProducts {
    @AuraEnabled(cacheable=true)
    public static List<OrderItem> getOrderProducts(Id recordId) {   
    list<OrderItem> listPBE=[Select id,Status_Fx__c,Product2Id ,TotalPrice,Product_Name__c,Product2.Name,orderId,Quantity,UnitPrice FROM OrderItem WHERE orderId =: recordId];
    return listPBE;     
    }

    @AuraEnabled
    public static void updateOrderItems(Id orderId){
        list<OrderItem> oitListToUpdate= new List<OrderItem>(); 
      list<OrderItem> orderItems= [Select id,Status__c FROM OrderItem WHERE orderId =: orderId]; 
      for(OrderItem oit:orderItems){
           oit.Status__c='Activated';
           oitListToUpdate.add(oit);
      } 
      if(!oitListToUpdate.isEmpty())  {
        update oitListToUpdate;
      }
    }

    @AuraEnabled
    public static void deleteSelectedProducts(List<OrderItem> recordsIds){   
        if(!recordsIds.isEmpty()){
              Delete recordsIds;
        } 
    }

   
    
}
