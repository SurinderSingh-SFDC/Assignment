@isTest
public with sharing class OrderProductsTest {
    static testMethod void orderProducts() {
        Account a = new Account();
        a.Name = 'Test Account';
        insert a;

        Product2 p = new Product2();
        p.Name = ' Test Product ';
        p.Description='Test Product Entry For Product';
        p.productCode = 'SFDCPanther-123';
        p.isActive = true;
        insert p;
        Id pricebookId = Test.getStandardPricebookId();
    
        // Insert PricebookEntry
    
        PricebookEntry standardPrice = new PricebookEntry();
        standardPrice.Pricebook2Id = pricebookId;
        standardPrice.Product2Id = p.Id;
        standardPrice.UnitPrice = 1;
        standardPrice.IsActive = true;
        standardPrice.UseStandardPrice = false;
        insert standardPrice ;
        
        // Insert Order
        
        Order o = new Order();
        o.Name = 'Test Order ';
        o.Status = 'Draft';
        o.EffectiveDate = system.today();
        o.EndDate = system.today() + 4;
        o.AccountId = a.id;
        o.Pricebook2Id =  pricebookId ;
        
        insert o;
        OrderItem obj = new OrderItem( Product2Id=p.id,orderId=o.id,Quantity=5,UnitPrice=100,PricebookEntryId=standardPrice.id);
        insert obj;
        
        Test.startTest();
        
        OrderProducts.getOrderProducts(o.id);
        OrderProducts.updateOrderItems(o.id);
        
        Test.stopTest();
        
        
        }
}

