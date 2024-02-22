import { sequelize } from '@auth/database'
import { IAuthDocument } from '@gustavopmaia/teachme-shared'
import { hash, verify } from 'argon2'
import { DataTypes, Model, ModelDefined, Optional } from 'sequelize'

type AuthUserCreationAttributes = Optional<
  IAuthDocument,
  'id' | 'createdAt' | 'passwordResetToken' | 'passwordResetExpires'
>

const AuthModel: ModelDefined<IAuthDocument, AuthUserCreationAttributes> = sequelize.define(
  'auths',
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profilePublicId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    emailVerificationToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: Date.now,
    },
    passwordResetToken: { type: DataTypes.STRING, allowNull: true },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ['email'],
      },
      {
        unique: true,
        fields: ['username'],
      },
      {
        unique: true,
        fields: ['emailVerificationToken'],
      },
    ],
  }
)

AuthModel.addHook('beforeCreate', async (auth: Model) => {
  const hashedPassword: string = await hash(auth.dataValues.password as string)
  auth.dataValues.password = hashedPassword
})

AuthModel.prototype.comparePassword = async function (
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return verify(hashedPassword, password)
}

AuthModel.prototype.hashPassword = async function (password: string): Promise<string> {
  return hash(password)
}

// force: true always deletes the table when there is a server restart
AuthModel.sync({})
export { AuthModel }
