import request from 'supertest';
import { app } from '../app';

const LOGBOOK_CONTENT = 'Oil changed on 01/01/2024\nTyres rotated on 15/03/2024';

describe('POST /api/vehicle', () => {
  it('returns 200 with vehicle selection and logbook contents on valid submission', async () => {
    const res = await request(app)
      .post('/api/vehicle')
      .field('make', 'tesla')
      .field('model', 'Model 3')
      .field('badge', 'Performance')
      .attach('logbook', Buffer.from(LOGBOOK_CONTENT), {
        filename: 'logbook.txt',
        contentType: 'text/plain',
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      make: 'tesla',
      model: 'Model 3',
      badge: 'Performance',
      logbookContents: LOGBOOK_CONTENT,
    });
  });

  it('returns 400 when make is missing', async () => {
    const res = await request(app)
      .post('/api/vehicle')
      .field('model', 'Model 3')
      .field('badge', 'Performance')
      .attach('logbook', Buffer.from('content'), {
        filename: 'log.txt',
        contentType: 'text/plain',
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when model is missing', async () => {
    const res = await request(app)
      .post('/api/vehicle')
      .field('make', 'tesla')
      .field('badge', 'Performance')
      .attach('logbook', Buffer.from('content'), {
        filename: 'log.txt',
        contentType: 'text/plain',
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when badge is missing', async () => {
    const res = await request(app)
      .post('/api/vehicle')
      .field('make', 'tesla')
      .field('model', 'Model 3')
      .attach('logbook', Buffer.from('content'), {
        filename: 'log.txt',
        contentType: 'text/plain',
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when no logbook file is provided', async () => {
    const res = await request(app)
      .post('/api/vehicle')
      .field('make', 'tesla')
      .field('model', 'Model 3')
      .field('badge', 'Performance');

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('returns 400 when logbook is not a text file', async () => {
    const res = await request(app)
      .post('/api/vehicle')
      .field('make', 'tesla')
      .field('model', 'Model 3')
      .field('badge', 'Performance')
      .attach('logbook', Buffer.from('%PDF-1.4'), {
        filename: 'logbook.pdf',
        contentType: 'application/pdf',
      });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('preserves multiline logbook content exactly', async () => {
    const multilineContent = 'Line 1\nLine 2\nLine 3';
    const res = await request(app)
      .post('/api/vehicle')
      .field('make', 'ford')
      .field('model', 'Ranger')
      .field('badge', 'Raptor')
      .attach('logbook', Buffer.from(multilineContent), {
        filename: 'logbook.txt',
        contentType: 'text/plain',
      });

    expect(res.status).toBe(200);
    expect(res.body.logbookContents).toBe(multilineContent);
  });
});
