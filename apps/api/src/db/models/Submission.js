import { Model, DataTypes } from "sequelize";

export default class Submission extends Model {
  static initialize(sequelize) {
    Submission.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
        },
        formId: {
          type: DataTypes.UUID,
          allowNull: false,
          references: {
            model: "forms",
            key: "id",
          },
        },
        payload: {
          type: DataTypes.TEXT,
          allowNull: false,
          get() {
            const rawValue = this.getDataValue("payload");
            return rawValue ? JSON.parse(rawValue) : null;
          },
          set(value) {
            this.setDataValue("payload", value ? JSON.stringify(value) : null);
          },
        },
        status: {
          type: DataTypes.STRING,
          defaultValue: "pending",
        },
      },
      {
        sequelize,
        modelName: "Submission",
        tableName: "submissions",
      }
    );
    return Submission;
  }

  static associate(models) {
    Submission.belongsTo(models.Form, {
      foreignKey: "formId",
    });
  }
}
