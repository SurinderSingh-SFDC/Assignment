public with sharing class AvailableProductsController {   
     
    @AuraEnabled(cacheable=true)
     public static List<PricebookEntry> getProducts(Id recordId) {
      system.debug('orderId '+recordId);
     Id priceBookId = [Select id,Price_Book__c FROM Order WHERE id=:recordId].Price_Book__c;
     system.debug('priceBookId '+priceBookId);
     list<PricebookEntry> listPBE=[SELECT Id, Name, UnitPrice FROM PricebookEntry WHERE Pricebook2Id=:priceBookId];
     
     return listPBE;     
     }

     @AuraEnabled
     public static List<OrderItem> createOrderItems(List<Id> productIds,Id orderId){
      system.debug('PBIds '+productIds);
      List<OrderItem> oiList = new List<OrderItem>();
      List<OrderItem> oiListUpdate = new List<OrderItem>();
      List<OrderItem> finaloiListUpdate = new List<OrderItem>();
      Set<Id> prodInOrdr= new Set<Id>();
      Set<Id> exisitingOi = new Set<Id>();
      for(OrderItem otm:[Select id,orderId,UnitPrice,Product2Id FROM OrderItem WHERE orderId=: orderId ]){
        prodInOrdr.add(otm.Product2Id);
      }
       For(PricebookEntry pb:[SELECT Id, Name,Product2Id, UnitPrice FROM PricebookEntry WHERE id IN:productIds]){
      if(!prodInOrdr.contains(pb.Product2Id)){
        OrderItem oi= new OrderItem();
        oi.orderId=orderId;
        oi.UnitPrice=pb.UnitPrice;
        oi.Product2Id=pb.Product2Id;
        oi.PricebookEntryId=pb.id;      
         oi.Quantity=1;        
         oiList.add(oi);
      }else{
        exisitingOi.add(pb.Product2Id);
        
      }

    }
       insert oiList;

       for(OrderItem otm1:[Select id,orderId,Quantity,UnitPrice,Product2Id FROM OrderItem WHERE Product2Id IN: exisitingOi ]){
          otm1.Quantity = otm1.Quantity +1;
          oiListUpdate.add(otm1);
      }

      update oiListUpdate;
      finaloiListUpdate=[Select id,quantity,TotalPrice,Product_Name__c,orderId,UnitPrice,Product2Id FROM OrderItem WHERE orderId=: orderId ];      
      
      return finaloiListUpdate;

     }
   }