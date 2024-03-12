import * as yup from "yup";

export const schema = yup.object().shape({
  email: yup
    .string()
    .required("Please enter your Email")
    .email("The email address is invalid."),
  phonenumber: yup
    .string()
    .required("Please enter your phone number"),
    
  password: yup
    .string()
    .required("Please enter your password.")
    .min(6, "Password must be at least 6 characters.")
    .max(20, "Password must not exceed 20 characters."),
  confirmpassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Please confirm your password."),
  username: yup.string().required("Please enter your Name"),
  name: yup.string().min(6, "Name must be between 6 and 20 characters."),
  quantity: yup
    .number()
    .typeError("Quantity must be a number")
    .min(1, "Quantity must be at least 1")
    .required("Please enter the quantity of the product"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .min(1, "Price must be at least 1")
    .required("Please enter the price of the product"),
  category: yup.string().required("Please choose a category for the product"),
  details: yup.string().required("Please enter details of the product"),
  size: yup.array().min(1, "Please choose at least one size").required("Please choose size(s) of the product"),
  color: yup.string().required("Please choose the color of the product"),
  image: yup.mixed().required("Please choose an image for the product"),
});