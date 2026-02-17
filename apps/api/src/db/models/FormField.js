import { Model, DataTypes } from "sequelize";

export default class FormField extends Model {
  static initialize(sequelize) {
    FormField.init(
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
        type: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: false,
        },
        label: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        required: {
          type: DataTypes.BOOLEAN,
          defaultValue: false,
        },
        order: {
          type: DataTypes.INTEGER,
          defaultValue: 0,
        },
        config: {
          type: DataTypes.TEXT,
          allowNull: true,
          get() {
            const rawValue = this.getDataValue("config");
            return rawValue ? JSON.parse(rawValue) : null;
          },
          set(value) {
            this.setDataValue("config", value ? JSON.stringify(value) : null);
          },
        },
      },
      {
        sequelize,
        modelName: "FormField",
        tableName: "form_fields",
      }
    );
    return FormField;
  }

  static associate(models) {
    FormField.belongsTo(models.Form, {
      foreignKey: "formId",
    });
  }
}
