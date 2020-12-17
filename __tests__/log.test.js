const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/Recipe');
const Log = require('../lib/models/Log');

describe('log routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
  });

  it('creates a log', async() => {
    await request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      });

    return request(app)
      .post('/api/v1/logs')
      .send({
        recipeId: 1,
        dateOfEvent: '1995',
        notes: 'Such a yummy recipe',
        rating: 4
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          recipeId: '1',
          dateOfEvent: '1995',
          notes: 'Such a yummy recipe',
          rating: '4'
        });
      });
  });

  it('gets all logs', async() => {
    await request(app)
      .post('/api/v1/recipes')
      .send({
        name: 'cookies',
        directions: [
          'preheat oven to 375',
          'mix ingredients',
          'put dough on cookie sheet',
          'bake for 10 minutes'
        ]
      });

    const logs = await Promise.all([
      { recipeId: '1', dateOfEvent: '1995', notes: 'Such a yummy recipe', rating: '4' },
      { recipeId: '1', dateOfEvent: '1999', notes: 'Such a yummy recipe', rating: '4' },
      { recipeId: '1', dateOfEvent: '1997', notes: 'Such a yummy recipe', rating: '4' }
    ].map(log => Log.insert(log)));

    return request(app)
      .get('/api/v1/logs')
      .then(res => {
        logs.forEach(log => {
          expect(res.body).toContainEqual(log);
        });
      });
  });

  it('updates a recipe by id', async() => {
    await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });

    const log = await Log.insert({
      recipeId: '1', dateOfEvent: '1997', notes: 'Such a yummy recipe', rating: '4'
    });

    return request(app)
      .put(`/api/v1/logs/${log.id}`)
      .send({
        recipeId: '1', dateOfEvent: '1997', notes: 'Such a yummy recipe', rating: '5'
      })
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          recipeId: '1', dateOfEvent: '1997', notes: 'Such a yummy recipe', rating: '5'
        });
      });
  });

  it('deletes a recipe by id', async() => {
    await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ],
    });
    const log = await Log.insert({
      recipeId: '1', dateOfEvent: '1997', notes: 'Such a yummy recipe', rating: '4'
    });

    return request(app)
      .delete(`/api/v1/logs/${log.id}`)
      .then(res => {
        expect(res.body).toEqual({
          id: expect.any(String),
          recipeId: '1', dateOfEvent: '1997', notes: 'Such a yummy recipe', rating: '4'
        });
      });
  });

  afterAll(() => {
    return pool.end();
  });
});
