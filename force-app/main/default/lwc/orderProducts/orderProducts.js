import { LightningElement, wire,api,track} from 'lwc';	
import getProducts from '@salesforce/apex/OrderProducts.getOrderProducts';
import deleteSelectedProducts from '@salesforce/apex/OrderProducts.deleteSelectedProducts';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import ORDER_OBJECT from "@salesforce/schema/Order";
import ID_FIELD from "@salesforce/schema/Order.Id";
import STATUS_FIELD from "@salesforce/schema/Order.Status";
import { updateRecord } from "lightning/uiRecordApi";
import { MessageContext, subscribe } from 'lightning/messageService';
import SAMPLEMC from "@salesforce/messageChannel/orderProductsMessageChannel__c";
import { refreshApex } from '@salesforce/apex'; 

export default class OrderDetails extends LightningElement {
    @api recordId;
    @api productsColumns;
    @api records;
    @track lstSelectedRecords;
    @track isLoading=false;
    @api messageReceived=null;
    @api noOfProducts=null;    
    // non-reactive variables
    @api selectedRecords = [];
    refreshTable;
    
    productsColumns = [
        { label: 'Product Name', fieldName: 'Product_Name__c' },
        { label: 'Unit Price', fieldName: 'UnitPrice' },
        { label: 'Quantity', fieldName: 'Quantity' },       
        { label: 'Total Price', fieldName: 'TotalPrice' }
      
    ];
    @wire(getProducts, {
        recordId: '$recordId' })
        wireRecordList(result){      
            if(result.data){
                this.refreshTable =result;
                this.records = result.data;
                this.noOfProducts=result.data.length; 
            }else if (result.error) { 
                this.error = error;
                this.data=undefined;
             }
          }


        handleClick() { 
            this.isLoading=true;               
              const fields = {};          
              fields[ID_FIELD.fieldApiName] = this.recordId;
              fields[STATUS_FIELD.fieldApiName] = 'Activated';             
              const recordInput = {
                fields: fields
              };

             updateRecord(recordInput).then((record) => { 
                this.isLoading=false; 
                this.updateRecordView();              
                this.showToast('Success', 'Order is Activated successfully!', 'Success', 'dismissable');                   
              }).catch(error => {
                this.showToast('Error updating or refreshing records', error.body.message, 'Error', 'dismissable');
            });
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

            updateRecordView() {
                setTimeout(() => {
                     eval("$A.get('e.force:refreshView').fire();");
                }, 1000); 
             }


             @wire(MessageContext)
               messageContext;
               subscription =null;
               connectedCallback(){
                 this.subscribeMC();
               }

               subscribeMC(){
                 this.subscription=subscribe(this.messageContext,SAMPLEMC,(message)=>{                    
                    this.records = message.orderItems;
                    this.noOfProducts=this.records.length;                    
                 })
               }

            getSelectedRecords(event) {        
                const selectedRows = event.detail.selectedRows;
                this.recordsCount = event.detail.selectedRows.length;
                this.selectedRecords=new Array();
                for (let i = 0; i < selectedRows.length; i++) {
                    this.selectedRecords.push(selectedRows[i]);
                }        
            }

               handleSelected(){ 
                this.isLoading=true;              
                  deleteSelectedProducts({recordsIds:this.selectedRecords}).then(result => {  
                                    
                    this.dispatchEvent(
                        new ShowToastEvent({
                            title: 'Success!!',
                            message: 'Selected  records are deleted.',
                            variant: 'success'
                        }),
                    );
                    this.isLoading=false;                    
                    this.template.querySelector('lightning-datatable').selectedRows = [];                
                     refreshApex( this.refreshTable);
                      })
                     
               }
             


    
            
}