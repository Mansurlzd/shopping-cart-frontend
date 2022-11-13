import React from 'react'
import Product from "../../model/Product";
import ProductView from "./ProductView";

import {useSelector} from "react-redux";

interface StateType{

      update: () => void,
      product: Array<Product>

}
const Products = ({ update, product } : StateType) => {

  return (
    <section className="products">
      <div className="section-title">
        <h2>Our products</h2>
      </div>
      <div className="products-center">
                          {product.map((p : Product) =>
                              <div>
                                  <ProductView product={p} update={update}/>
                              </div>
                          )}

      </div>
    </section>
  );
}

export default Products;
