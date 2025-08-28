
import express from "express";
import { sendMessage,getMyMessages,markMessagesRead,getStudentMessages,logMessage,markas} from "../controllers/messageController.js";
import userAuth from "../middleware/userAuth.js";

const router = express.Router();


router.post("/send", sendMessage);


router.post("/read", userAuth, markMessagesRead);
router.post("/read-student", userAuth, markas);
router.get("/my", userAuth, getMyMessages);
router.get("/student", userAuth, getStudentMessages);
router.post("/log", userAuth, logMessage);
export default router;
