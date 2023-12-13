import React, { useEffect, useState } from "react";
import { Button, Form, Modal, ModalHeader, Dropdown } from "react-bootstrap";
import "./EditAddProduct.css";
import { Action } from "history";
import axios from "axios";

export interface Product {
  name: string;
  price: string;
  description: string;
  countAvailable: string;
  brand: string;
  discountPercentage: string;
  category: string;
}

interface editAddProps {
  adminToken: string;
  isEdit: Boolean;
  show: boolean;
  product?: Product;
}

const EditAddProduct = ({ adminToken, show, isEdit, product }: editAddProps) => {
  const [formData, setFormData] = useState<Product>({
    name: "",
    price: "",
    description: "",
    countAvailable: "",
    brand: "",
    discountPercentage: "",
    category: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    if (product) {
      // If product prop is passed, set the initial values from the product
      setFormData({
        name: product.name,
        price: product.price,
        description: product.description,
        countAvailable: product.countAvailable,
        brand: product.brand,
        discountPercentage: product.discountPercentage,
        category: product.category,
      });
    } else {
      // If product prop is not passed, set the initial values to ""
      setFormData({
        name: "",
        price: "",
        description: "",
        countAvailable: "0",
        brand: "",
        discountPercentage: "0.00",
        category: "Action",
      });
    }
  }, [product]);

  // Function to handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Input validation for numeric values with constraints
    if (name === "price" || name === "discountPercentage") {
      // Check for numeric values with at most two decimal places
      if (!/^\d*\.?\d{0,2}$/.test(value)) {
        // Invalid input, do not update the state
        return;
      }

      // Additional check for discount percentage not exceeding 100
      if (name === "discountPercentage" && parseFloat(value) > 100) {
        // Invalid input, do not update the state
        return;
      }
    } else if (name === "countAvailable") {
      // Check for integer values
      if (!/^\d+$/.test(value)) {
        // Invalid input, do not update the state
        return;
      }
    } else if (name === "name" || name === "brand") {
      // Check for maximum length of 30 characters
      if (value.length > 30) {
        // Invalid input, do not update the state
        return;
      }
    }

    // Update the state
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleCategorySelect = (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      ["category"]: value,
    }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    console.log(selectedFile);
  };

  const handleFormSubmit = () => {
    setFormSubmitted(true);
    // Check if all fields are filled before processing the form
    console.log(formData);
    if (
      formData.name &&
      formData.price &&
      formData.description &&
      formData.countAvailable &&
      formData.brand &&
      formData.category &&
      (isEdit || (!isEdit && selectedFile !== null))
    ) {
      // Process the form data
      if (isEdit) {
        handleEditRequest();
      } else {
        handleAddRequest();
      }
    }
  };

  const convertToDto = () => {
    let productDto: ProductDTO = {
      id: 0,
      productName: "",
      price: 0,
      postedDate: new Date,
      description: "",
      productCountAvailable: 0,
      brand: "",
      discountPercentage: 0,
      category: ""
    };
    return productDto;
  }

  const handleEditRequest = async () => {
    try {
      let url: string = `http://localhost:9080/updateProduct?productDTO=${encodeURIComponent(JSON.stringify(convertToDto()))}`;

      const formData = new FormData();
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const response = await axios.post(url, formData,
        {
          headers: {
            "Content-Type": 'multipart/form-data',
            "Authorization": `Bearer ${adminToken}`,
          },
        }
      );
      console.log(response);

      // Here means that the response is Ok and the product is added successfully
      // setResponseData(response.data);
    } catch (error) {
      // Handle errors here
      if (axios.isAxiosError(error)) {
        // This type assertion tells TypeScript that error is an AxiosError
        const axiosError = error as import("axios").AxiosError;
        if (axiosError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Response data:", axiosError.response.data);
          console.error("Response status:", axiosError.response.status);
          // setResponseData(axiosError.response.data as string);
        } else if (axiosError.request) {
          // The request was made but no response was received
          console.error("No response received:", axiosError.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error:", axiosError.message);
        }
      } else {
        // Handle non-Axios errors
        console.error("Non-Axios error:", error);
      }
    }
  };

  const handleAddRequest = async () => {
    try {
      let url: string = `http://localhost:9080/addProduct?productDTO=${encodeURIComponent(JSON.stringify(convertToDto()))}`;

      const formData = new FormData();
      if (selectedFile) {
        formData.append('image', selectedFile);
      }

      const response = await axios.post(url, formData,
        {
          headers: {
            "Content-Type": 'multipart/form-data',
            "Authorization": `Bearer ${adminToken}`,
          },
        }
      );
      console.log(response);

      // Here means that the response is Ok and the product is added successfully
      // setResponseData(response.data);
    } catch (error) {
      // Handle errors here
      if (axios.isAxiosError(error)) {
        // This type assertion tells TypeScript that error is an AxiosError
        const axiosError = error as import("axios").AxiosError;
        if (axiosError.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          console.error("Response data:", axiosError.response.data);
          console.error("Response status:", axiosError.response.status);
          // setResponseData(axiosError.response.data as string);
        } else if (axiosError.request) {
          // The request was made but no response was received
          console.error("No response received:", axiosError.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error:", axiosError.message);
        }
      } else {
        // Handle non-Axios errors
        console.error("Non-Axios error:", error);
      }
    }
  };

  const onCancel = () => {};

  const onConfirm = () => {};

  return (
    <>
      <Modal show={show} onHide={onCancel} style={{ overflowY: "auto" }}>
        <Modal.Header
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h3>{isEdit ? "Edit Product" : "Add Product"}</h3>
        </Modal.Header>
        <Modal.Body style={{ padding: "0px" }}>
          <form
            // className="col-lg-5 col-sm-12 container"
            noValidate
            style={{ overflowY: "scroll", height: "60vh" }}
          >
            <div
              className="productFormField"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div className="productNameField" style={{ width: "50%" }}>
                <label className="form-label">Product name*:</label>
                <input
                  type="text"
                  //   style={{ padding: "0.8rem 0.75rem" }}
                  className="form-control"
                  name="name"
                  aria-label="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                {formSubmitted && !formData.name && (
                  <div className="text-danger">*Name is required</div>
                )}
              </div>

              <div className="productFormField" style={{ width: "40%" }}>
                <label className="form-label">Brand*:</label>
                <input
                  type="text"
                  //   style={{ padding: "0.8rem 0.75rem" }}
                  className="form-control"
                  name="brand"
                  aria-label="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                />
                {formSubmitted && !formData.brand && (
                  <div className="text-danger">*Brand is required</div>
                )}
              </div>
            </div>

            <div
              className="productFormField"
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <div className="productPriceField" style={{ width: "30%" }}>
                <label className="form-label">Price ($)*:</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  aria-label="price"
                  value={formData.price}
                  onChange={handleInputChange}
                />
                {formSubmitted && !formData.price && (
                  <div className="text-danger">*Price is required</div>
                )}
              </div>

              <div className="productPriceField" style={{ width: "30%" }}>
                <label className="form-label">Discount (%):</label>
                <input
                  type="number"
                  className="form-control"
                  name="discountPercentage"
                  aria-label="discountPercentage"
                  value={formData.discountPercentage}
                  onChange={handleInputChange}
                />
              </div>

              <div className="productFormField" style={{ width: "30%" }}>
                <label className="form-label">Available*:</label>
                <input
                  type="number"
                  className="form-control"
                  name="countAvailable"
                  aria-label="countAvailable"
                  value={formData.countAvailable}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div
              className="productFormField"
              style={{
                display: "flex",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <label className="form-label" style={{ marginRight: "10px" }}>
                Category:
              </label>
              <Dropdown>
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  {formData.category}
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => handleCategorySelect("Action")}>
                    Action
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleCategorySelect("Another action")}
                  >
                    Another action
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => handleCategorySelect("Something else here")}
                  >
                    Something else here
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </div>

            <div className="productFormField">
              <label className="form-label">Description*:</label>
              <textarea
                className="form-control"
                name="description"
                aria-label="description"
                value={formData.description}
                onChange={handleTextAreaChange}
                rows={4} // You can adjust the number of rows as needed
              />
              {formSubmitted && !formData.description && (
                <div className="text-danger">*Description is required</div>
              )}
            </div>
            <div className="mb-3">
              <label className="form-label">
                Upload product image{!isEdit && <>*</>}:
              </label>
              <input
                className="form-control"
                type="file"
                id="formFile"
                onChange={handleFileChange}
              />
              {formSubmitted && selectedFile === null && isEdit == false && (
                <div className="text-danger">*Image is required</div>
              )}
            </div>
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleFormSubmit} type="submit">
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditAddProduct;
