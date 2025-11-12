import { registerUser, loginUser } from "../services/authService.js";

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const user = await registerUser(name, email, password);
    res.status(201).json({ message: "Usuário registrado com sucesso!", user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUser(email, password);
    res.status(200).json({ message: "Login realizado com sucesso!", user, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
}

