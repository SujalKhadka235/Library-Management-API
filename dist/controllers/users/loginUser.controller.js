import { z } from "zod";
import { loginUserService } from "../../service/user/loginUser.service.js";
const loginUserSchema = z.object({
    email: z.string().email("invalid email"),
    password: z.string().min(5, "password must be at least 5 characters long"),
});
export const loginUser = async (req, res) => {
    const data = req.body;
    const parsed = loginUserSchema.safeParse(data);
    if (!parsed.success) {
        res.status(400).json({ msg: "invalid request" });
        return;
    }
    try {
        const { email, password } = parsed.data;
        const token = await loginUserService(email, password);
        if (!token) {
            throw new Error("Login failed");
        }
        res.status(201).json({ message: "sucessfully logged in", token: token });
        return;
    }
    catch (err) {
        res.status(500).json({ err: err.message });
        return;
    }
};
