import { LightningElement, wire,api,track} from 'lwc';	
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import getProducts from '@salesforce/apex/AvailableProductsController.getProducts';
import createOrderItems from '@salesforce/apex/AvailableProductsController.createOrderItems';
import { getRecord, getFieldValue } from "lightning/uiRecordApi";
import ORDER_STATUS from "@salesforce/schema/Order.Status";
import {  APPLICATION_SCOPE,publish,MessageContext } from 'lightning/messageService';
import SAMPLEMC from "@salesforce/messageChannel/orderProductsMessageChannel__c"; 


const fields = [ORDER_STATUS];
export default class GetDataDisplayData extends LightningElement {
    @api recordId;
    @api productsColumns;
    @api records;
    @track lstSelectedRecords;
    @track isLoading=false;
    @track data;
    @track sortBy;
    @track sortDirection;
    @api status='';
    @api orderitems;
   
    productsColumns = [
        { label: 'Product Name', fieldName: 'Name',sortable: "true" },
        { label: 'List Price', fieldName: 'UnitPrice',sortable: "true" }
        
      
    ];

    @wire(getRecord, {
        recordId:"$recordId",
        fields
      })
      order;
    
    get status() {
       // this.status = this.wiredOrder.data.fields.status.value;// getFieldValue(this.wiredOrder.data, ORDER_STATUS);
       this.status = getFieldValue(this.order.data, ORDER_STATUS);
       return getFieldValue(this.order.data, ORDER_STATUS);
    }
    
    @wire(getProducts, {
        recordId: '$recordId' })
        wireRecordList({data,error}){
            if(data){
                this.records = data;
                this.error = undefined;               
                
                }else{
                this.error = error;
                this.data=undefined;
                }
            }

            @wire(MessageContext)
               messageContext;

addSelectedProducts(){        
        if(this.status=='Activated'){
            const event = new ShowToastEvent({
                title: '',
                message: 'Product can not be added on Activated Order!',
                variant: 'Error',
                mode: 'dismissable'
            });
            this.dispatchEvent(event); 
            this.template.querySelector('lightning-datatable').selectedRows=[];
            return ;
        }
        this.isLoading=true;
        var el = this.template.querySelector("lightning-datatable");
        var selected = el.getSelectedRows();       
        let selectedIdsArray = [];
        for (const element of selected) {            
            selectedIdsArray.push(element.Id);
        }          
        createOrderItems({  productIds:selectedIdsArray,
                               orderId:this.recordId })
                .then((result) => { 
                    this.orderitems=result;                    
                    this.template.querySelector('lightning-datatable').selectedRows=[];                   
                   this.isLoading=false; 
                  const message = {
                orderItems:  this.orderitems                     
                }; 
                
                publish(this.messageContext, SAMPLEMC, message);                                      
                    this.showToast('Success', 'Product is added to the Order successfully!', 'Success', 'dismissable'); 
                                    
                })
                .catch((error) => {
                    this.error = error;                    
                    this.showToast('Error', result, 'Success', 'dismissable');
                }) 
                
    }
    handleSortOrderData(event) {       
        this.sortBy = event.detail.fieldName;       
        this.sortDirection = event.detail.sortDirection;       
        this.sortAccountData(event.detail.fieldName, event.detail.sortDirection);
    }
    sortAccountData(fieldname, direction) {        
        let parseData = JSON.parse(JSON.stringify(this.records));       
        let keyValue = (a) => {
            return a[fieldname];
        };
       let isReverse = direction === 'asc' ? 1: -1;
           parseData.sort((x, y) => {
            x = keyValue(x) ? keyValue(x) : ''; 
            y = keyValue(y) ? keyValue(y) : '';           
            return isReverse * ((x > y) - (y > x));
        });        
        this.records = parseData;
    }
    showToast(title, message, variant, mode) {
        const event = new ShowToastEvent({
            title: title,
            message: message,
            variant: variant,
            mode: mode
        });
        this.dispatchEvent(event);
    }            
}
