import * as React from "react";
import Product from "../../model/Product";
import CartService from "../../service/CartService";

interface ProductViewProps {
    product: Product,
    update: () => void
}

const ProductView = ({product: {id, name, imagePath, amount, price}, update } : ProductViewProps) => {

    const addToCart = (id: number) => {

        CartService
            .addToCart(id)
            .then(resp =>  {
                if (!resp.ok) {
                    throw Error(resp.status.toString());
                }
                update();
            })
            .catch(e => {
            console.log(e);
        });
    }

    return(
        <>
            <div className="d-flex justify-content-center mb-3 mt-3">
                <div className="card p-3 bg-white shadow-sm">
                    <div className="text-center mt-2">
                        <img
                            style={{
                                filter: amount === 0 ? "grayscale(100%) contrast(30%)" : undefined
                            }}
                            src={imagePath}
                            width="200"
                            height="160"
                            alt={"Picture of a " + name}
                            onClick={() => {addToCart(id)}}
                        />
                        <div>
                            <h4 style={{ textTransform: "capitalize"}}>{name}</h4>
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="d-flex justify-content-between">
                            <span>Available amount: </span><span>{amount}</span>
                        </div>

                        <div className="d-flex justify-content-between">
                            <span>Price: </span><span>{price.toFixed(2)}€</span>
                        </div>
                    </div>

                    <div className="d-flex justify-content-end mt-4">

                        <button
                            className="banner-btn"
                            disabled={amount === 0}
                            onClick={() => {addToCart(id)}}
                        >
                            {amount === 0 ? "Out of stock" : "Add to cart"}
                        </button>
                    </div>

                </div>
            </div>
        </>
    );

}

export default ProductView;