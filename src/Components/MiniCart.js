import React from 'react';
import { Col,Row } from 'reactstrap';
import {Collapse, Navbar,NavbarToggler,NavbarBrand,Nav,UncontrolledDropdown,DropdownToggle,DropdownMenu,DropdownItem } from 'reactstrap';
import { FaShoppingCart } from 'react-icons/fa';
import Pro_img from '../dist/images.png';
import NumberFormat from 'react-number-format';
import  Handler  from '../Common/Handler';

const productUrl = "https://dnc0cmt2n557n.cloudfront.net/products.json";
export default class MiniCart extends React.Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = {
            isOpen: false,productItems:[],cartItems:[],
        };
    }
    toggle() {
        let{cartItems} = this.state;
        this.setState({
            isOpen:cartItems.length ===0?false:!this.state.isOpen
        });
    }
    componentDidMount(){
        let cartDetails = JSON.parse(localStorage.getItem("cartDetails"));
        var isData = false;
        isData = cartDetails?true:false;
        this.setState({cartItems:isData?cartDetails:[]},()=>{Handler("GET",productUrl,null,(result)=>{this.getData(result,isData)});});
    }
    getData(response,isData){
        let{productItems,cartItems} = this.state;
        if(response.status === 200){
            response.data.products.forEach((element)=>{
                element.defaultValue = 1;
                productItems.push(element);
                if(!isData)
                cartItems.push(element);
            })
        }
        cartItems.forEach((element)=>{
            productItems.forEach((data)=>{
                if(element.id === data.id)
                data.defaultValue = element.defaultValue;
            })
        })
        this.setState({productItems,cartItems});
    }
    setOnClick(source,key,inputValue){
        let{productItems,cartItems} = this.state;
        var data = productItems[key];
        switch (source) {
            case "-":
                var value =parseInt(data.defaultValue)-1;
                if(!value) return;
                else{
                    data.defaultValue = value;
                    cartItems.forEach((element)=>{
                        if(element.id === data.id){
                            element.defaultValue = data.defaultValue;
                        }
                    })
                }
                break;
            case "+":
                data.defaultValue = parseInt(data.defaultValue)+1;
                cartItems.forEach((element)=>{
                    if(element.id === data.id){
                        element.defaultValue = data.defaultValue;
                    }
                })
                break;
            case "onChange":
                data.defaultValue = parseInt(inputValue);
                cartItems.forEach((element)=>{
                    if(element.id === data.id){
                        element.defaultValue = data.defaultValue;
                    }
                })
                break
            default:
                break;
        }
        this.setState({productItems,cartItems});
        localStorage.setItem("cartDetails",JSON.stringify(cartItems));
    }
    setOnRemove(key){
        let{cartItems} = this.state;
        cartItems.splice(key,1);
        localStorage.setItem("cartDetails",JSON.stringify(cartItems));
        this.setState(cartItems);
    }
    render() {
        let{productItems,cartItems} = this.state;
        let price = 0;
        cartItems.forEach((element)=>{
            price =price+(parseInt(element.price) * parseInt(element.defaultValue));
        })
        return (
            <Col>
                <Navbar color="light" light expand="md">
                    <NavbarBrand href="/">Mini Cart</NavbarBrand>
                    <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                            <Nav className="ml-auto" navbar>
                            <UncontrolledDropdown nav inNavbar>
                                <DropdownToggle nav caret>
                                   {`$ ${price}`} <br/>
                                   {`${cartItems.length} Items`}
                                </DropdownToggle>
                                <FaShoppingCart className='cart'/>
                                <DropdownMenu right>
                                    {cartItems.map((element,key)=>{
                                        return(
                                            <DropdownItem key={key}>
                                                <Row className="">
                                                    <Col md = {2}>
                                                        <button className='btnstyle' onClick={()=>this.setOnRemove(key)}>X</button>
                                                    </Col>
                                                    <Col md = {6}>
                                                        <span>{element.title}</span><br/>
                                                        <span>{element.currency + element.price}</span><br/>                               
                                                    </Col>
                                                    
                                                    <Col md = {1}>
                                                        <span>{"Qty "}{ element.defaultValue}</span><br/>
                                                    </Col>
                                                </Row>
                                            </DropdownItem>
                                        )
                                    })}
                                </DropdownMenu>
                            </UncontrolledDropdown>
                            </Nav>
                        </Collapse>
                    </Navbar>
                <Row>
                    <Col>
                    <ul className="list-group" id="product-list">
                        {productItems.map((element,key)=>{
                            return(
                                <li className="list-group-item" key={key}>
                                    <Col md = {1}>
                                        <img src={Pro_img} alt="Product" className="img-responsive img-pro" />
                                    </Col>
                                    <Col md = {6} className='pro_pad'>
                                        <span className="name">{element.title}</span><br/>
                                        <span className="desc">{element.desc}</span><br/>                                
                                    </Col>
                                    <Col md = {4} className='pro_pad'>
                                        <Col className="">
                                            <button className="counter" onClick={()=>this.setOnClick("-",key)}>-</button>
                                            <NumberFormat
                                                value={element.defaultValue?element.defaultValue:1}
                                                allowNegative ={false}
                                                onValueChange={(values) => {
                                                    const { value } = values;
                                                    this.setOnClick("onChange",key,value);
                                                }}
                                                isAllowed={(values)=>{
                                                    const { formattedValue,floatValue } = values;
                                                    return formattedValue ===""|| floatValue>=1;
                                                }}
                                            />
                                            <button className="counter" onClick={()=>{this.setOnClick("+",key)}}>+</button>
                                        </Col>
                                    </Col>
                                    <Col md = {1} className='price_pad float-right'>
                                        <span className="name">{element.currency + element.price}</span><br/>
                                    </Col>
                                </li>
                            )
                        })}
                       
                    </ul>
                    </Col>
                </Row>
            </Col>
        );
    }
}
