import * as React from "react";
import Product from "../model/Product";
import CartService from "../service/CartService";


interface CartItemProps {
    product: Product,
    quantity: number,
    update: () => void
}

const CartItem = ({product: {id, name, imagePath, amount, price}, quantity, update} : CartItemProps) => {

    const increase = (id: number) : void => {
        CartService
            .addToCart(id)
            .then(()=>{
                update();
            })
            .catch(e => {
                console.log(e);
            });
    }

    const decrease = (id: number) : void => {
        CartService
            .removeFromCart(id)
            .then(()=>{
                update();
            })
            .catch(e => {
                console.log(e);
            });
    }

    const remove = (id: number) : void => {
        CartService
            .deleteFromCart(id)
            .then(()=>{
                update();
            })
            .catch(e => {
                console.log(e);
            });
    }

    return (
            <div >


{name}:
&nbsp;

                     <button
                       type="button"
                       className="cart-btn amount-btn"
                       onClick={() => decrease(id)}
                     >
                       <i className="fas fa-angle-down"></i>
                     </button>
&nbsp;

                        {quantity}
&nbsp;

                                   <button
                                           type="button"
                                           className="cart-btn amount-btn"
                                           onClick={() => increase(id)}
                                         >
                                           <i className="fas fa-angle-up"></i>
                                       </button>

            </div>
    );
}

export default CartItem;