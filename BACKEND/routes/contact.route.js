import express from 'express';
import { sendMessage } from '../controller/contact.controller.js';

const router = express.Router();

router.post("/submit", sendMessage);

export default router;