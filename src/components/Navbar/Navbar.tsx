import React ,{ useEffect } from "react";
import {Link} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import Cart from "../Cart";
import CartService from "../../service/CartService";
import Product from "../../model/Product";
import {useState} from "react";
import ProductService from "../../service/ProductService";

export default function Navbar() {

 const toggle = useSelector((state:any) => state.toggle);
 const productCounter = useSelector((state:any) => state.productCounter);
 const dispatch = useDispatch();


   const [cart, setCart] = useState<Map<Product, number>>(new Map<Product, number>());
      const [total, setTotal] = useState<number>(0);
      const [product, setProduct] = useState<Array<Product>>([]);


      const updateCart = () => {
          CartService
              .getCart()
              .then(resp => resp.json())
              .then(data => {
                  const strings : Array<string> = Object.keys(data);
                  const productMap : Map<Product, number> = new Map<Product, number>();
                  strings.forEach((key: string) => {
                      const product : Product = JSON.parse(key);
                      const quantity : number = data[key];
                      productMap.set(product, quantity);
                  })
                  setCart(productMap);
              });
      }

      const updateTotal = () => {

          CartService
              .getTotal()
              .then(resp => resp.json())
              .then(data => setTotal(data));
      }

      const update = () : void => {
          updateCart();
          updateTotal();
      }

      useEffect(() => {
          refreshProducts();
          updateCart();
          updateTotal();
      }, [])

      const refreshProducts = () : void => {
          ProductService
              .getAllProducts()
              .then(resp => resp.json())
              .then(data => setProduct(data));

      }


  function handleClick(){
    updateCart();
    updateTotal();
    dispatch({type:"OPEN_OVERLAY-CLICKED"})
  }

  function handleClose(){
    dispatch({type:"CLOSE_OVERLAY_CLICKED"});
  }
  return (
    <>
    <Cart
                        cart={cart}
                        total={total}
                        update={update}
                        refreshProducts={refreshProducts}
                        toggle={toggle}
                        handleClose={handleClose}

                    />


    <nav className="navbar">
      <div className="navbar-center">
        <span className="nav-icon">
          <i className="fas fa-bars"></i>
        </span>
        <div className="cart-btn" onClick={handleClick}>
          <span className="nav-icon">
            <i className="fas fa-cart-plus"></i>
          </span>
        </div>
      </div>
    </nav>
    </>
  );
}
