import React from 'react'
import ReactDOM from 'react-dom'
import { Modal, Button, Header } from 'semantic-ui-react';

const loadSalesRecordsURI = './Sales/GetSalesRecords';
const loadNameListsURI = './Sales/GetSalesRecordsNameLists';
const createSalesRecordURI = './Sales/CreateSalesRecord';
const editSalesRecordURI = "./Sales/EditSalesRecord";
const deleteSalesRecordURI = "./Sales/DeleteSalesRecord";

const token = document.getElementsByName('__RequestVerificationToken')[0].value;

class SalesTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceList: [],
            customerNamesList: [],
            productNamesList: [],
            storeNamesList: []
        };
        this.loadData = this.loadData.bind(this);
        this.loadNamesList = this.loadNamesList.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        this.loadData();
        this.loadNamesList();
    }

    loadData() {
        console.log("loading data");
        fetch(loadSalesRecordsURI)
        .then(response => { response.json()
        .then(data => { this.setState({ serviceList:data.salesList })})
        .catch(error => console.error(error))})
    }

    loadNamesList() {
        console.log("loading name lists");
        fetch(loadNameListsURI)
        .then(response => { response.json()
        .then(data => { this.setState({ productNamesList:data.productNamesList, 
                                        customerNamesList:data.customerNamesList, 
                                        storeNamesList:data.storeNamesList
                                     })})
        })
        .catch(error => console.error(error))
    }

    create(salesRecordCreateSubmit) {
        salesRecordCreateSubmit.preventDefault();
        let productNameCreate = ReactDOM.findDOMNode(this.productNameCreate).value
        let customerNameCreate = ReactDOM.findDOMNode(this.customerNameCreate).value
        let storeNameCreate = ReactDOM.findDOMNode(this.storeNameCreate).value
        let dateSoldCreate = ReactDOM.findDOMNode(this.dateSoldCreate).value

        let createSalesRecord = {'Id':0, 'ProductName':productNameCreate, 'CustomerName':customerNameCreate, 'StoreName':storeNameCreate, 'DateSold':dateSoldCreate, '__RequestVerificationToken':token};

        console.log(createSalesRecord);
        this.ajaxSalesRecord(createSalesRecord, createSalesRecordURI)
    }
    
    update(salesRecordEditSubmit) {
        salesRecordEditSubmit.preventDefault();
        let idEdit = ReactDOM.findDOMNode(this.idEdit).value;
        let productNameEdit = ReactDOM.findDOMNode(this.productNameEdit).value
        let customerNameEdit = ReactDOM.findDOMNode(this.customerNameEdit).value
        let storeNameEdit = ReactDOM.findDOMNode(this.storeNameEdit).value
        let dateSoldEdit = ReactDOM.findDOMNode(this.dateSoldEdit).value

        let updateSalesRecord = {'Id':idEdit, 'ProductName':productNameEdit, 'CustomerName':customerNameEdit, 'StoreName':storeNameEdit, 'DateSold':dateSoldEdit, '__RequestVerificationToken':token};

        console.log(updateSalesRecord);
        this.ajaxSalesRecord(updateSalesRecord, editSalesRecordURI)
    }

    delete(salesRecordDeleteSubmitEvent) {
        salesRecordDeleteSubmitEvent.preventDefault();
        let idDelete = ReactDOM.findDOMNode(this.idDelete).value; //Could have reused Edit parameters but unsure if modified would conflict

        let deleteSalesRecord = {'Id':idDelete, 'ProductName':"Name", 'CustomerName':"Name", 'StoreName':"Name", 'DateSold':"01/01/2001", '__RequestVerificationToken':token};

        this.ajaxSalesRecord(deleteSalesRecord, deleteSalesRecordURI)
    }

    ajaxSalesRecord(dataSalesRecord, urlSalesRecord) {
        $.ajax({
            type: 'POST',
            url: urlSalesRecord,
            data: dataSalesRecord,
            traditional: true,
        })
        .done((res) => {
            console.log(res.responseText);
            this.componentDidMount();
        })
        .fail((res) => {
            console.log(res.responseText);
            this.componentDidMount();
        });
    }

    render() {

        let serviceList = this.state.serviceList;
        let productNamesList = this.state.productNamesList;
        let customerNamesList = this.state.customerNamesList;
        let storeNamesList = this.state.storeNamesList;

        let tableData = null;
        let productNames = null;
        let customerNames = null;
        let storeNames = null;
        
        if (productNamesList != "") {productNames = productNamesList.map(product => 
                                     <option key={product.Id} value={product.Name}>{product.Name}</option>)
                                    }
        if (customerNamesList != "") {customerNames = customerNamesList.map(customer => 
                                      <option key={customer.Id} value={customer.Name}>{customer.Name}</option>)
                                     }
        if (storeNamesList != "") {storeNames = storeNamesList.map(store => 
                                   <option key={store.Id} value={store.Name}>{store.Name}</option>)
                                  }

        let createSalesRecord = 
            <Modal id='modal-salesModalView' trigger={<i className="btn btn-primary btn-md">Add Sales Record</i>}>
                <Modal.Header>Add Sales Record</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <form onSubmit={ this.create }>
                            <div className="form-group">
                            <label htmlFor="salesRecordProductNameCreate">Product Name</label>
                            <select ref={ref => this.productNameCreate = ref} name="salesRecordProductNameCreate" className="form-control" aria-describedby="requiredNotif" required>
                                <option value="" defaultValue>--Please choose an option--</option>
                                {productNames}
                            </select>
                            <small id="requiredNotif" className="form-text text-muted">*Required</small>
                            </div>
                            <div className="form-group">
                            <label htmlFor="salesRecordCustomerNameCreate">Customer Name</label>
                            <select ref={ref => this.customerNameCreate = ref} name="salesRecordCustomerNameCreate" className="form-control" aria-describedby="requiredNotif" required>
                                <option value="" defaultValue>--Please choose an option--</option>
                                {customerNames}
                            </select>
                            <small id="requiredNotif" className="form-text text-muted">*Required</small>
                            </div>
                            <div className="form-group">
                            <label htmlFor="salesRecordStoreNameCreate">Store Name</label>
                            <select ref={ref => this.storeNameCreate = ref} name="salesRecordStoreNameCreate" className="form-control" aria-describedby="requiredNotif" required>
                                <option value="" defaultValue>--Please choose an option--</option>
                                {storeNames}
                            </select>
                            <small id="requiredNotif" className="form-text text-muted">*Required</small>
                            </div>
                            <div className="form-group">
                            <label htmlFor="salesRecordDateSoldCreate">Date Sold</label>
                            <input ref={ref => this.dateSoldCreate = ref} type="date" name="salesRecordDateSoldCreate" className="form-control" aria-describedby="requiredNotif" required/>
                            <small id="requiredNotif" className="form-text text-muted">*Required, format yyyy/mm/dd</small>
                            </div>
                            <div className="buttonsDiv">
                            <button type="submit" className="btn btn-primary">Add</button>
                            </div>
                        </form>
                    </Modal.Description>
                </Modal.Content>
            </Modal>

            if (serviceList != "") {
                console.log("ServiceList data" + serviceList),
                tableData = serviceList.map(service =>
                    <tr key={service.Id}>
                        <td>{service.Id}</td>
                        <td>{service.ProductName}</td>
                        <td>{service.CustomerName}</td>
                        <td>{service.StoreName}</td>
                        <td>{service.DateSold}</td>
                        <td>
                        
                            <Modal id='modal-salesModalView' trigger={<i className="btn btn-warning btn-md glyphicon glyphicon-edit">Edit</i>}>
                                <Modal.Header>Edit Sales Record</Modal.Header>
                                <Modal.Content>
                                    <Modal.Description>
                                        <form onSubmit={ this.update }>
                                            <div className="form-group">
                                            <input ref={ref => this.idEdit = ref} type="hidden" value={service.Id}/>
                                            <label htmlFor="salesRecordProductNameEdit">Product Name</label>
                            {/* Exisiting Values not selected */}
                                            <select ref={ref => this.productNameEdit = ref} name="salesRecordProductNameEdit" className="form-control" aria-describedby="requiredNotif" defaultValue={ service.ProductName } required>
                                                {productNames}
                                            </select>
                                            <small id="requiredNotif" className="form-text text-muted">*Required</small>
                                            </div>
                                            <div className="form-group">
                                            <label htmlFor="salesRecordCustomerNameEdit">Customer Name</label>
                            {/* Exisiting Values not selected */}
                                            <select ref={ref => this.customerNameEdit = ref} name="salesRecordCustomerNameEdit" className="form-control" aria-describedby="requiredNotif" defaultValue={ service.CustomerName } required>
                                                {customerNames}
                                            </select>
                                            <small id="requiredNotif" className="form-text text-muted">*Required</small>
                                            </div>
                                            <div className="form-group">
                                            <label htmlFor="salesRecordStoreNameEdit">Store Name</label>
                            {/* Exisiting Values not selected */}
                                            <select ref={ref => this.storeNameEdit = ref} name="salesRecordStoreNameEdit" className="form-control" aria-describedby="requiredNotif" defaultValue={ service.StoreName } required>
                                                {storeNames}
                                            </select>
                                            <small id="requiredNotif" className="form-text text-muted">*Required</small>
                                            </div>
                                            <div className="form-group">
                                            <label htmlFor="salesRecordDateSoldEdit">Date Sold</label>
                            {/* Exisiting Values not selected */}
                                            <input ref={ref => this.dateSoldEdit = ref} type="date" name="salesRecordDateSoldEdit" className="form-control" aria-describedby="requiredNotif" defaultValue={ service.DateSold } required/>
                                            <small id="requiredNotif" className="form-text text-muted">*Required, format yyyy/mm/dd</small>
                                            </div>
                                            <div className="buttonsDiv">
                                            <button type="submit" className="btn btn-primary">Update</button>
                                            </div>
                                        </form>
                                    </Modal.Description>
                                </Modal.Content>
                                </Modal>
                    
                                </td>
                                <td>

                                <Modal id='modal-salesModalView' trigger={<i className="btn btn-danger btn-md glyphicon glyphicon-trash">Delete</i>}>
                                <Modal.Header>Delete Sales Record</Modal.Header>
                                <Modal.Content>
                                    <Modal.Description>
                                        <div>
                                        Do you wish to Delete this Sales Record? <br /> <br />
                                        </div>
                                        <form onSubmit={ this.delete }>
                                            <div className="form-group">
                                            <input ref={ref => this.idDelete = ref} type="hidden" value={service.Id}/>
                                            <label htmlFor="salesRecordProductNameDelete">Product Name</label>
                                            <input ref={ref => this.productNameDelete= ref} name="salesRecordProductNameDelete" className="form-control" value={ service.ProductName } disabled="disabled"/>
                                            </div>
                                            <div className="form-group">
                                            <label htmlFor="salesRecordCustomerNameDelete">Customer Name</label>
                                            <input ref={ref => this.customerNameDelete = ref} name="salesRecordCustomerNameDelete" className="form-control" value={ service.CustomerName } disabled="disabled"/>
                                            </div>
                                            <div className="form-group">
                                            <label htmlFor="salesRecordStoreNameDelete">Store Name</label>
                                            <input ref={ref => this.storeNameDelete= ref} name="salesRecordStoreNameDelete" className="form-control" value={ service.StoreName } disabled="disabled"/>
                                            </div>
                                            <div className="form-group">
                                            <label htmlFor="salesRecordDateSoldDelete">Date Sold</label>
                                            <input ref={ref => this.dateSoldDelete= ref} name="salesRecordDateSoldDelete" className="form-control" value={ service.DateSold } disabled="disabled"/>
                                            </div>
                                            <div className="buttonsDiv">
                                            <button type="submit" className="btn btn-danger">Delete</button>
                                            </div>
                                        </form>
                                    </Modal.Description>
                                </Modal.Content>
                                </Modal>
                            </td>
                        </tr>
                )
            }

    return (
        <React.Fragment>
            <div id='react-Fragment'>
                <h2> Sale Records </h2>
                <div> {createSalesRecord} </div>
                <br />
                <table className="table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Product Name</th>
                            <th>Customer Name</th>
                            <th>Store Name</th>
                            <th>Date Sold</th>
                            <th>Action(Edit)</th>
                            <th>Action(Delete)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData}
                    </tbody>
                </table>
            </div>
        </React.Fragment>
    )
    }
}

ReactDOM.render(
    <SalesTable />,
    document.getElementById('app-Sales')
);