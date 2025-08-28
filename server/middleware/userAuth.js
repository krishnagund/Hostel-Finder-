import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";

const userAuth = async (req, res, next) => {
  const { token } = req.cookies; // extracting the token from the cookies in the request

  if (!token) {
    return res.json({ success: false, message: "Unauthorized login again" }); // if no token is found
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      // ✅ keep your original logic
      req.userId = tokenDecode.id;

      // 🔑 add: fetch the user (to access role/isBlocked later)
      const user = await userModel.findById(tokenDecode.id).select("-password");
      if (!user) {
        return res.json({ success: false, message: "User not found" });
      }

      if (user.isBlocked) {
        return res.json({ success: false, message: "Account is blocked by admin" });
      }

      req.user = user; // 🔑 attach full user object (for adminAuth)
      next();
    } else {
      return res.json({ success: false, message: "Not Authorized. Login Again" });
    }
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};

export default userAuth; // exporting the userAuth middleware to be used in other parts of the application
