class Product {
  id: any;
  title: any;
  price: any;
  image: any;
  description: any;
  amount: any;
  constructor({ id, title, price, image, description, amount }) {
    this.id = id;
    this.title = title;
    this.price = price;
    this.image = image;
    this.description = description;
    this.amount = amount;
  }
}

const initialState: any = {
  products: [],
  cart: [],
  toggle: false,
  productCounter: 0,
  loading: false,
  selectedProductDetail: [],
};

export default function reducer(state = initialState, action: any) {
  switch (action.type) {
    case "LOADING":
      return {
        ...state,
        loading: true,
      };

    case "DATA_LOADED":
      // console.log(ProductList);
      const ProductList = action.payload.map((item) => {
        return new Product({
          id: item.sys.id,
          title: item.fields.title,
          price: item.fields.price,
          image: item.fields.image.fields.file.url,
          description: item.fields.description,
          amount: item.fields.amount,
        });
      });
      return {
        ...state,
        products: ProductList,
        loading: false,
      };

    case "PRODUCT_DETAIL_LOADED":
      const newProductDetail: any = new Product({
        id: action.payload.sys.id,
        title: action.payload.fields.title,
        price: action.payload.fields.price,
        image: action.payload.fields.image.fields.file.url,
        description: action.payload.fields.description,
        amount: action.payload.fields.amount,
      });
      console.log(action.payload);
      const detail = [];
      detail.push(newProductDetail);

      return {
        ...state,
        loading: false,
        selectedProductDetail: detail,
      };

    case "CLEAR_BUTTON_CLICKED":
      return {
        ...state,
        cart: [],
        productCounter: 0,
      };

    case "ADD_TO_CART_CLICKED":
      const newItem = state.products.find((item) => item.id === action.payload);
      return {
        ...state,
        cart: [...state.cart, newItem],
        toggle: true,
        productCounter: state.productCounter + 1,
      };

    case "REMOVE_ITEM_CLICKED":
      return {
        ...state,
        cart: state.cart.filter((item) => item.id !== action.payload.id),
        productCounter: state.productCounter - 1,
      };

    case "OPEN_OVERLAY-CLICKED":
      return {
        ...state,
        toggle: true,
      };

    case "CLOSE_OVERLAY_CLICKED":
      return {
        ...state,
        toggle: false,
      };

    case "INCREASE_AMOUNT_CLICKED":
      return {
        ...state,
        cart: [...state.cart].map((item) => {
          return item.id === action.payload
            ? { ...item, amount: item.amount + 1 }
            : { ...item };
        }),
        // productCounter: state.productCounter + 1
      };

    case "DECREASE_AMOUNT_CLICKED":
      return {
        ...state,
        cart: [...state.cart].map((item) => {
          return item.id === action.payload.id
            ? { ...item, amount: item.amount - 1 }
            : { ...item };
        }),
      };

    default:
      return state;
  }
}
