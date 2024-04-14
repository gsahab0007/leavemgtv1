import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { urlLocal, urlNet } from '../urls/baseurl';


function ShowSingleEmpLeave() {
    const params = useParams();

    const [dataEmp, setDataEmp] = useState({});// object data - emp name etc        

    const [dataLeaves, setDataLeaves] = useState({   // array data - dates
        cl: [], hd: [], sl: [], rh: [], nksy: [],
    });
    const [dateForAdd, setDateForAdd] = useState({
        // day: "1", month: "1", year: "2024", leaveType: "cl", 
        remarks: ""     //date for leave add
    });

    const [totLeaves, setTotLeaves] = useState({  // Calculation of leaves table
        totCL: "", totHD: "", totSL: "", totRH: "", totNKSY: ""
    });
    // -------------usestate end ---------------

    // ---------------------------- fetch all leave  -----------------------------------------
    const getEmpLeaveData = async () => {
        try {
            const response = await fetch(`${urlLocal}/api/v1/leave/get/emp/${params.id}`,
                {
                    method: "GET"
                });
            if (!response) {
                throw new Error('Network response was not ok');
            }
            const fetchedData = await response.json();
            // set data to variables
            setDataEmp(fetchedData.isData); // object data - emp name etc                     
            dataLeaves.cl = fetchedData.datesArrayCL;
            dataLeaves.hd = fetchedData.datesArrayHD;
            dataLeaves.sl = fetchedData.datesArraySL;
            dataLeaves.rh = fetchedData.datesArrayRH;
            dataLeaves.nksy = fetchedData.datesArrayNKSY;

            dateForAdd.remarks = fetchedData.isData.remarks; // set remarks from server

            // -------total leaves set to usestate variables for show in table---
            totLeaves.totCL = dataLeaves.cl.length;
            totLeaves.totHD = dataLeaves.hd.length;
            totLeaves.totSL = dataLeaves.sl.length;
            totLeaves.totRH = dataLeaves.rh.length;
            totLeaves.totNKSY = dataLeaves.nksy.length;
            // ----------
        } catch (error) {
            console.log(error.message);
        }
    }
    useEffect(() => {
        getEmpLeaveData();
    }, [totLeaves]);

    // CSS Variables
    let cssthtd = "px-1  text-left border-2 w-[30%]"; // emp tbl
    let csstd = "px-1 py-1 text-left border-2 w-[70%] "; // for emp table
    let csstd2 = "px-1 text-center text-sm border w-[100%]"; // for leave list     
    let cssTotalCLTableTD = "text-center w-28 border-2 px-1 ";
    let cssShowLeavesHeading = 'text-center px-1 font-semibold border-2 text-sm w-[100%]';
    // ---------------------------------------- return -----------------------------------  
    return (
        <>
            <div className='min-h-screen'>
                <h1 className='text-center text-3xl font-bold py-2'>Leaves</h1>



                <div className='w-[100%] mx-auto '>
                    <section className='w-[90%] mx-auto '>
                        {/* --------------------employee data show------------- */}
                        <table className='w-[60%] mx-auto mb-5 text-sm'>
                            <tbody>
                                <tr>
                                    <th className={cssthtd}>Name</th>
                                    <td className={csstd}>{dataEmp?.emp_name}</td>
                                </tr>
                                <tr >
                                    <th className={cssthtd}>Designation </th>
                                    <td className={csstd}>{dataEmp?.emp_designation}</td>
                                </tr>
                                <tr>
                                    <th className={cssthtd}>Emp Code </th>
                                    <td className={csstd}>{dataEmp?.emp_code}</td>
                                </tr>
                            </tbody>
                        </table>
                    </section>

                    {/* --------------------------- show total leaves calculations ---------------------- */}
                    <section>
                        <div className='flex justify-center items-center gap-5 my-3'>
                            {/* -------table 1 --------*/}
                            {/* <div className='justify-center items-center flex text-sm'>
                                <table>
                                    <thead>
                                        <tr >
                                            <th className={cssTotalCLTableTD}></th>
                                            <th className={cssTotalCLTableTD}>Count</th>
                                            <th className={cssTotalCLTableTD}>CL (r. off)</th>
                                            <th className={cssTotalCLTableTD}>Extra HD/SL</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className={cssTotalCLTableTD}>Total CL</td>
                                            <td className={cssTotalCLTableTD}>{`${totLeaves.totCL}`}</td>
                                            <td className={cssTotalCLTableTD}>{`${totLeaves.totCL}`}</td>
                                            <td className={cssTotalCLTableTD}></td>
                                        </tr>
                                        <tr>
                                            <td className={cssTotalCLTableTD}>Total HD</td>
                                            <td className={cssTotalCLTableTD}>{`${totLeaves.totHD}`}</td>
                                            <td className={cssTotalCLTableTD}>{`${Math.trunc(totLeaves.totHD / 2)}`}</td>
                                            <td className={cssTotalCLTableTD}>{`${totLeaves.totHD - (Math.trunc(totLeaves.totHD / 2) * 2)}`}</td>
                                        </tr>
                                        <tr>
                                            <td className={cssTotalCLTableTD}>Total SL</td>
                                            <td className={cssTotalCLTableTD}>{`${totLeaves.totSL}`}</td>
                                            <td className={cssTotalCLTableTD}>{`${Math.trunc(totLeaves.totSL / 3)}`}</td>
                                            <td className={cssTotalCLTableTD}>{`${totLeaves.totSL - (Math.trunc(totLeaves.totSL / 3) * 3)}`}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div> */}
                            {/* -------table 2 --------*/}
                            <table className='justify-center items-center flex gap-5 '>
                                <tbody className='border-2 border-gray-500 text-sm'>
                                    <tr>
                                        <th className={cssTotalCLTableTD}>Total CL </th>
                                        <td className={cssTotalCLTableTD}>{totLeaves.totCL + Math.trunc(totLeaves.totHD / 2) + Math.trunc(totLeaves.totSL / 3)}</td>
                                    </tr>
                                    <tr>
                                        <th className={cssTotalCLTableTD}>Extra HD </th>
                                        <td className={cssTotalCLTableTD}>{`${totLeaves.totHD - (Math.trunc(totLeaves.totHD / 2) * 2)}`}</td>
                                    </tr>
                                    <tr>
                                        <th className={cssTotalCLTableTD}>Extra SL</th>
                                        <td className={cssTotalCLTableTD}>{`${totLeaves.totSL - (Math.trunc(totLeaves.totSL / 3) * 3)}`}</td>
                                    </tr>

                                </tbody>

                                <tbody className='border-2 border-gray-500 text-sm'>
                                    <tr >
                                        <th className={cssTotalCLTableTD}> RH </th>
                                        <td className={cssTotalCLTableTD}>{totLeaves.totRH}</td>
                                    </tr>
                                    <tr>
                                        <th className={cssTotalCLTableTD}> NKSY</th>
                                        <td className={cssTotalCLTableTD}>{totLeaves.totNKSY}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </section>


                    {/* ------------------------------------- show leaves -------------------------------------- */}
                    <section className='w-[90%]  mx-auto grid grid-cols-5 mt-5  ' >

                        {/* ------------------- show CL list --------------- */}
                        {
                            dataLeaves.cl.length > 0 &&
                            <div className='w-[70%] mx-auto '>
                                <h2 className={cssShowLeavesHeading}>CL: {dataLeaves.cl?.length}</h2>

                                {dataLeaves.cl?.map((item, index) => {
                                    return (
                                        <ul key={index} className='flex '>
                                            <li className={csstd2}>{new Date(item).toLocaleDateString("en-GB")}</li>
                                        </ul>
                                    )
                                })}
                            </div>
                        }

                        {/* ------------------- show HD list --------------- */}
                        {
                            dataLeaves.hd.length > 0 &&
                            <div className='w-[70%] mx-auto '>
                                <h2 className={cssShowLeavesHeading}>Half Days: {dataLeaves.hd?.length}</h2>

                                {dataLeaves.hd?.map((item, index) => {
                                    return (
                                        <ul key={index} className='flex '>
                                            <li className={csstd2} > {new Date(item).toLocaleDateString("en-GB")}</li>
                                        </ul>
                                    )
                                })}
                            </div>
                        }

                        {/* ------------------- show SL list --------------- */}
                        {
                            dataLeaves.sl.length > 0 &&
                            <div className='w-[70%] mx-auto '>
                                <h2 className={cssShowLeavesHeading}>SL: {dataLeaves.sl?.length}</h2>

                                {dataLeaves.sl?.map((item, index) => {
                                    return (
                                        <ul key={index} className='flex '>
                                            <li className={csstd2} > {new Date(item).toLocaleDateString("en-GB")}</li>
                                        </ul>
                                    )
                                })}
                            </div>
                        }

                        {/* ------------------- show RH list --------------- */}
                        {
                            dataLeaves.rh.length > 0 &&
                            <div className='w-[70%] mx-auto '>
                                <h2 className={cssShowLeavesHeading}>RH: {dataLeaves.rh?.length}</h2>

                                {dataLeaves.rh?.map((item, index) => {
                                    return (
                                        <ul key={index} className='flex '>
                                            <li className={csstd2} > {new Date(item).toLocaleDateString("en-GB")}</li>
                                        </ul>
                                    )
                                })}
                            </div>
                        }

                        {/* ------------------- show NKSY list --------------- */}
                        {
                            dataLeaves.nksy.length > 0 &&
                            <div className='w-[70%] mx-auto '>
                                <h2 className={cssShowLeavesHeading}>NK/SY: {dataLeaves.nksy?.length}</h2>

                                {dataLeaves.nksy?.map((item, index) => {
                                    return (
                                        <ul key={index} className='flex '>
                                            <li className={csstd2} > {new Date(item).toLocaleDateString("en-GB")}</li>
                                        </ul>
                                    )
                                })}
                            </div>
                        }

                    </section>


                    {/* ------------------- show remarks in p tag--------------- */}
                    <div >

                        <div className='w-[40%] flex flex-col fixed  bg-red-100 right-5 bottom-28' hidden={dateForAdd.remarks === undefined || dateForAdd.remarks === ""}>
                            <p className='p-1' > Remarks</p>
                            <p className=' px-1 py-1  border-2 w-[100%] text-sm leading-tight'>{dateForAdd.remarks}</p>
                        </div>


                    </div>



                </div>
            </div>

        </>
    )
}

export default ShowSingleEmpLeave