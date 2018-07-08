import React from 'react'
import ReactDOM from 'react-dom'
import { Modal, Button, Header } from 'semantic-ui-react';

const loadProductsURI = './Products/GetProducts';
const createProductURI = './Products/CreateProduct';
const editProductURI = "./Products/EditProduct";
const deleteProductURI = "./Products/DeleteProduct";

const token = document.getElementsByName('__RequestVerificationToken')[0].value;

class ProductsTable extends React.Component {
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
        fetch(loadProductsURI)
        .then(response => { response.json()
        .then(data => { this.setState({ serviceList:data.productList })})
        })
    }

    create(productCreateSubmit) {
        productCreateSubmit.preventDefault();
        let nameCreate = ReactDOM.findDOMNode(this.nameCreate).value
        let priceCreate = ReactDOM.findDOMNode(this.priceCreate).value

        let createProduct = {Id:0, 'Name':nameCreate, 'Price':priceCreate, '__RequestVerificationToken':token};

        this.ajaxProduct(createProduct, createProductURI)
    }
    
    update(productEditSubmit) {
        productEditSubmit.preventDefault();
        let idEdit = ReactDOM.findDOMNode(this.idEdit).value;
        let nameEdit = ReactDOM.findDOMNode(this.nameEdit).value
        let priceEdit = ReactDOM.findDOMNode(this.priceEdit).value

        let updateProduct = {Id:idEdit, 'Name':nameEdit, 'Price':priceEdit, '__RequestVerificationToken':token};

        this.ajaxProduct(updateProduct, editProductURI)
    }

    delete(productDeleteSubmitEvent) {
        productDeleteSubmitEvent.preventDefault();
        let idDelete = ReactDOM.findDOMNode(this.idDelete).value; //Could have reused Edit parameters but unsure if modified would conflict

        let deleteProduct = {'Id':idDelete, 'Name':"Name", 'Price':0, '__RequestVerificationToken':token};

        this.ajaxProduct(deleteProduct, deleteProductURI)
    }

    ajaxProduct(dataProduct, urlProduct) {
        $.ajax({
            type: 'POST',
            url: urlProduct,
            data: dataProduct,
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
        
        let createProduct = 
            <Modal id='modal-modalView' trigger={<i className="btn btn-primary btn-md">Add Product</i>}>
                <Modal.Header>Add Product</Modal.Header>
                <Modal.Content>
                    <Modal.Description>
                        <form onSubmit={ this.create }>
                            <div className="form-group">
                            <label htmlFor="productNameCreate">Name</label>
                            <input ref={ref => this.nameCreate = ref} name="productNameCreate" className="form-control" aria-describedby="requiredNotif" required/>
                            <small id="requiredNotif" className="form-text text-muted">*Required</small>
                            </div>
                            <div className="form-group">
                            <label htmlFor="productPriceCreate">Price</label>
                            <input ref={ref => this.priceCreate = ref} name="productPriceCreate" className="form-control" aria-describedby="requiredNotif" required/>
                            <small id="requiredNotif" className="form-text text-muted">*Required, Digits only</small>
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
                    <td>${service.Price}</td>
                    <td>
                        
                        <Modal id='modal-modalView' trigger={<i className="btn btn-warning btn-md glyphicon glyphicon-edit">Edit</i>}>
                            <Modal.Header>Edit Product</Modal.Header>
                            <Modal.Content>
                                <Modal.Description>
                                    <form onSubmit={ this.update }>
                                        <div className="form-group">
                                        <input ref={ref => this.idEdit = ref} type="hidden" value={service.Id}/>
                                        <label htmlFor="productNameEdit">Name</label>
                                        <input ref={ref => this.nameEdit = ref} name="productNameEdit" className="form-control" aria-describedby="requiredNotif" defaultValue={ service.Name } required/>
                                        <small id="requiredNotif" className="form-text text-muted">*Required</small>
                                        </div>
                                        <div className="form-group">
                                        <label htmlFor="productPriceEdit">Price</label>
                                        <input ref={ref => this.priceEdit = ref} name="productPriceEdit" className="form-control" aria-describedby="requiredNotif" defaultValue={ service.Price } required/>
                                        <small id="requiredNotif" className="form-text text-muted">*Required, Digits only</small>
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
                        <Modal.Header>Delete Product</Modal.Header>
                        <Modal.Content>
                            <Modal.Description>
                                <div>
                                Do you wish to Remove this Product? <br />
                                *Note that any Sales Record with this Product will also be removed. <br /> <br />
                                </div>
                                <form onSubmit={ this.delete }>
                                        <div className="form-group">
                                        <input ref={ref => this.idDelete = ref} type="hidden" value={service.Id}/>
                                        <label htmlFor="productNameDelete">Name</label>
                                        <input ref={ref => this.nameDelete = ref} name="productNameDelete" className="form-control" value={ service.Name } disabled="disabled"/>
                                        </div>
                                        <div className="form-group">
                                        <label htmlFor="productPriceDelete">Price</label>
                                        <input ref={ref => this.priceDelete = ref} name="productPriceDelete" className="form-control" value={ service.Price } disabled="disabled"/>
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
                <h2> Product Details </h2>
                <div> {createProduct} </div>
                <br />
                <table className="table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
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
    <ProductsTable />,
    document.getElementById('app-Products')
);