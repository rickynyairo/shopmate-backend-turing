/* eslint-disable camelcase */
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define(
    'Customer',
    {
      customer_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
        validate: {
          notEmpty: true,
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING(100),
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      credit_card: DataTypes.TEXT,
      address_1: DataTypes.STRING(100),
      address_2: DataTypes.STRING(100),
      city: DataTypes.STRING(100),
      region: DataTypes.STRING(100),
      postal_code: DataTypes.STRING(100),
      country: DataTypes.STRING(100),
      shipping_region_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,
      },
      day_phone: DataTypes.STRING(100),
      eve_phone: DataTypes.STRING(100),
      mob_phone: DataTypes.STRING(100),
    },
    {
      underscored: true,
      tableName: 'customer',
      timestamps: false,
    }
  );

  Customer.beforeCreate(async customer => {
    // eslint-disable-next-line no-param-reassign
    customer.password = await customer.generatePasswordHash();
  });

  Customer.prototype.generatePasswordHash = async function generatePasswordHash() {
    const saltRounds = 8;
    return bcrypt.hash(this.password, saltRounds);
  };

  Customer.prototype.validatePassword = async function validatePassword(password) {
    return bcrypt.compare(password, this.password);
  };

  Customer.prototype.getSafeDataValues = function getSafeDataValues() {
    const { password, ...data } = this.dataValues;
    return data;
  };
  Customer.prototype.toAuthJson = function toAuthJson() {
    const { email, customer_id } = this;
    const expiresIn = '7d';
    const accessToken = jwt.sign(
      {
        email,
        customer_id,
        expiresIn,
      },
      process.env.JWT_KEY,
      { expiresIn }
    );
    return { accessToken, expiresIn };
  };

  Customer.associate = ({ Order }) => {
    // associations can be defined here
    Customer.hasMany(Order, {
      foreignKey: 'customer_id',
    });
  };
  return Customer;
};
