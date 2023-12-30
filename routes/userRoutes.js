import express from "express";
import {
  createusers,
  deleteusers,
  getAllusers,
  getusersById,
  updateusers,
  withdrawusers,
  despositusers,
  transusers
} from "../controllers/userController.js";

const router = express.Router();

router.get("/", getAllusers);

router.get("/:id", getusersById);

router.post("/", createusers);

router.put("/:id", updateusers);

router.delete("/:id", deleteusers);

router.put("/:id/withdraw",withdrawusers);  

router.put("/:id/deposit",despositusers);

router.put("/:id/trans/:id",transusers);



export default router