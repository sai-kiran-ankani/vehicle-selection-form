import { Router, Request, Response } from 'express';
import multer from 'multer';
import type { VehicleSubmission, ErrorResponse } from '../types';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const vehicleRouter = Router();

vehicleRouter.post(
  '/',
  upload.single('logbook'),
  (req: Request, res: Response<VehicleSubmission | ErrorResponse>) => {
    const { make, model, badge } = req.body as {
      make?: string;
      model?: string;
      badge?: string;
    };

    if (!make || !model || !badge) {
      return res.status(400).json({ error: 'make, model, and badge are required' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Logbook file is required' });
    }

    if (!req.file.mimetype.startsWith('text/')) {
      return res.status(400).json({ error: 'Logbook must be a plain text file' });
    }

    return res.json({
      make,
      model,
      badge,
      logbookContents: req.file.buffer.toString('utf-8'),
    });
  },
);
