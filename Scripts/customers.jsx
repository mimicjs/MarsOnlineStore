import React from 'react'
import ReactDOM from 'react-dom'
import { Modal, Button, Header } from 'semantic-ui-react';

const loadCustomersURI = './Customers/GetCustomers/';
const createCustomerURI = './Customers/CreateCustomer/';
const editCustomerURI = "./Customers/EditCustomer/";
const deleteCustomerURI = "./Customers/DeleteCustomer/";

const token = document.getElementsByName('__RequestVerificationToken')[0].value;

class CustomersTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceList: []
        };
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() { //Load table data by Ajax
        console.log("loading data");
        fetch(loadCustomersURI)
        .then(response => { response.json()
        .then(data => { this.setState({ serviceList:data.customerList }), console.log(data)})
        })
    }

    create(customerCreateSubmitEvent) { //Create customer by Ajax call
        customerCreateSubmitEvent.preventDefault();
        let nameCreate = ReactDOM.findDOMNode(this.nameCreate).value
        let addressCreate = ReactDOM.findDOMNode(this.addressCreate).value

        let createCustomer = {'Id':0, 'Name':nameCreate, 'Address':addressCreate, '__RequestVerificationToken':token};

        this.ajaxCustomer(createCustomer, createCustomerURI)
    }

    update(customerEditSubmitEvent) { //Update customer by AJax call
        customerEditSubmitEvent.preventDefault();
        let idEdit = ReactDOM.findDOMNode(this.idEdit).value;
        let nameEdit = ReactDOM.findDOMNode(this.nameEdit).value
        let addressEdit = ReactDOM.findDOMNode(this.addressEdit).value

        let updateCustomer = {'Id':idEdit, 'Name':nameEdit, 'Address':addressEdit, '__RequestVerificationToken':token};

        this.ajaxCustomer(updateCustomer, editCustomerURI)
    }

    delete(customerDeleteSubmitEvent) { //Delete customer by Ajax call
        customerDeleteSubmitEvent.preventDefault();
        let idDelete = ReactDOM.findDOMNode(this.idDelete).value; //Could have reused Edit parameters but unsure if modified would conflict

        let deleteCustomer = {'Id':idDelete, 'Name':"Name", 'Address':"Address", '__RequestVerificationToken':token};

        this.ajaxCustomer(deleteCustomer, deleteCustomerURI)
    }

    ajaxCustomer(dataCustomer, urlCustomer) {
        $.ajax({
            type: 'POST',
            url: urlCustomer,
            data: dataCustomer,
            traditional: true,
        })
        .done((res) => {
            console.log(res.responseText);
            this.loadData();
        })
        .fail((res) => {
            console.log(res.responseText);
            this.loadData();
        });
    }

        // Does not send data/body to Controller or data is formatted incorrectly
        //
        //fetch(editCustomerURI,{
        //    method: "post",
        //    body: updateCustomer
        //})
        //.then(response => { response.json()
        //.then(data => { alert(data) })
        //})
        //.catch(error => console.error('Error: ', error))
        //.then(response => console.log('Success:', response))
        //}
    //}

    render() {

        let serviceList = this.state.serviceList;

        let tableData = null;

        let createCustomer = 
            <Modal id='modal-modalView' trigger={<i className="btn btn-primary btn-md">Add Customer</i>}>
                <Modal.Header>Add Customer</Modal.Header>
                <Modal.Content>
                    <Modal.Description>

                        <form onSubmit={ this.create }>
                            <div className="form-group">
                            <label htmlFor="customerNameCreate">Name</label>
                            <input ref={ref => this.nameCreate = ref} name="customerNameCreate" className="form-control" aria-describedby="requiredNotif" required/>
                            <small id="requiredNotif" className="form-text text-muted">*Required</small>
                            </div>
                            <div className="form-group">
                            <label htmlFor="customerAddressCreate">Address</label>
                            <input ref={ref => this.addressCreate = ref} name="customerAddressCreate" className="form-control" aria-describedby="requiredNotif" required/>
                            <small id="requiredNotif" className="form-text text-muted">*Required</small>
                            </div>
                            <div className="buttonsDiv">
                            <button type="submit" className="btn btn-primary">Add</button>
                            </div>
                        </form>
                    </Modal.Description>
                </Modal.Content>
            </Modal>

        if (serviceList != "") {
            tableData = serviceList.map(service =>
                <tr key={service.Id}>
                    <td>{service.Name}</td>
                    <td>{service.Address}</td>
                    <td>

                        <Modal id='modal-modalView' trigger={<i className="btn btn-warning btn-md glyphicon glyphicon-edit">Edit</i>}>
                        <Modal.Header>Edit Customer</Modal.Header>
                        <Modal.Content>
                            <Modal.Description>
                                <form onSubmit={ this.update }>
                                    <div className="form-group">
                                    <input ref={ref => this.idEdit = ref} type="hidden" value={service.Id}/>
                                    <label htmlFor="customerNameEdit">Name</label>
                                    <input ref={ref => this.nameEdit = ref} name="customerNameEdit" className="form-control" aria-describedby="requiredNotif" defaultValue={ service.Name } required/>
                                    <small id="requiredNotif" className="form-text text-muted">*Required</small>
                                    </div>
                                    <div className="form-group">
                                    <label htmlFor="customerAddressEdit">Address</label>
                                    <input ref={ref => this.addressEdit = ref} name="customerAddressEdit" className="form-control" aria-describedby="requiredNotif" defaultValue={ service.Address } required/>
                                    <small id="requiredNotif" className="form-text text-muted">*Required</small>
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

                        <Modal id='modal-modalView' trigger={<i className="btn btn-danger btn-md glyphicon glyphicon-trash">Delete</i>}>
                        <Modal.Header>Delete Customer</Modal.Header>
                        <Modal.Content>
                            <Modal.Description>
                                <div>
                                    Do you wish to Remove this Customer? <br />
                                    *Note that any Sales Record with this Customer will also be removed. <br /> <br />
                                </div>
                                <form onSubmit={ this.delete }>
                                    <div className="form-group">
                                    <input ref={ref => this.idDelete = ref} type="hidden" value={service.Id}/>
                                    <label htmlFor="customerNameDelete">Name</label>
                                    <input ref={ref => this.nameDelete = ref} name="customerNameDelete" className="form-control" value={ service.Name } disabled="disabled"/>
                                    </div>
                                    <div className="form-group">
                                    <label htmlFor="customerAddressDelete">Address</label>
                                    <input ref={ref => this.addressDelete = ref} name="customerAddressDelete" className="form-control" value={ service.Address } disabled="disabled"/>
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
                <h2> Customer Details </h2>
                <div> {createCustomer} </div>
                <br />
                <table className="table">
                    <thead>
                    <tr>
                        <th>Name</th>
                        <th>Address</th>
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
    <CustomersTable />,
    document.getElementById('app-Customers')
);