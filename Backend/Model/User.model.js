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
      validator: function(v) {
        return /@gmail\.com$/.test(v); // Regex to check if email ends with @gmail.com
      },
      message: props => `${props.value} must be a valid Gmail address ending with @gmail.com`
    }
  },
  password: { type: String, required: true,min:6 },
  role: { type: String, enum: ['admin', 'instructor', 'student'], required: true, default: "student" },
  status: { type: String, enum: ['active', 'suspended'], default: 'active' },
  dateOfBirth: { type: Date,  },
  address: { type: String,  },
  phoneNumber: { type: String,  },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
}, {
  timestamps: true
});

userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Assign course and section to user



module.exports = mongoose.model('User', userSchema);
