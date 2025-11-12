import {
  createItem,
  getAllItems,
  getItemById,
  updateItem,
  deleteItem,
} from "../services/itemService.js";

export async function create(req, res) {
  try {
    const userId = req.user.id;
    const item = await createItem(req.body, userId);
    res.status(201).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function getAll(req, res) {
  try {
    const items = await getAllItems();
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

export async function getById(req, res) {
  try {
    const item = await getItemById(req.params.id);
    if (!item) return res.status(404).json({ error: "Item não encontrado" });
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function update(req, res) {
  try {
    const userId = req.user.id;
    const item = await updateItem(req.params.id, req.body, userId);
    res.status(200).json(item);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

export async function remove(req, res) {
  try {
    const userId = req.user.id;
    const result = await deleteItem(req.params.id, userId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
