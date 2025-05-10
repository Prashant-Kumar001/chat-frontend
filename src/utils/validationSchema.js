import * as yup from "yup";

const schema = yup.object().shape({
  username: yup.string().required("Username is required"),
  name: yup.string().required("name is required"),
  email: yup.string().email("Invalid email format").required("Email is required"),
  bio: yup.string().required("Bio is required"),
  password: yup.string().min(6, "Password must be at least 6 characters").required("Password is required"),
  image: yup.mixed().required("Image is required"),
});

export default schema;
