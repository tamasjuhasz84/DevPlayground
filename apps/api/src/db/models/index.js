import Form from "./Form.js";
import FormField from "./FormField.js";
import Submission from "./Submission.js";

/**
 * Initialize all models and their associations
 * @param {import('sequelize').Sequelize} sequelize - Sequelize instance
 * @returns {Object} Object containing all initialized models
 */
export function initModels(sequelize) {
  // Initialize all models
  Form.initialize(sequelize);
  FormField.initialize(sequelize);
  Submission.initialize(sequelize);

  // Define associations
  const models = {
    Form,
    FormField,
    Submission,
  };

  Object.values(models).forEach((model) => {
    if (model.associate) {
      model.associate(models);
    }
  });

  return models;
}

export { Form, FormField, Submission };
