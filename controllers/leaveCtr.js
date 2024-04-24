import leaveModel from "../models/leaveModel.js";


// ------------------------ clGetCtr -----get all emp------------------------
const allEmpGetCtr = async (req, res) => {

    try {
        const allEmp = await leaveModel.find({},).sort({ s_no: 1 });
        res.status(200).json(allEmp);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error in get all Employees data !" });
    }
}

// --------------------------- addEmpPostCtr --------------------------
const addEmpPostCtr = async (req, res) => {
    const { s_no, emp_code, emp_name, emp_designation } = req.body;
    if (s_no && emp_code && emp_name && emp_designation) {

        try {
            // check if exists
            const isExist = await leaveModel.findOne({ $or: [{ s_no }, { emp_code }] });
            if (isExist) {
                return res.status(400).json({ message: "Employee Code or S.No already exists !" });
            }
            // add new employee
            const addEmp = await new leaveModel({
                s_no,
                emp_code,
                emp_name,
                emp_designation
            });
            const newEmp = addEmp.save();
            if (newEmp) {
                res.status(200).json({ message: "Employee added successfully !" });
            } else {
                res.status(500).json({ message: "Error in Add Employee !" });
            }

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error in Add Employee !" });
        }
    } else {
        res.status(400).json({ message: "All Fields required !" });
    }
}
// --------------------------- deleteEmpCtr --------------------------
const deleteEmpCtr = async (req, res) => {
    const { id } = req.body;
    try {
        const isEmp = await leaveModel.deleteOne({ _id: id })
        if (isEmp) {
            return res.status(200).json({ message: "Employee data deleted Successfully !" });
        } else {
            return res.status(400).json({ message: "Employee not Exist !" });
        }

    } catch (error) {
        res.status(500).json({ message: "Error in Delete Employee !", erro: error.message });
    }
}
// --------------------------- singleEmpGetCtr ----with all leaves and remarks--------------------
const singleEmpGetCtr = async (req, res) => {
    const { id } = req.params;
    if (id) {

        try {
            // check if exists
            const isData = await leaveModel.findOne({ _id: id });
            if (!isData) {
                return res.status(400).json({ message: "Employee not Exists !" });
            }
            // ----leave type count
            let leaveCL = isData.leaves.filter((item) => item.leavetype === "cl").length;
            let leaveHD = isData.leaves.filter((item) => item.leavetype === "hd").length;
            let leaveSL = isData.leaves.filter((item) => item.leavetype === "sl").length;
            let leaveRH = isData.leaves.filter((item) => item.leavetype === "rh").length;
            let leaveNKSY = isData.leaves.filter((item) => item.leavetype === "nksy").length;

            const totLeavesByType = {
                totalCL: leaveCL,
                totalHD: leaveHD,
                totalSL: leaveSL,
                totalRH: leaveRH,
                totalNKSY: leaveNKSY,

            }

            // ---leave sort by date
            let sortedLeaves = isData.leaves.sort((a, b) => (a.leavedate > b.leavedate) ? 1 : (a.leavedate < b.leavedate) ? -1 : 0)


            res.status(200).json({ isData, sortedLeaves, totLeavesByType });

        } catch (error) {
            console.log(error);
            res.status(400).json({ message: "Error in get Single Employee !!", error });
        }
    } else {
        res.status(400).json({ message: "Error in get Single Employee !" });
    }
}
// -------------------- editEmppatchCtr  -----------------------------
const editEmpPatchCtr = async (req, res) => {
    // const { id, s_no, emp_name, emp_designation } = req.body;
    const { empData } = req.body;
    const { _id, s_no, emp_code, emp_name, emp_designation } = empData;

    if (_id && s_no && emp_code && emp_name && emp_designation) {
        try {
            // check if exists
            const isData = await leaveModel.findOne({ _id });
            if (!isData) {
                return res.status(400).json({ message: "Employee not Exists !" });
            }

            isData.s_no = s_no;
            isData.emp_name = emp_name;
            isData.emp_code = emp_code;
            isData.emp_designation = emp_designation;

            let updatedData = await isData.save();

            if (updatedData) {
                return res.status(200).json({ message: "Employee Details Updated Successfully !" });
            }
            res.status(400).json({ message: "Error in Update Employee Details !" });

        } catch (error) {
            if (error.code === 11000) {
                return res.status(400).json({ message: "Duplicate S.No or Emp Code Entered !" });
            }
            res.status(400).json({ message: error });
        }
    } else {
        res.status(400).json({ message: "All fields required !" });
    }
}
// ------------------------------- Add Leave Post CTr ------------------------------
const addLeavesPatchCtr = async (req, res) => {
    const { id, leaves } = req.body;
    if (id && leaves) {
        leaves.leavedate = new Date(leaves.leavedate);
        let year = leaves.leavedate.getFullYear();
        let month = leaves.leavedate.getMonth();
        let date = leaves.leavedate.getDate();
        if (!(year === 2024 &&
            month + 1 <= 12 && month + 1 >= 1 &&
            date <= 31 && date >= 1)) {
            return res.status(400).json({ message: "Invalid Date Entered !" });
        }


        if (leaves.leavedate == "Invalid Date") {
            return res.status(400).json({ message: "Invalid Date Entered !" });
        }
        try {
            const isData = await leaveModel.findOne({ _id: id, "leaves.leavedate": leaves.leavedate });
            if (isData) {
                return res.status(400).json({ message: "Date Already Exists !" });
            }

            const addLeave = await leaveModel.updateOne({ _id: id }, { $addToSet: { leaves } });
            if (addLeave) {
                return res.status(200).json({ message: "Leave Added Successfully !" });
            } else {
                return res.status(400).json({ message: "Error in Add Leave !" });
            }
        }
        catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    } else {
        res.status(400).json({ message: "All fields required !" });
    }
}
// -------------------------- deleteLeaveCtr ------------------------------
const deleteLeaveCtr = async (req, res) => {
    const { id, dateForDelete } = req.body;
    if (id && dateForDelete) {

        let dateObj = new Date(dateForDelete);

        if (dateObj == "Invalid Date") {
            return res.status(400).json({ message: "Invalid Date Entered !!" });
        }
        try {
            // ---delete matched leaveDate             
            const isData = await leaveModel.findOneAndUpdate({ _id: id }, { $pull: { leaves: { leavedate: dateObj } } }, { new: true });
            if (!isData) {
                return res.status(400).json({ message: "Employee not Exists !" });
            }

            return res.status(200).json({ message: "Deleted Successfully !" });
        } catch (error) {
            console.log(error);
            res.status(400).json({ message: error.message });
        }
    } else {
        res.status(400).json({ message: "Error in Delete Leave !" });
    }
}

const addRemarksPostCtr = async (req, res) => {
    const { id, remark } = req.body;
    if (!id && !remark) {
        res.status(400).json({ message: "All fields required !" });
    }

    try {
        const response = await leaveModel.updateOne({ _id: id }, { $set: { remarks: remark } });
        if (response) {
            res.status(200).json({ message: "Remarks updated Successfully !" });
        }

    } catch (error) {
        res.status(400).json({ message: "Error in Send Remarks !" });
    }
}

export { allEmpGetCtr, addEmpPostCtr, deleteEmpCtr, singleEmpGetCtr, editEmpPatchCtr, addLeavesPatchCtr, deleteLeaveCtr, addRemarksPostCtr, };