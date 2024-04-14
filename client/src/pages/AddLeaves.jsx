import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { urlNet, urlLocal } from '../urls/baseurl.js'

function AddLeaves() {
    const params = useParams();

    // -------------usestate start---------------
    const [dataEmp, setDataEmp] = useState({});// object data - emp name etc -ok
    const [charCount, setCharCount] = useState(0);// textArea char counter -ok
    const [editRemarks, setEditRemarks] = useState(true);// show remarks edit textarea-ok

    // leave variable in 3 slots of 15 to show on page
    const [dataLeaves, setDataLeaves] = useState({
        lvArray1: [], lvArray2: [], lvArray3: [],
    });
    //----date for leave add in emp account
    const [dateForAdd, setDateForAdd] = useState({
        day: "1", month: "1", year: "2024", leaveType: "cl", remarks: ""
    });
    // ----toggle for delete btn  -ok
    const [toggle, setToggle] = useState(false);

    // --------- total leave from server by type
    const [totLeaves, setTotLeaves] = useState({
        totalCL: "", totalHD: "", totalSL: "", totalRH: "", totalNKSY: "",
    });

    // -------------------------usestate end ---------- -------------


    // -----------date,month,year from input---------handle input set to variables-------ok------------
    const handleInput = (e) => {
        e.preventDefault();
        let name = e.target.name;
        let value = e.target.value;
        setDateForAdd({
            ...dateForAdd, [name]: value,
        });
        setCharCount(e.target.value.length)
    };


    // ----------------  handleRemarksBtn --- update remarks --------ok--------
    const handleRemarksBtn = () => {
        let response = confirm("Want to sure to Edit Remarks !")
        if (response) {
            submitRemarks();
        }
    }

    // ----------- handle Cancel btn for remarks----ok---
    const handleCancel = (e) => {
        getEmpLeaveData();
        setEditRemarks(!editRemarks);
    }

    const submitRemarks = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("Token not Found !");
            throw new Error("Token not Found !");
        }

        try {
            let remark = dateForAdd.remarks;
            const response = await fetch(`${urlLocal}/api/v1/leave/add/remarks`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ id: dataEmp._id, remark })
            });

            if (!response) {
                throw new Error('Network response was not ok');
            } else {
                const fetchedResponse = await response.json();

                if (response.status === 200) {
                    alert(fetchedResponse.message);
                    setEditRemarks(!editRemarks);
                    getEmpLeaveData();
                } else if (response.status === 400) {
                    alert(fetchedResponse.message);
                }
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    // --------------- send leave date to server ---------ok---------------
    const handleConfirm = (e) => {
        e.preventDefault();
        if (confirm("Sure to Add Leave ?")) {
            addLeaveDate(); // if confirm run function 
        }
    }
    // -------------------------------------- Add leave date to employee--------ok---------------   
    const addLeaveDate = async () => {

        let dt = `${dateForAdd.year} ${dateForAdd.month} ${dateForAdd.day} 11: 10:05 UTC`
        let leaves = {
            leavedate: new Date(dt),
            leavetype: dateForAdd.leaveType
        }
        console.log(dataEmp._id);
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                alert("Token not found");
                throw new Error("Token not found");
            }

            const response = await fetch(`${urlLocal}/api/v1/leave/add/leave`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ leaves, id: dataEmp._id })
                });
            if (!response) {
                throw new Error('Network response was not ok');
            } else {
                const fetchedResponse = await response.json();

                if (response.status === 200) {
                    // alert(fetchedResponse.message);
                    getEmpLeaveData();
                } else if (response.status === 400) {
                    alert(fetchedResponse.message);
                }
            }

        } catch (error) {
            console.log(error.message);
        }
    }
    // ---------------------------- fetch all leave  -------------------ok----------------------
    const getEmpLeaveData = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                alert("Token not found");
                throw new Error("Token not found");
            }

            const response = await fetch(`${urlLocal}/api/v1/leave/get/emp/${params.id}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    }
                });
            if (!response) {
                throw new Error('Network response was not ok');
            }
            const fetchedData = await response.json();
            //------- set data to variables
            setDataEmp(fetchedData.isData); // object data - emp name etc   
            // ---------show leaves slots of 15 --- 3 rows
            dataLeaves.lvArray1 = fetchedData.sortedLeaves.slice(0, 15);
            dataLeaves.lvArray2 = fetchedData.sortedLeaves.slice(15, 30);
            dataLeaves.lvArray3 = fetchedData.sortedLeaves.slice(30, dataLeaves.length);
            // -------set remarks
            dateForAdd.remarks = fetchedData.isData.remarks;

            // ---set total leave from server
            setTotLeaves(fetchedData.totLeavesByType);
            // console.log(totLeaves);

        } catch (error) {
            console.log(error.message);
        }
    }
    // ----------------delete leave-----------ok-----------------------
    const deleteLeave = async (item) => {
        let dateForDelete = new Date(item);

        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                alert("Token not found");
                throw new Error("Token not found");
            }
            const response = await fetch(`${urlLocal}/api/v1/leave/delete/leave`,
                {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ dateForDelete, id: dataEmp._id })
                });

            if (!response) {
                throw new Error('Network response was not ok');

            } else {
                const fetchedResponse = await response.json();
                if (fetchedResponse) {
                    alert(fetchedResponse.message);
                    getEmpLeaveData();
                }
            }

        } catch (error) {
            console.log(error.message);
        }
    }
    // ---------------------------------------toggle btn handle---ok---------
    const handleToggleBtn = () => {
        if (!toggle) {
            const userInput = prompt('Enter Password');
            if (userInput === "")
                setToggle(!toggle);
        } else {
            setToggle(!toggle);
        }
    }
    // ---------------------use effect-----------------------
    useEffect(() => {
        getEmpLeaveData();
    }, []);

    // CSS Variables
    let cssthtd = "px-2 py-1 text-left border-2 w-[30%]"; // emp tbl
    let csstd = "px-2 py-1 text-left border-2 w-[70%] "; // for emp table
    let csstd2 = "p-1 text-center mx-auto text-sm md:text-lg border-2 w-[70%]"; // for leave list 
    let cssForShowLock = "px-2 py-1 text-center border-2 w-[20%] font-bold"; // for show lock btn side by dates
    let cssDtInput = 'border-2 border-gray-800 px-2 py-1 text-lg bg-gray-100 font-semibold rounded-md text-gray-800  w-16 text-center ';
    let cssDtBtn = 'bg-blue-500 active:scale-95 hover:bg-blue-400 border-2 px-3 py-2 text-lg font-semibold rounded-md text-white';
    let cssTotalCLTableTD = "text-center w-32 border-2 px-3 ";
    // ---------------------------------------- return -----------------------------------    
    return (
        <>
            <Navbar />
            <div className='min-h-screen'>
                <h1 className='text-center text-3xl font-bold py-2'>Add Leaves</h1>

                {/* --------toggle delete leave btn----ok----- */}
                <button onClick={handleToggleBtn} className={toggle ? "px-3 py-2 bg-red-500 rounded-md" : " px-3 py-2 bg-blue-500 rounded-md text-white"} >{toggle ? "click to Lock" : "click to Delete Leaves"}</button>

                <div className='w-[100%] mx-auto '>
                    <section className='w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-2 '>
                        {/* --------------------employee data show----ok--------- */}
                        <table className='w-[80%] mx-auto mb-5'>
                            <tbody>
                                <tr >
                                    <th className={cssthtd}>S.No </th>
                                    <td className={csstd}>{dataEmp?.s_no}</td>
                                </tr>
                                <tr>
                                    <th className={cssthtd}>Emp Code </th>
                                    <td className={csstd}>{dataEmp?.emp_code}</td>
                                </tr>
                                <tr>
                                    <th className={cssthtd}>Name</th>
                                    <td className={csstd}>{dataEmp?.emp_name}</td>
                                </tr>
                                <tr>
                                    <th className={cssthtd}>Designation</th>
                                    <td className={csstd}>{dataEmp?.emp_designation}</td>
                                </tr>
                            </tbody>
                        </table>
                        {/* ----------------------- input date to add send to server -------ok----------- */}
                        <div className=' flex h-20 justify-center gap-5 items-end'>

                            <div className='before:content-["Leave_Type"] before:text-sm before:text-center before:p-1 flex flex-col'>
                                <select name="leaveType" onChange={handleInput} value={dateForAdd.leaveType} className={`${cssDtInput} w-28 text-center `}>
                                    <option value="null" disabled >-type-</option>
                                    <option value="cl">CL</option>
                                    <option value="hd">HD</option>
                                    <option value="sl">SL</option>
                                    <option value="rh">RH</option>
                                    <option value="nksy">NK/SY</option>
                                </select>
                            </div>

                            <div className='before:content-["Day"] before:text-sm before:text-center before:p-1 flex flex-col'>
                                <input type="number" name='day' value={dateForAdd.day} onChange={handleInput} className={`${cssDtInput}`} min="1" max="31" onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleConfirm(e);
                                        // console.log('dddd');
                                    }
                                }
                                } />
                            </div>

                            <div className='before:content-["Month"] before:text-sm before:text-center before:p-1 flex flex-col'>
                                <input type="number" name='month' value={dateForAdd.month} onChange={handleInput} className={`${cssDtInput}`} min="1" max="12" />
                            </div>

                            <div className='before:content-["Year"] before:text-sm before:text-center before:p-1 flex flex-col'>
                                <input type="number" name='year' value={dateForAdd.year} onChange={handleInput} className={`${cssDtInput} w-20`} min="2024" max="2024" />
                            </div>

                            {/* btn */}
                            <div className=''>
                                <button onClick={handleConfirm} className={cssDtBtn}>Submit</button>
                            </div>
                        </div>
                    </section>

                    {/* --------------------------- show total leaves calculations ---------------------- */}
                    <section className='my-2'>
                        <h2 className='text-center text-lg font-bold'>Grand Total</h2>
                        <div className='flex justify-center items-center '>
                            {/* -------table Grand total --------*/}
                            <table className='mx-auto flex gap-2 '>
                                <tbody className='border-2 border-gray-500'>
                                    <tr>
                                        <th className={cssTotalCLTableTD}>Total CL </th>
                                        <td className={cssTotalCLTableTD}>{totLeaves.totalCL + Math.trunc(totLeaves.totalHD / 2) + Math.trunc(totLeaves.totalSL / 3)}</td>

                                    </tr>
                                    <tr>
                                        <th className={cssTotalCLTableTD}>Extra HD </th>
                                        <td className={cssTotalCLTableTD}>{`${totLeaves.totalHD - (Math.trunc(totLeaves.totalHD / 2) * 2)}`}</td>
                                    </tr>
                                    <tr>
                                        <th className={cssTotalCLTableTD}>Extra SL</th>
                                        <td className={cssTotalCLTableTD}>{`${totLeaves.totalSL - (Math.trunc(totLeaves.totalSL / 3) * 3)}`}</td>
                                    </tr>

                                </tbody>

                                <tbody className='border-2 border-gray-500'>
                                    <tr >
                                        <th className={cssTotalCLTableTD}> RH </th>
                                        <td className={cssTotalCLTableTD}>{totLeaves.totalRH}</td>
                                    </tr>
                                    <tr>
                                        <th className={cssTotalCLTableTD}> NKSY</th>
                                        <td className={cssTotalCLTableTD}>{totLeaves.totalNKSY}</td>
                                    </tr>
                                </tbody>
                            </table>

                        </div>
                    </section>

                    {/* ----------------- total leave show by type from server------------------ */}
                    <section>
                        <h2 className='text-center text-lg font-bold'>Total</h2>
                        <table className="mx-auto">
                            <thead>
                                <tr>
                                    <th className={cssTotalCLTableTD} hidden={totLeaves.totalCL === 0}> CL</th>
                                    <th className={cssTotalCLTableTD} hidden={totLeaves.totalHD === 0}> HD</th>
                                    <th className={cssTotalCLTableTD} hidden={totLeaves.totalSL === 0}> SL</th>
                                    <th className={cssTotalCLTableTD} hidden={totLeaves.totalRH === 0}> RH</th>
                                    <th className={cssTotalCLTableTD} hidden={totLeaves.totalNKSY === 0}> NKSY</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className={cssTotalCLTableTD} hidden={totLeaves.totalCL === 0}>{totLeaves.totalCL}</td>
                                    <td className={cssTotalCLTableTD} hidden={totLeaves.totalHD === 0}>{totLeaves.totalHD}</td>
                                    <td className={cssTotalCLTableTD} hidden={totLeaves.totalSL === 0}>{totLeaves.totalSL}</td>
                                    <td className={cssTotalCLTableTD} hidden={totLeaves.totalRH === 0}>{totLeaves.totalRH}</td>
                                    <td className={cssTotalCLTableTD} hidden={totLeaves.totalNKSY === 0}>{totLeaves.totalNKSY}</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    {/* ------------------------------------- show leaves ------------------ok-------------------- */}

                    {/* --------- leave row 1 -------------- */}
                    <section className='lg:w-[60%] w-[95%] mx-auto flex py-5 gap-5 '>
                        <div className='mx-auto  lg:w-[30%] w-[50%]'>
                            {dataLeaves.lvArray1.map((item, index) => {
                                return (
                                    <ul key={index} className='flex  mx-auto lg:w-[80%] w-[100%] ' >
                                        <li className="mx-auto p-1 text-center text-sm lg:text-lg border-2 w-[30%]">{item.leavetype.toUpperCase()}</li>
                                        <li className={csstd2}>{new Date(item.leavedate).toLocaleDateString("en-GB")}</li>
                                        {toggle ?
                                            <li className={cssForShowLock}><button onClick={() => (deleteLeave(item.leavedate))}>X</button></li>
                                            : ""
                                        }
                                    </ul>
                                )
                            })}
                        </div>
                        {/* --------- leave row 2 -------------- */}
                        <div className='mx-auto  lg:w-[30%] w-[50%]'>
                            {dataLeaves.lvArray2.map((item, index) => {
                                return (
                                    <ul key={index} className='flex  mx-auto lg:w-[80%] w-[100%] ' >
                                        <li className="mx-auto p-1 text-center text-sm lg:text-lg border-2 w-[30%]">{item.leavetype.toUpperCase()}</li>
                                        <li className={csstd2}>{new Date(item.leavedate).toLocaleDateString("en-GB")}</li>
                                        {toggle ?
                                            <li className={cssForShowLock}><button onClick={() => (deleteLeave(item.leavedate))}>X</button></li>
                                            : ""
                                        }
                                    </ul>
                                )
                            })}
                        </div>
                        {/* --------- leave row 3 -------------- */}
                        <div className='mx-auto  lg:w-[30%] w-[50%]'>
                            {dataLeaves.lvArray3.map((item, index) => {
                                return (
                                    <ul key={index} className='flex  mx-auto lg:w-[80%] w-[100%] ' >
                                        <li className="mx-auto p-1 text-center text-sm lg:text-lg border-2 w-[30%]">{item.leavetype.toUpperCase()}</li>
                                        <li className={csstd2}>{new Date(item.leavedate).toLocaleDateString("en-GB")}</li>
                                        {toggle ?
                                            <li className={cssForShowLock}><button onClick={() => (deleteLeave(item.leavedate))}>X</button></li>
                                            : ""
                                        }
                                    </ul>
                                )
                            })}
                        </div>
                    </section>



                    {/* ------------------- show remarks in p tag-------ok-------- */}
                    <div >
                        {editRemarks ?
                            <div className='w-[90%] md:w-[60%]  mx-auto mt-20' hidden={dateForAdd.remarks === undefined || dateForAdd.remarks === ""}>
                                <p className='p-2' > Remarks</p>
                                <p className='text-left px-3 py-2  border-2 w-[100%]'>{dateForAdd.remarks}</p>
                            </div>
                            : ""}
                    </div>

                    {/* ------------------ show Text Area for Remarks */}
                    <div className='my-20'>

                        {/* ------textarea remarks */}
                        {editRemarks ? "" :
                            <div className='flex justify-center items-center flex-col text-center after:content-["Max_Chars_allowed:_500"]'>
                                <div className='flex w-[30%] justify-between'>
                                    <span>Remarks</span>
                                    <span>Chars: {charCount}</span>
                                </div>

                                <textarea name="remarks" value={dateForAdd.remarks} onChange={handleInput} cols="80" rows="8" maxLength="500" className='border-2 border-gray-500 rounded-md px-3 py-2 w-[80%] md:w-[40%]  ' disabled={editRemarks} />
                            </div>}

                        {/* ------button for remarks */}
                        <div className="items-center text-center flex gap-10 mx-auto w-[60%] justify-center ">
                            {editRemarks ?
                                <button onClick={() => setEditRemarks(!editRemarks)} className='bg-cyan-500 px-3 py-2 rounded text-white active:scale-95' >Edit Remarks</button> : ""}

                            <button onClick={handleCancel} className='bg-blue-500 px-3 py-2 rounded text-white active:scale-95' hidden={editRemarks}>Cancel</button>

                            <button onClick={handleRemarksBtn} className='bg-blue-500 px-3 py-2 rounded text-white active:scale-95' hidden={editRemarks}>Add Remarks</button>

                        </div>
                    </div>
                </div>
            </div >
        </>
    )
}

export default AddLeaves;