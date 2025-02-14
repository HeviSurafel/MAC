const mongoose=require("mongoose")
const academicDirectorSchema = mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User
    department: { type: String, required: true },
   
  },{
    timestamps: true
  });
  
  module.exports = mongoose.model('AcademicDirector', academicDirectorSchema);