import * as React from "react";
import Product from "../model/Product";
import CartService from "../service/CartService";
import CartItem from "./CartItem";
import { useState } from "react";
import CurrencyInput from "react-currency-input-field";


interface CartProps {
    cart: Map<Product, number>,
    total: number,
    update: () => void,
    refreshProducts: () => void,
    toggle:()=>void,
    handleClose:()=>void
}

const Cart = ({cart, total, update, refreshProducts,toggle,handleClose} : CartProps) => {

    const [isCheckoutSuccessful, setCheckoutSuccessful] = useState<boolean>(false);
    const [isPaymentDone, setPaymentDone] = useState<boolean>(false);
    const [changeMap, setChangeMap] = useState<Map<string, number>>(new Map<string, number>());


    const [value, setValue] = useState<string | number>(0.00);
    const [errorMessage, setErrorMessage] = useState('');
    const [className, setClassName] = useState('');

    const limit = 1000;



    const updateChangeMap = (key: string, value: number) => {
        setChangeMap(new Map(changeMap.set(key,value)));
    }

    const clearChangeMap = () => {
        setChangeMap(new Map<string,number>());
    }

      const clearCart = () : void => {
            CartService.clearCart().then(r => {
                update();
            });
        }

    const checkout = (paidAmount: number) : boolean => {
        if (isNaN(paidAmount)) {
            console.error("Inserted value is not a number: ", paidAmount);
            return false;
        }
        CartService.checkout(paidAmount).then(r => {
            if (!r.ok) {
                console.error("Failed checkout. Server responded: \n", r.json());
                return false;
            }
            r.json().then(data => {
                if (data.hasOwnProperty("change") && data["change"] === 0) {
                    clearChangeMap();
                    return;
                }
                clearChangeMap();
                const keys = Object.keys(data);

                keys.sort((a, b) => Number(b.split('.')[0]) - Number(a.split('.')[0]));
                keys.forEach(key => {
                    const firstDigit : number = Number(key.split('.')[0]);
                    let type : string;
                    let value : number;
                    if (firstDigit > 0) {
                        type = "Euro";
                        value = Number(key.split('.')[0]);
                    } else {
                        type = "Cents";
                        value = Number(key.split('.')[1]);
                    }
                    updateChangeMap(`${value} ${type}`, data[key]);
                })
            });

            update();
            setPaymentDone(true);
            setCheckoutSuccessful(false);
            setValue(0.00);
            refreshProducts();
            return true;
        }).catch((err) => {console.error(err)});
        setPaymentDone(false);
        return false;
    }

    const handleInputs = (value: string | undefined): void => {
        if (!value) {
            setClassName('');
            setValue('');
            return;
        }
        if (Number.isNaN(Number(value))) {
            setErrorMessage('Please enter a valid number');
            setClassName('is-invalid');
            return;
        }
        if (Number(value) > limit) {
            setErrorMessage(`Maximum accepted cash amount is: ${limit}€`);
            setClassName('is-invalid');
            setValue(value);
            return;
        }
        setClassName('is-valid');
        setValue(value);
    };

    return (
        <>

            <div className={toggle ? "cart-overlay transparentBcg" : "cart-overlay"}>
              <div className={toggle ? "cart showCart" : "cart"}>
                <span className="close-cart">
                  <i className="fas fa-window-close" onClick={handleClose}></i>
                </span>
                <h2>your cart</h2>

                    <div>
                        {!isCheckoutSuccessful && !isPaymentDone && (
                        <>
                        {cart.size > 0 ?
                        <div >
                           <article className="cart-item">
                             <div>
                               <h4>
                             {Array.from(cart).map(([key, value])=>(
                              <CartItem key={key.id} product={key} quantity={value} update={update}/>
                       ))}
                               </h4>
                             </div>
                           </article>
                        </div> : null}


                        </>)}


                        {isCheckoutSuccessful && !isPaymentDone && (
                        <div>

                                <h3>Insert cash here: &nbsp;</h3>
                                <CurrencyInput
                                    id="paidAmount"
                                    value={value}
                                    suffix={"€"}
                                    onValueChange={handleInputs}
                                    placeholder="Insert like, e.g. 12.90"
                                    decimalScale={2}
                                    fixedDecimalLength={2}
                                    allowNegativeValue={false}
                                />
                                <div>{errorMessage}</div>

                            <button

                                type="button"
                                className="clear-cart bck-btn"
                                id="button-addon2"
                                disabled={value < total || total <= 0}
                                onClick={() => {
                                    checkout(+value);
                                }}
                            >
                                Pay
                            </button>
                            <button
                                 className="clear-cart bck-btn"
                                onClick={()=>{setCheckoutSuccessful(false)}}
                            >
                               Go Back
                            </button>
                        </div>
                        )}


                        {!isCheckoutSuccessful && isPaymentDone && changeMap.size > 0 && (
                            <div >
                            <span>Here is your change:</span>

                            {Array.from(changeMap).map(([key, value])=>(
                                <div key={key}>
                                <span>{key}:</span>
                                <span>{value}</span>
                                </div>
                                ))}

                            </div>
                        )}


                        {!isCheckoutSuccessful && isPaymentDone && (
                            <div>
                                <div>

                                    Thanks for shopping!
                                </div>
                                <button
                                   className="clear-cart bck-btn"

                                    onClick={() => {
                                        setCheckoutSuccessful(false);
                                        setPaymentDone(false);
                                    }}
                                >
                                    Go to shopping.
                                </button>
                            </div>
                        )}

                    </div>



                <div className="cart-footer">
                  <h3>
                    Your total : € <span className="cart-total">{total}</span>
                  </h3>
                  <button
                                                  className="clear-cart banner-btn"
                                                  disabled={total === 0}
                                                  onClick={() => {
                                                      setCheckoutSuccessful(true);
                                                  }}
                                              >Checkout</button>
                                              <br/>
                                              <br/>
                                                  <button
                                                      className="clear-cart banner-btn"
                                                      disabled={cart.size === 0}
                                                      onClick={() => clearCart()}
                                                      >Clear cart
                                                  </button>


                </div>
              </div>
            </div>



        </>
    );
}

export default Cart;