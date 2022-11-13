// we also use proxy in package.jsom
const API_BASE_URL = "/api/shoppingCart";

class CartService {
    getTotal = () : Promise<Response> => {

        return fetch(API_BASE_URL + "/total");
    }
    getCart = () : Promise<Response> => {
        return fetch(API_BASE_URL);
    }
    addToCart = (id: number) : Promise<Response> => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        };

        return fetch(API_BASE_URL + "/" + id, options);
    }
    removeFromCart = (id: number) : Promise<Response> => {
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        };
        return fetch(API_BASE_URL + "/" + id, options);
    }
    clearCart = () : Promise<Response> => {
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        };
        return fetch(API_BASE_URL, options);
    }
    deleteFromCart = (id: number) : Promise<Response> => {
        const options = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            }
        };
        return fetch(API_BASE_URL+ "/" + id + "/all", options);
    }
    checkout = (cashInserted: number) : Promise<Response> => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            }
        };
        return fetch(API_BASE_URL+ "/checkout/" + cashInserted, options);
    }
}

export default Object.freeze(new CartService());
