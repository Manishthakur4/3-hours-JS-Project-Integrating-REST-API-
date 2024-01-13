
function handleFormSubmit(event) {
    event.preventDefault();

    const productDetails = {
        productName: event.target.productName.value,
        productPrice: parseFloat(event.target.productPrice.value), // Parse as float for calculations
    };

    axios.post('https://crudcrud.com/api/aee97ecc879b4f37a746040a69e2c56d/products', productDetails)
        .then((response) => {
            console.log("Success! Product added.");
            displayProductOnScreen(response.data);
            calculateTotalPrice();
        })
        .catch((err) => {
            console.log(err);
        });

    document.getElementById("productName").value = "";
    document.getElementById("productPrice").value = "";
}

function displayProductOnScreen(productDetails) {
    const productTable = document.getElementById("productTable");

    const productRow = productTable.insertRow(-1); 

    const productNameCell = productRow.insertCell(0);
    productNameCell.textContent = productDetails.productName;

    const productPriceCell = productRow.insertCell(1);
    productPriceCell.textContent = `$${productDetails.productPrice.toFixed(2)}`;

    const deleteBtnCell = productRow.insertCell(2);
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtnCell.appendChild(deleteBtn);

    deleteBtn.addEventListener("click", function () {
        const productId = productDetails._id; 
        deleteProduct(productId, productRow);
        calculateTotalPrice();
    });
}

function loadExistingProducts() {
    axios.get('https://crudcrud.com/api/aee97ecc879b4f37a746040a69e2c56d/products')
        .then((response) => {
            const existingProducts = response.data;
            console.log("Existing Products:", existingProducts);

            const productTable = document.getElementById("productTable");

            if (productTable.rows.length === 0) {
                const headerRow = productTable.insertRow(0);
                const headers = ['Product Name', 'Product Price', 'Action'];

                for (let i = 0; i < headers.length; i++) {
                    const headerCell = headerRow.insertCell(i);
                    headerCell.textContent = headers[i];
                }
            }

            existingProducts.forEach(product => {
                displayProductOnScreen({
                    _id: product._id,
                    productName: product.productName,
                    productPrice: parseFloat(product.productPrice)
                });
            });

            calculateTotalPrice();
        })
        .catch((err) => {
            console.error(err);
        });
}

function deleteProduct(productId, productRow) {
    axios.delete(`https://crudcrud.com/api/aee97ecc879b4f37a746040a69e2c56d/products/${productId}`)
        .then(() => {
            console.log("Success! Product deleted.");
            productRow.remove();
            calculateTotalPrice();
        })
        .catch((err) => {
            console.error(err);
        });
}

function calculateTotalPrice() {
    const productTable = document.getElementById("productTable");
    const rows = productTable.getElementsByTagName("tr");
    let totalPrice = 0;

    for (let i = 1; i < rows.length; i++) {
        const priceCell = rows[i].getElementsByTagName("td")[1]; 
        const price = parseFloat(priceCell.textContent.replace('$', ''));
        totalPrice += price;
    }

    const totalPriceElement = document.getElementById("totalPrice");
    totalPriceElement.textContent = `Total Price: ${totalPrice.toFixed(2)}`;
}

window.addEventListener('load', loadExistingProducts);
