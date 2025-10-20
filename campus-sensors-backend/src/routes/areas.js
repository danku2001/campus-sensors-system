import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// רשימת אזורים
router.get('/', async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, image_url, width, height FROM areas ORDER BY id'
    );
    res.json(rows);
  } catch (e) { next(e); }
});

// יצירת אזור
router.post('/', async (req, res, next) => {
  try {
    const { name, image_url = null, width = null, height = null } = req.body;
    if (!name) return res.status(400).json({ error: 'name required' });
    const [r] = await pool.query(
      'INSERT INTO areas(name, image_url, width, height) VALUES(?,?,?,?)',
      [name, image_url, width, height]
    );
    const [rows] = await pool.query('SELECT * FROM areas WHERE id = ?', [r.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

// עדכון אזור
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = ['name', 'image_url', 'width', 'height'];
    const sets = [];
    const vals = [];
    for (const f of fields) if (f in req.body) { sets.push(`${f} = ?`); vals.push(req.body[f]); }
    if (!sets.length) return res.status(400).json({ error: 'no fields' });
    vals.push(id);
    await pool.query(`UPDATE areas SET ${sets.join(', ')} WHERE id = ?`, vals);
    const [rows] = await pool.query('SELECT * FROM areas WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (e) { next(e); }
});

// מחיקת אזור
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM areas WHERE id = ?', [id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
