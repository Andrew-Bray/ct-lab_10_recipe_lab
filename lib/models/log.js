const pool = require('../utils/pool');

module.exports = class Log {
  id;
  recipe_id;
  date_of_event;
  notes;
  rating;

  constructor(row) {
    this.id = String(row.id);
    this.recipe_id = String(row.recipeId);
    this.date_of_event = row.dateOfEvent;
    this.notes = row.notes;
    this.rating = String(row.rating);
  }

  // INSERT
  static async insert({recipeId, dateOfEvent, notes, rating }) {
    const { rows } = await pool.query(
      `INSERT INTO logs (recipe_id, date_of_event, notes, rating) 
      VALUES ($1, $2, $3, $4) RETURNING *`,
      [recipeId, dateOfEvent, notes, rating]
    );

    return new Log(rows[0]);
  }
};

