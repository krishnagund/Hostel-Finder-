import express from "express";
import userAuth from "../middleware/userAuth.js";
import adminAuth from "../middleware/adminAuth.js";
import {
  getStats,
  listUsers,
  updateUserRole,
  toggleBlockUser,
  deleteUser,
  listProperties,
  approveProperty,
  rejectProperty,
  deleteProperty,
  toggleFeatureProperty,
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes are protected by both middlewares
router.use(userAuth, adminAuth);

// Stats
router.get("/stats", getStats);

// Users
router.get("/users", listUsers);
router.put("/users/:id/role", updateUserRole);
router.put("/users/:id/block", toggleBlockUser);
router.delete("/users/:id", deleteUser);

// Properties
router.get("/properties", listProperties);               // ?status=pending|approved|rejected
router.put("/properties/:id/approve", approveProperty);
router.put("/properties/:id/reject", rejectProperty);
router.put("/properties/:id/feature", toggleFeatureProperty);
router.delete("/properties/:id", deleteProperty);

export default router;
