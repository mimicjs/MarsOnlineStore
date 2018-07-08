import React from 'react'
import ReactDOM from 'react-dom'
import { Modal, Button, Header } from 'semantic-ui-react';

const loadStoresURI = './Stores/GetStores';
const createStoreURI = './Stores/CreateStore';
const editStoreURI = "./Stores/EditStore";
const deleteStoreURI = "./Stores/DeleteStore";

const token = document.getElementsByName('__RequestVerificationToken')[0].value;

class StoresTable extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceList: []
        };
        this.loadData = this.loadData.bind(this);
        this.create = this.create.bind(this);
        this.update = this.update.bind(this);
        this.delete = this.delete.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    loadData() {
        console.log("loading data");
        fetch(loadStoresURI)
        .then(response => { response.json()
        .then(data => { this.setState({ serviceList:data.storeList })})
        })
    }

    create(storeCreateSubmit) {
        storeCreateSubmit.preventDefault();
        let nameCreate = ReactDOM.findDOMNode(this.nameCreate).value
        let addressCreate = ReactDOM.findDOMNode(this.addressCreate).value

        let createStore = {'Id':0, 'Name':nameCreate, 'Address':addressCreate, '__RequestVerificationToken':token};

        this.ajaxStore(createStore, createStoreURI)
    }
    
    update(storeEditSubmit) {
        storeEditSubmit.preventDefault();
        let idEdit = ReactDOM.findDOMNode(this.idEdit).value;
        let nameEdit = ReactDOM.findDOMNode(this.nameEdit).value
        let addressEdit = ReactDOM.findDOMNode(this.addressEdit).value

        let updateStore = {'Id':idEdit, 'Name':nameEdit, 'Address':addressEdit, '__RequestVerificationToken':token};

        this.ajaxStore(updateStore, editStoreURI)
    }

    delete(storeDeleteSubmitEvent) {
        storeDeleteSubmitEvent.preventDefault();
        let idDelete = ReactDOM.findDOMNode(this.idDelete).value; //Could have reused Edit parameters but unsure if modified would conflict

        let deleteStore = {'Id':idDelete, 'Name':"Name", 'Address':"Address", '__RequestVerificationToken':token};

        this.ajaxStore(deleteStore, deleteStoreURI)
    }

    ajaxStore(dataStore, urlStore) {
        $.ajax({
            type: 'POST',
            url: urlStore,
            data: dataStore,
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

    render() {

        let serviceList = this.state.serviceList;

        let tableData = null;
        
        let createStore = 
            <Modal id='modal-modalView' trigger={<i className="btn btn-primary btn-md">Add Store</i>}>
                <Modal.Header>Add Store</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <form onSubmit={ this.create }>
                            <div className="form-group">
                            <label htmlFor="storeNameCreate">Name</label>
                            <input ref={ref => this.nameCreate = ref} name="storeNameCreate" className="form-control" aria-describedby="requiredNotif" required/>
                            <small id="requiredNotif" className="form-text text-muted">*Required</small>
                            </div>
                            <div className="form-group">
                            <label htmlFor="storeAddressCreate">Address</label>
                            <input ref={ref => this.addressCreate = ref} name="storeAddressCreate" className="form-control" aria-describedby="requiredNotif" required/>
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
            console.log("ServiceList data" + serviceList),
            tableData = serviceList.map(service =>
                <tr key={service.Id}>
                    <td>{service.Name}</td>
                    <td>{service.Address}</td>
                    <td>
                        
                        <Modal id='modal-modalView' trigger={<i className="btn btn-warning btn-md glyphicon glyphicon-edit">Edit</i>}>
                            <Modal.Header>Edit Store</Modal.Header>
                            <Modal.Content>
                                <Modal.Description>
                                    <form onSubmit={ this.update }>
                                        <div className="form-group">
                                        <input ref={ref => this.idEdit = ref} type="hidden" value={service.Id}/>
                                        <label htmlFor="storeNameEdit">Name</label>
                                        <input ref={ref => this.nameEdit = ref} name="storeNameEdit" className="form-control" aria-describedby="requiredNotif" defaultValue={ service.Name } required/>
                                        <small id="requiredNotif" className="form-text text-muted">*Required</small>
                                        </div>
                                        <div className="form-group">
                                        <label htmlFor="storeAddressEdit">Address</label>
                                        <input ref={ref => this.addressEdit = ref} name="storeAddressEdit" className="form-control" aria-describedby="requiredNotif" defaultValue={ service.Address } required/>
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
                        <Modal.Header>Delete Store</Modal.Header>
                        <Modal.Content>
                            <Modal.Description>
                                <div>
                                Do you wish to Remove this Store? <br />
                                *Note that any Sales Record with this Store will also be removed. <br /> <br />
                                </div>
                                <form onSubmit={ this.delete }>
                                    <div className="form-group">
                                    <input ref={ref => this.idDelete = ref} type="hidden" value={service.Id}/>
                                    <label htmlFor="storeNameDelete">Name</label>
                                    <input ref={ref => this.nameDelete = ref} name="storeNameDelete" className="form-control" value={ service.Name }  disabled="disabled"/>
                                    </div>
                                    <div className="form-group">
                                    <label htmlFor="storeAddressEdit">Address</label>
                                    <input ref={ref => this.addressDelete = ref} name="storeAddressDelete" className="form-control" value={ service.Address }  disabled="disabled"/>
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
                <h2> Store Details </h2>
                <div> {createStore} </div>
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
    <StoresTable />,
    document.getElementById('app-Stores')
);