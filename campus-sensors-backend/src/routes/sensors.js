import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// סנסורים לפי אזור - בלי floors
router.get('/', async (req, res, next) => {
  try {
    const { areaId } = req.query;
    let sql = 'SELECT id, area_id, name, type, x, y, is_active, created_at FROM sensors';
    const params = [];
    if (areaId) { sql += ' WHERE area_id = ?'; params.push(areaId); }
    sql += ' ORDER BY id';
    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (e) { next(e); }
});

// ערכים אחרונים לסנסור
router.get('/:id/values', async (req, res, next) => {
  try {
    const { id } = req.params;
    const limit = Math.min(Number(req.query.limit || 50), 200);
    const [rows] = await pool.query(
      'SELECT id, metric, unit, value, recorded_at FROM sensor_values WHERE sensor_id = ? ORDER BY recorded_at DESC LIMIT ?',
      [id, limit]
    );
    res.json(rows);
  } catch (e) { next(e); }
});

// יצירת סנסור
router.post('/', async (req, res, next) => {
  try {
    const { area_id, name, type = null, x, y, is_active = 1 } = req.body;
    if (!area_id || !name || x == null || y == null) {
      return res.status(400).json({ error: 'area_id, name, x, y required' });
    }
    const [r] = await pool.query(
      'INSERT INTO sensors(area_id, name, type, x, y, is_active) VALUES(?,?,?,?,?,?)',
      [area_id, name, type, x, y, is_active ? 1 : 0]
    );
    const [rows] = await pool.query('SELECT * FROM sensors WHERE id = ?', [r.insertId]);
    res.status(201).json(rows[0]);
  } catch (e) { next(e); }
});

// עדכון סנסור
router.put('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const fields = ['area_id','name','type','x','y','is_active'];
    const sets = [];
    const vals = [];
    for (const f of fields) if (f in req.body) { sets.push(`${f} = ?`); vals.push(req.body[f]); }
    if (!sets.length) return res.status(400).json({ error: 'no fields' });
    vals.push(id);
    await pool.query(`UPDATE sensors SET ${sets.join(', ')} WHERE id = ?`, vals);
    const [rows] = await pool.query('SELECT * FROM sensors WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (e) { next(e); }
});

// מחיקת סנסור
router.delete('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM sensors WHERE id = ?', [id]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

// טוגל פעיל
router.patch('/:id/active', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    await pool.query('UPDATE sensors SET is_active = ? WHERE id = ?', [is_active ? 1 : 0, id]);
    const [rows] = await pool.query('SELECT * FROM sensors WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (e) { next(e); }
});

// עדכון מיקום לגרירה
router.patch('/:id/position', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { x, y } = req.body;
    if (x == null || y == null) return res.status(400).json({ error: 'x and y required' });
    await pool.query('UPDATE sensors SET x = ?, y = ? WHERE id = ?', [x, y, id]);
    const [rows] = await pool.query('SELECT * FROM sensors WHERE id = ?', [id]);
    res.json(rows[0]);
  } catch (e) { next(e); }
});

export default router;
