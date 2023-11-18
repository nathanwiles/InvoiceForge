function validateDto(schema) {
  return async (req, res, next) => {
    try {
      const validatedBody = await schema.validate(req.body);
      req.body = validatedBody;
      next();
    } catch (error) {
      console.error(error);
      res.status(422).json(error.message);
    }
  };
}

module.exports = validateDto;
