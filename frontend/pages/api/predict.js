import nextConnect from 'next-connect';
import multer from 'multer';
import pool from '../../lib/db';

const upload = multer({ dest: './public/uploads/' });

const handler = nextConnect();

handler.use(upload.single('file'));

handler.post(async (req, res) => {
  const { prediction, confidence } = req.body;
  const imageUrl = `/uploads/${req.file.filename}`;

  try {
    const { rows } = await pool.query(
      'INSERT INTO predictions (image_url, prediction, confidence) VALUES ($1, $2, $3) RETURNING *',
      [imageUrl, prediction, confidence]
    );
    res.status(201).json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default handler;
