import { mongoose } from "mongoose";

const leaveSchema = mongoose.Schema({

    s_no: { type: Number, required: true, unique: true },

    emp_code: { type: Number, required: true, unique: true },

    emp_name: { type: String, required: true },

    emp_designation: { type: String },

    leaves: [{ leavetype: String, leavedate: Date }],

    remarks: { type: String, maxLength: 500 }


}, { timestamps: true });

export default mongoose.model('Leaves2024', leaveSchema);