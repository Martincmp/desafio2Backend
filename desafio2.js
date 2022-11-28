const fs = require("fs");

class ProductManagerFilesystem {

  constructor(path) {

    this.path = path;


    this.init();
  }


  init() {
    try {
      const existFile = fs.existsSync(this.path);
      if (existFile) return;


      fs.writeFileSync(this.path, JSON.stringify([]));
    } catch (error) {
      console.log(error);
    }
  }


  async getProducts() {
    try {

      const response = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(response);
    } catch (error) {
      console.log(error);
    }
  }

  async saveProduct({ title, description, price, code }) {
    try {

      if (!title || !description || !price || !code)
        return { error: "Las variables son obligatorias" };

      const newProduct = { title, description, price, code };
      const products = await this.getProducts();

      newProduct.id = !products.length
        ? 1
        : products[products.length - 1].id + 1;

      products.push(newProduct);

      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 3));

      return newProduct;
    } catch (error) {
      console.log(error);
    }
  }
}


const electronicProducts = new ProductManagerFilesystem(
  "./electronic-products.json"
);


const foodProducts = new ProductManagerFilesystem("./food-products.json");


const testClass = async () => {

  const productOneSaved = await electronicProducts.saveProduct({
    code: "02",
    title: "monitor",
    description: "pantalla",
    price: 1900,
  });

  console.log({ productOneSaved });



  const productTwoSaved = await electronicProducts.saveProduct({
    code: "01",
    title: "teclado",
    description: "periferico",
    price: 700,
  });

  console.log({ productTwoSaved });


  const allProducts = await electronicProducts.getProducts();
  console.log(allProducts);
};

testClass();