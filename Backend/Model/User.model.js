const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        return /@gmail\.com$/.test(v); // Only Gmail addresses allowed
      },
      message: props => `${props.value} must be a valid Gmail address ending with @gmail.com`
    }
  },

  password: { type: String, required: true, minlength: 6 },

  role: { type: String, enum: ['admin', 'instructor', 'student'], required: true, default: "student" },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },

  dateOfBirth: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        const today = new Date();
        const minDate = new Date();
        minDate.setFullYear(today.getFullYear() - 10); // At least 10 years old
        return value <= minDate;
      },
      message: 'User must be at least 10 years old.'
    }
  },

  address: { type: String },

  phoneNumber: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        return /^(09|07)\d{8}$/.test(v); // Starts with 09 or 07, and is exactly 10 digits
      },
      message: props => `${props.value} is not a valid phone number! It should start with 09 or 07 and be 10 digits long.`
    }
  },

  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },

}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);
