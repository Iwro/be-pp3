import { Router } from "express";
import * as UserController from "../controllers/user.controller";
import { verificarToken } from "../middlewares/auth.middleware";

const router = Router();

router.get("/usuarios", UserController.getUsers);
router.get("/mecanicos", UserController.getMechanics);
router.get("/usuario/:id", UserController.getUser);
router.post("/login", UserController.loginUser);
router.get("/profile", verificarToken, UserController.getProfile);
router.post("/usuario", UserController.createUser);
router.post("/usuario/shop", UserController.createUserShop);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.deleteUser);

export default router;
