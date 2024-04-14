import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import { useNavigate, useParams } from 'react-router-dom';
import { urlLocal, urlNet } from '../urls/baseurl';


function EditEmp() {
    const navigate = useNavigate();
    const params = useParams();

    const [empData, setEmpData] = useState({
        s_no: "",
        emp_code: "",
        emp_name: "",
        emp_designation: "",
    });

    // ---------------handle input values------add emp--------------
    const handleInput = (e) => {
        e.preventDefault();
        let name = e.target.name;
        let value = e.target.value;
        setEmpData({
            ...empData, [name]: value
        })
    }

    // ---------------handleSubmitBtn--add emp------------------
    const handleSubmitBtn = (e) => {
        e.preventDefault();
        if (confirm("Sure to Update Employee Details ?")) {
            updateEmp();
        }
    }
    // -------------------------------------- edit employee--------ok---------------   
    const updateEmp = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            if (!token) {
                alert("Token not found !")
                throw new Error("Token not found !");
            }

            const response = await fetch(`${urlLocal}/api/v1/leave/edit/emp/${params}`,
                {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    },
                    body: JSON.stringify({ empData })
                });
            if (!response) {
                throw new Error('Network response was not ok');
            } else {
                const fetchedResponse = await response.json();

                if (response.status === 200) {
                    alert(fetchedResponse.message);
                    navigate('/allemployee');
                } else if (response.status === 400) {
                    alert(fetchedResponse.message);
                }
            }

        } catch (error) {
            console.log(error.message);
        }
    }
    // ---------------------------- fetch emp details  -------------------ok----------------------
    const getEmpData = async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) {
            alert("Token not found !");
            throw new Error("Token not found !");
        }
        try {
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
            setEmpData(fetchedData.isData); // object data - emp name etc   

        } catch (error) {
            console.log(error.message);
        }
    }
    let cssInputDiv = "w-[100%]  flex mx-auto lg:mb-4 mb-2 justify-center items-center";
    let cssLabel = "w-40 text-sm md:text-base ";
    let cssInput = "border-2 border-gray-400 w-72 h-10 p-2 text-sm md:text-base rounded-md";

    // ---------------------------- use effect---------------------------------
    useEffect(() => {
        getEmpData();
    }, []);
    // -------------------------------- return  ----------------------------------------------
    return (
        <>
            <Navbar />
            <section className=' w-[80%] md:w-[60%] lg:w-[50%] mx-auto bg-blue-100 rounded-lg md:py-10  my-5'>
                <h1 className='text-center text-2xl font-bold pb-10'>Edit Employee Details</h1>

                <form>
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
                            <option value="null" disabled>--Designation--</option>
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
                        <button onClick={handleSubmitBtn} className='bg-blue-500 mt-5 px-3 py-2 rounded-md text-white w-32 hover:bg-blue-400 active:scale-95'>Submit</button>
                    </div>

                </form>
            </section>
        </>
    )
}

export default EditEmp