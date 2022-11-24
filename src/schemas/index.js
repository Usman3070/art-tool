import * as Yup from "yup";
export const signUpSchema = Yup.object({
  name: Yup.string().min(2).max(25).required("Please enter you'r name"),
  symbol: Yup.string().required("Please enter symbol"),
  royaltyPercent: Yup.number().required("Please enter Royalty Percent"),
  royaltyWallet: Yup.string().required("Please enter you'r royalty wallet"),
  share: Yup.string().required("Required"),
  external: Yup.string().required("Required"),
  description: Yup.string().required("Required"),
});
