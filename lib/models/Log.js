const pool = require('../utils/pool');

module.exports = class Log {
  id;
  recipeId;
  dateOfEvent;
  notes;
  rating;

  constructor(row) {
    this.id = String(row.id);
    this.recipeId = String(row.recipe_id);
    this.dateOfEvent = row.date_of_event;
    this.notes = row.notes;
    this.rating = String(row.rating);
  }

  // INSERT
  static async insert({ recipeId, dateOfEvent, notes, rating }) {
    const { rows } = await pool.query(
      `INSERT INTO logs (recipe_id, date_of_event, notes, rating) 
      VALUES ($1, $2, $3, $4) RETURNING *`,
      [recipeId, dateOfEvent, notes, rating]
    );

    return new Log(rows[0]);

  }
  static async find() {
    const { rows } = await pool.query(
      'SELECT * FROM logs'
    );
    if(!rows[0]) throw new Error(' No recipes available');
    return rows.map(row => new Log(row));
  }

  static async findById(id) {
    const { rows } = await pool.query(
      `SELECT * FROM logs
      WHERE id=$1`,
      [id]
    );
    if(!rows[0]) throw new Error(' No recipes available');
    return new Log(rows[0]);
  }

  static async update(id, { recipeId, dateOfEvent, notes, rating }) {
    const { rows } = await pool.query(
      `UPDATE logs
       SET recipe_id=$1,
           date_of_event=$2,
           notes=$3,
           rating=$4
       WHERE id=$5
       RETURNING *
      `,
      [recipeId, dateOfEvent, notes, rating, id]
    );

    if(!rows[0]) throw new Error(`No recipe with id ${id}`);
    return new Log(rows[0]);
  }

  static async delete(id) {
    const { rows } = await pool.query(
      'DELETE FROM logs WHERE id=$1 RETURNING *',
      [id]
    );

    if(!rows[0]) throw new Error(`No log with id ${id}`);
    return new Log(rows[0]);
  }

};

