const pool = require("../db");

exports.findByEmail = async (email) => {
  const query = `
    SELECT * FROM public.teacher
    WHERE email = $1
    LIMIT 1;
  `;
  const result = await pool.query(query, [email]);
  return result.rows[0];
};

exports.create = async (teacher) => {
  const query = `
    INSERT INTO public.teacher 
      (teacher_id, name, department, email, phone, password, isfirstlogin)
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *;
  `;

  const values = [
    teacher.Teacher_id,
    teacher.Name,
    teacher.Department,
    teacher.Email,
    teacher.Phone,
    teacher.password,
    teacher.isFirstLogin,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

exports.updatePassword = async (email, password) => {
  const query = `
    UPDATE public.teacher
    SET password = $1, isfirstlogin = 0
    WHERE email = $2
  `;
  await pool.query(query, [password, email]);
};
