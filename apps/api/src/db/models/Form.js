import { Model, DataTypes } from "sequelize";

export default class Form extends Model {
  static initialize(sequelize) {
    Form.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        description: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        status: {
          type: DataTypes.STRING,
          defaultValue: "active",
        },
      },
      {
        sequelize,
        modelName: "Form",
        tableName: "forms",
      }
    );
    return Form;
  }

  static associate(models) {
    Form.hasMany(models.FormField, {
      foreignKey: "formId",
      as: "fields",
    });
    Form.hasMany(models.Submission, {
      foreignKey: "formId",
      as: "submissions",
    });
  }
}
