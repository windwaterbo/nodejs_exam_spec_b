import { Model, Sequelize, DataTypes as SequelizeDataTypes, Optional } from 'sequelize';

interface UserAttributes {
  id: string;
  email: string;
  password: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public password!: string;
  public name!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static initialize(sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes) {
    User.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false
        },
        email: {
          type: DataTypes.STRING(255),
          allowNull: false,
          unique: true
        },
        password: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false
        }
      },
      {
        sequelize,
        tableName: 'Users',
        timestamps: true,
        underscored: false
      }
    );
  }
}

export default User;
