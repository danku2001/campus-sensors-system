import { Router } from 'express';
import pool from '../db.js';

const router = Router();

// מצב לפי אזור
router.get('/areas/:areaId', async (req, res, next) => {
  try {
    const { areaId } = req.params;
    const [rows] = await pool.query(
      'SELECT id, area_id, status, connected, updated_at FROM shading_systems WHERE area_id = ?',
      [areaId]
    );
    res.json(rows[0] || null);
  } catch (e) { next(e); }
});

// יצירה או עדכון
router.put('/areas/:areaId', async (req, res, next) => {
  try {
    const { areaId } = req.params;
    const { status, connected } = req.body;
    if (!['open','closed'].includes(status)) return res.status(400).json({ error: "status must be 'open' or 'closed'" });
    const conn = connected == null ? null : (connected ? 1 : 0);
    await pool.query(
      `INSERT INTO shading_systems(area_id, status, connected)
       VALUES(?,?, COALESCE(?,1))
       ON DUPLICATE KEY UPDATE status = VALUES(status), connected = COALESCE(VALUES(connected), connected)`,
      [areaId, status, conn]
    );
    const [rows] = await pool.query('SELECT id, area_id, status, connected, updated_at FROM shading_systems WHERE area_id = ?', [areaId]);
    res.json(rows[0]);
  } catch (e) { next(e); }
});

// מחיקה
router.delete('/areas/:areaId', async (req, res, next) => {
  try {
    const { areaId } = req.params;
    await pool.query('DELETE FROM shading_systems WHERE area_id = ?', [areaId]);
    res.json({ ok: true });
  } catch (e) { next(e); }
});

export default router;
