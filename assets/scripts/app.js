class Product {
	// title = "DEFAULT";
	// imageUrl;
	// description;
	// price;

	constructor(title, image, desc, price) {
		this.title = title;
		this.imageUrl = image;
		this.description = desc;
		this.price = price;
	}
}

class ElementAttribute {
	constructor(attrName, attrValue) {
		this.name = attrName;
		this.attrValue = attrValue;
	}
}

class Component {
	constructor(renderHookId, shouldRender = true) {
		this.hookId = renderHookId;
		if (shouldRender) {
			this.render();
		}
	}

	render() {}

	createRootElement(tag, cssClasses, attributes) {
		const rootElement = document.createElement(tag);
		if (cssClasses) {
			rootElement.className = cssClasses;
		}
		if (attributes && attributes.length > 0) {
			for (const attr of attributes) {
				rootElement.setAttribute(attr.name, attr.value);
			}
		}
		document.getElementById(this.hookId).append(rootElement);
		return rootElement;
	}
}

class ShoppingCart extends Component {
	items = [];

	constructor(renderHookId) {
		super(renderHookId, false);

		// Solution 3
		this.orderProducts = () => {
			console.log("Ordering...");
			console.log(this.items);
		};
		this.render();
	}

	set #cartItems(valuesArray) {
		this.items = valuesArray;
		this.totalOutput.innerHTML = `<h2>Total: \$${+this.#totalAmount.toFixed(2)}</h2>`;
	}

	get #totalAmount() {
		const sum = this.items.reduce((acc, curItem) => {
			return acc + curItem.price;
		}, 0);
		return sum;
	}

	addProduct(product) {
		const updatedCartItems = [...this.items];
		updatedCartItems.push(product);
		this.#cartItems = updatedCartItems; // Triggers the Set method passing the updatedCartItems array as the method's parameter
	}

	render() {
		const cartEl = this.createRootElement("section", "cart");
		cartEl.innerHTML = `
      <h2>Total: \$${0}</h2>
      <button>Order Now!</button>
    `;
		const orderButton = cartEl.querySelector("button");
		// Solution nr 1 (Best in my opinion!)
		// orderButton.addEventListener("click", () => this.orderProducts());
		// Solution nr 2
		// orderButton.addEventListener("click", this.orderProducts.bind(this));
		// Solution 3
		orderButton.addEventListener("click", this.orderProducts);
		this.totalOutput = cartEl.querySelector("h2");
	}
}

class ProductItem extends Component {
	constructor(product, renderHookId) {
		super(renderHookId, false);
		this.product = product;
		this.render();
	}

	#addToCart() {
		App.addProductToCart(this.product);
	}

	render() {
		const prodEl = this.createRootElement("li", "product-item");
		prodEl.innerHTML = `
      <div>
        <img src="${this.product.imageUrl}" alt="${this.product.title}" >
        <div class="product-item__content">
          <h2>${this.product.title}</h2>
          <h3>${this.product.price}</h3>
          <p>${this.product.description}</p>
          <button>Add to Cart</button>
        </div>
      </div>
    `;

		const addCartBtn = prodEl.querySelector("button");
		addCartBtn.addEventListener("click", this.#addToCart.bind(this));
	}
}

class ProductsList extends Component {
	#products = [];

	constructor(renderHookId) {
		super(renderHookId, false);
		this.render();
		this.#fetchProducts();
	}

	#fetchProducts() {
		this.#products = [
			new Product(
				"A Pillow",
				"https://linumdesign.com/img/bilder/artiklar/zoom/23SHE05000E97_1.jpg?m=1676976103",
				"A soft pillow!",
				19.99
			),
			new Product(
				"Capet",
				"https://www.shutterstock.com/image-photo/part-old-red-persian-carpet-260nw-1912241188.jpg",
				"A carpet you might like.",
				89.99
			)
		];
		this.renderProducts();
	}

	renderProducts() {
		for (const prod of this.#products) {
			new ProductItem(prod, "prod-list");
		}
	}

	render() {
		const prodList = this.createRootElement("ul", "product-list");
		prodList.id = "prod-list";
		if (this.#products && this.#products.length > 0) {
			this.renderProducts();
		}
	}
}

class Shop {
	constructor() {
		this.render();
	}

	render() {
		this.cart = new ShoppingCart("app");
		new ProductsList("app");
	}
}

class App {
	static cart;

	static init() {
		const shop = new Shop();
		this.cart = shop.cart;
	}

	static addProductToCart(product) {
		this.cart.addProduct(product);
	}
}

App.init();
