import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { urlLocal, urlNet } from '../urls/baseurl';


function AllEmp() {
    const navigate = useNavigate();
    const [data, setData] = useState([]);
    const [showAddEmpForm, setShowAddEmpForm] = useState(false);
    const [empData, setEmpData] = useState({
        s_no: "",
        emp_code: "",
        emp_name: "",
        emp_designation: "Senior Assistant",
    });
    // ---------------handleSubmitBtn--add emp------------------
    const handleSubmitBtn = (e) => {
        e.preventDefault();
        if (confirm("Sure to Add New Employee ?")) {
            addNewEmp();
        }
    }
    // ----------------add New Emp function ------------------------
    const addNewEmp = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                // alert("Token not found !")
                // throw new Error("Token not found !")
            }
            const response = await fetch(`${urlLocal}/api/v1/leave/add/emp`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,

                },
                body: JSON.stringify(empData)
            });

            let fetchedData = await response.json();

            if (response.status === 200) {
                alert(fetchedData.message);
                setShowAddEmpForm(!showAddEmpForm)
                fetchAllEmp();
            } else {
                alert(fetchedData.message);
            }
        } catch (error) {
            console.log(error.message);
        }
    }
    // ---------------handle input values------add emp--------------
    const handleInput = (e) => {
        e.preventDefault();
        let name = e.target.name;
        let value = e.target.value;
        setEmpData({
            ...empData, [name]: value
        })
    }

    let cssInputDiv = "w-[100%]  flex mx-auto mb-2 justify-center items-center";
    let cssLabel = "w-40 text-sm md:text-base ";
    let cssInput = "border-2 border-gray-400 w-72 h-8 p-2 text-sm md:text-base rounded-md";

    // ------------------------- fetch all employees -------------------------------------
    const fetchAllEmp = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            if (!token) {
                navigate('/login');
                // alert("Login to Continue ");
                // throw new Error("Token not found !");
            }

            const response = await fetch(`${urlLocal}/api/v1/leave/get/allemp`,
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
            setData(fetchedData);
        } catch (error) {
            console.log(error.message);
        }
    }
    // ------------------------- handle delete emp btn -------------------------------------
    const handleDeleteEmpBtn = (e, item) => {
        e.preventDefault();

        let response = prompt("Enter Employee name to delete !")
        if (response) {
            if (response.trim() === item.emp_name) {
                deleteEmp(item);
            } else {
                alert("Employee Name not matched !");
            }
        } else if (response === "") {
            alert("Write Employee Name !");
        }

    }
    // -------------delete employee -----------------
    const deleteEmp = async (item) => {
        const token = localStorage.getItem('accessToken');
        if (!token) {
            alert("Token not found !")
            throw new Error("Token not found ")
        }

        try {
            const response = await fetch(`${urlLocal}/api/v1/leave/delete/emp`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,

                },
                body: JSON.stringify({ id: item._id })
            });
            const fetchedData = await response.json();
            if (response.status === 200) {
                alert(fetchedData.message);
                fetchAllEmp();
            } else {
                alert(fetchedData.message);
            }
        } catch (error) {
            console.log(error.message);
        }

    }

    // ---------------------------- use effect---------------------------------
    useEffect(() => {
        fetchAllEmp();
    }, []);
    // ---------------------------------------------- return  ----------------------------------------------------------
    return (
        <>
            <Navbar />
            <div className='min-h-screen'>
                <h1 className='text-center text-2xl font-bold py-3'>All Employees Data</h1>

                {/* -------show add employee button---------- */}
                <label className="inline-flex items-center cursor-pointer ">
                    <input type="checkbox" value={showAddEmpForm} checked={showAddEmpForm} className="sr-only peer" onChange={() => setShowAddEmpForm(!showAddEmpForm)} />
                    <div className="relative w-11 h-6 bg-gray-200 outline outline-cyan-300  dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-cyan-500"></div>
                    <span className="ms-3 text-lg font-medium text-gray-900 dark:text-gray-300">Add New Employee </span>
                </label>


                {/* ---------add employee form----------- */}
                {showAddEmpForm &&
                    <section className=' w-[80%] md:w-[60%] lg:w-[30%] mx-auto bg-cyan-100 rounded-lg  my-2'>
                        <h1 className='text-center text-xl font-bold py-2'>Add New Employee</h1>

                        <form onSubmit={handleSubmitBtn}>
                            <div className={cssInputDiv}>
                                <label htmlFor="s_no" className={cssLabel}>S.No</label>
                                <input type="number" id='s_no' name="s_no" value={empData.s_no} onChange={handleInput} className={cssInput} required />
                            </div>
                            <div className={cssInputDiv}>
                                <label htmlFor="emp_code" className={cssLabel}>Employee Code</label>
                                <input type="number" id='emp_code' name="emp_code" value={empData.emp_code} onChange={handleInput} className={cssInput} required />
                            </div>
                            <div className={cssInputDiv}>
                                <label htmlFor="emp_name" className={cssLabel}>Employee Name</label>
                                <input type="text" id='emp_name' name="emp_name" value={empData.emp_name} onChange={handleInput} className={cssInput} required />
                            </div>

                            <div className={cssInputDiv}>
                                <label htmlFor="emp_designation" className={cssLabel}>Designation</label>
                                <select name="emp_designation" id="emp_designation" value={empData.emp_designation} onChange={handleInput} className="border-2 border-gray-400 px-3 w-72 h-8  text-sm md:text-base rounded-md">
                                    <option value="null" disabled >--Designation--</option>
                                    <option value="Deputy Registrar">Deputy Registrar</option>
                                    <option value="System Manager">System Manager</option>
                                    <option value="Technical Officer-II">Technical Officer-II</option>
                                    <option value="Senior Assistant">Senior Assistant</option>
                                    <option value="Junior Assistant">Junior Assistant</option>
                                    <option value="Clerk">Clerk</option>
                                    <option value="Peon">Peon</option>
                                </select>
                            </div>

                            <div className={cssInputDiv}>
                                <button type='submit' className='bg-blue-500 my-2 px-3 py-2 rounded-md text-white w-32 hover:bg-blue-400 active:scale-95'>Submit</button>
                            </div>

                        </form>
                    </section>}

                {/* ----------------------show all employees------------------------ */}
                <section>
                    <div className='w-[95%] mx-auto '>
                        <table className='w-[100%] lg:w-[80%] mx-auto text-sm md:text-lg '>
                            <thead>
                                <tr className='text-center bg-cyan-300 h-10'>
                                    <th className='text-center px-2 w-[5%]'>S.No</th>
                                    <th className='text-left px-2 w-[10%]'>Emp Code</th>
                                    <th className='text-left px-2 w-[15%]'>Emp Name</th>
                                    <th className='text-left px-2 w-[15%]'>Designation</th>
                                    <th className='text-left px-2 w-[10%]'>Show</th>
                                    <th className='text-center px-2 w-[10%]'>Add Leaves</th>
                                    <th className='text-center px-2 w-[10%]'>Delete Employee</th>
                                    <th className='text-center px-2 w-[10%]'>Edit Employee</th>
                                </tr>
                            </thead>
                            <tbody >

                                {data.map((item) => {
                                    return (
                                        <tr key={item.s_no} className='text-center h-10 border-2 border-b-2 even:bg-gray-100 hover:bg-cyan-200'>
                                            <td className='text-center px-2 w-[5%]'>{item.s_no}</td>
                                            <td className='text-left px-2 w-[10%]'>{item.emp_code}</td>
                                            <td className='text-left px-2 w-[15%]'>{item.emp_name}</td>
                                            <td className='text-left px-2 w-[15%]'>{item.emp_designation}</td>
                                            <td className='text-left px-2 w-[10%]'><Link to={`/showsingleempleave/${item._id}`} target='_blank'>Show</Link></td>

                                            <td className='text-center px-2 w-[10%]'><Link to={`/addleave/${item._id}`} className='bg-blue-500 hover:bg-blue-400 active:scale-95 px-3 py-2 rounded-md text-sm text-white'>Add</Link></td>

                                            <td className='text-center px-2 w-[10%]'><button onClick={(e) => (handleDeleteEmpBtn(e, item))} className='bg-red-600 hover:bg-red-400 active:scale-95 px-3 py-2 rounded-md text-sm text-white'>Del</button></td>

                                            <td className='text-center px-2 w-[10%]'><Link to={`/editemp/${item._id}`} className='bg-yellow-600 hover:bg-yellow-500 active:scale-95 px-3 py-2 rounded-md text-sm text-white'>Edit</Link></td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>

            </div>


        </>
    )
}

export default AllEmp