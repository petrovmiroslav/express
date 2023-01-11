import { Router } from "express";
import cors from "cors";
import { mailer } from "../controllers/mailer/mailer";

export const router = Router();

router.post("/mailer", cors(), mailer);

router.get("/health-check", (_, res) => res.sendStatus(200));
