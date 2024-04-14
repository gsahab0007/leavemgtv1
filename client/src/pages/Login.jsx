import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function Login() {
    const navigate = useNavigate();
    const [userLoginData, setUserLoginData] = useState({

        email: "",
        password: "",
    });
    // ---------------handle input values------add emp--------------
    const handleInput = (e) => {
        e.preventDefault();
        let name = e.target.name;
        let value = e.target.value;
        setUserLoginData({
            ...userLoginData, [name]: value
        })
    }


    const handleSubmitForm = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/api/v1/user/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(userLoginData)
            });
            const fetchedData = await response.json();
            if (response.status === 200) {
                navigate('/allemployee')
                alert("Login Successful !");
                let token = fetchedData.token;
                localStorage.setItem("accessToken", token)
            }

        } catch (error) {
            console.log(error.message);
        }

    }
    let cssInputDiv = "w-[100%]  flex mx-auto lg:mb-4 mb-2 justify-center items-center";
    let cssLabel = "w-40 text-sm md:text-base ";
    let cssInput = "border-2 border-gray-400 w-72 h-10 p-2 text-sm md:text-base rounded-md";

    // -------------------------------- return  ----------------------------------------------
    return (
        <>
            <Navbar />
            <section className=' w-[80%] md:w-[60%] lg:w-[50%] mx-auto bg-blue-100 rounded-lg md:py-10  my-5'>
                <h1 className='text-center text-2xl font-bold pb-10'>Login</h1>

                <form onSubmit={handleSubmitForm}>
                    <div className={cssInputDiv}>
                        <label htmlFor="email" className={cssLabel}>Email</label>
                        <input type="email" id='email' name="email" value={userLoginData.email} onChange={handleInput} className={cssInput} required />
                    </div>
                    <div className={cssInputDiv}>
                        <label htmlFor="password" className={cssLabel}>Password</label>
                        <input type="password" id='password' name="password" value={userLoginData.password} onChange={handleInput} className={cssInput} required />
                    </div>


                    <div className={cssInputDiv}>
                        <button type="submit" className='bg-blue-500 mt-5 px-3 py-2 rounded-md text-white w-32 hover:bg-blue-400 active:scale-95'>Submit</button>
                    </div>

                </form>
            </section>

        </>
    )
}

export default Login