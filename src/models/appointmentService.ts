import { Model, Sequelize, DataTypes as SequelizeDataTypes, Optional } from 'sequelize';

interface AppointmentServiceAttributes {
  id: string;
  name: string;
  description?: string;
  price: number;
  showTime?: number;
  order?: number;
  isRemove?: boolean;
  isPublic?: boolean;
  shopId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface AppointmentServiceCreationAttributes extends Optional<AppointmentServiceAttributes, 'id'> {}

class AppointmentService extends Model<AppointmentServiceAttributes, AppointmentServiceCreationAttributes> implements AppointmentServiceAttributes {
  public id!: string;
  public name!: string;
  public description?: string;
  public price!: number;
  public showTime?: number;
  public order?: number;
  public isRemove?: boolean;
  public isPublic?: boolean;
  public shopId?: string;

  static initialize(sequelize: Sequelize, DataTypes: typeof SequelizeDataTypes) {
    AppointmentService.init(
      {
        id: {
          type: DataTypes.UUID,
          defaultValue: DataTypes.UUIDV4,
          primaryKey: true,
          allowNull: false
        },
        name: {
          type: DataTypes.STRING(255),
          allowNull: false
        },
        description: {
          type: DataTypes.TEXT
        },
        price: {
          type: DataTypes.INTEGER,
          allowNull: false
        },
        showTime: DataTypes.INTEGER,
        order: {
          type: DataTypes.INTEGER,
          defaultValue: 0
        },
        isRemove: {
          type: DataTypes.BOOLEAN,
          defaultValue: false
        },
        isPublic: {
          type: DataTypes.BOOLEAN,
          defaultValue: true
        },
        shopId: {
          type: DataTypes.UUID,
          allowNull: true,
          field: 'ShopId'
        }
      },
      {
        sequelize,
        tableName: 'AppointmentServices',
        timestamps: true,
        underscored: false
      }
    );
  }
}

export default AppointmentService;
