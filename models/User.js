const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const validator = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minLength: [3, "El nombre debe tener al menos 3 caractéres y máximo 100 caracteres"],
      maxLength: [100, "El nombre debe tener al menos 3 caractéres y máximo 100 caracteres"],
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      validate: {
        validator: validator.isEmail,
        message: "Email incorrecto",
      },
    },
    password: {
      type: String,
      required: true,
      validate: {
        validator: (value) => validator.isStrongPassword(value, { minSymbols: 0 }),
        message: "La contraseña debe tener como mínimo 8 caractéres, una mayúscula, una minúscula y un número",
      },
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password")) {
      const saltRounds = 10;
      const passwordEncrypted = await bcrypt.hash(this.password, saltRounds);
      this.password = passwordEncrypted;
    }
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model("User", userSchema);
module.exports = { User };
