@isTest
public with sharing class AvailableProductsControllerTest {
    static testMethod void avaialbleProducts() {
        Account a = new Account();
        a.Name = 'Test Account';
        insert a;
        List<Id> prodList = new List<Id>();
        Product2 p = new Product2();
        p.Name = ' Test Product ';
        p.Description='Test Product Entry For Product';
        p.productCode = 'SFDC-123';
        p.isActive = true;
        insert p;
        Product2 p1 = new Product2();
        p1.Name = ' Test Product ';
        p1.Description='Test Product Entry For Product';
        p1.productCode = 'SFDfC-123';
        p1.isActive = true;
        insert p1;
        prodList.add(p.id);
        Id pricebookId = Test.getStandardPricebookId();
    
        // Insert PricebookEntry
    
        PricebookEntry standardPrice = new PricebookEntry();
        standardPrice.Pricebook2Id = pricebookId;
        standardPrice.Product2Id = p.Id;
        standardPrice.UnitPrice = 1;
        standardPrice.IsActive = true;
        standardPrice.UseStandardPrice = false;
        insert standardPrice ;
        PricebookEntry standardPrice1 = new PricebookEntry();
        standardPrice1.Pricebook2Id = pricebookId;
        standardPrice1.Product2Id = p1.Id;
        standardPrice1.UnitPrice = 1;
        standardPrice1.IsActive = true;
        standardPrice1.UseStandardPrice = false;
        insert standardPrice1 ;
        
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
        
        AvailableProductsController.getProducts(o.id);
        
        AvailableProductsController.createOrderItems(prodList,o.id);
        
        Test.stopTest();
        
        
        }
}


