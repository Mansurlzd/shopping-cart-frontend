import React, { useEffect } from "react";
import "./App.css";
import Layout from "./pages/Layout/Layout";
import { Route, Switch } from "react-router";
import Products from "./components/Products/Products";
import {useDispatch} from 'react-redux';
import {  useSelector } from "react-redux";

import Cart from "./components/Cart";
import CartService from "./service/CartService";
import ProductService from "./service/ProductService";

import Product from "./model/Product";
import {useState} from "react";


function App() {

 const toggle = useSelector((state:any) => state.toggle);
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

        function handleClose(){
          dispatch({type:"CLOSE_OVERLAY_CLICKED"});
        }

  return (
    <Layout>
      <Switch>
        <Route exact path="/">
          <Products
              update={update}
              product={product}
          />
        </Route>
        <Route exact path="/checkout">
                <Cart
                    cart={cart}
                    total={total}
                    update={update}
                    refreshProducts={refreshProducts}
                    toggle={toggle}
                    handleClose={handleClose}

                />
        </Route>


      </Switch>
    </Layout>
  );
}

export default App;
