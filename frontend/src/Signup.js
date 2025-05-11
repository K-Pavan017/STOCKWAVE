import React,{useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import Validation from './SignupValidation'
import axios from 'axios'

function Signup() {

    const [values,setValues] = useState({
        name:'',
        email:'',
        password:''
    })

    const navigate = useNavigate();

    const handleInput = (event)=>{
        setValues(prev => ({...prev,[event.target.name]: event.target.value}));

    }
    const [errors,setErrors] =useState({})

        const handleSubmit = (event) => {
            event.preventDefault();
            const validationErrors = Validation(values);
            setErrors(validationErrors);
        
            if (
              validationErrors.name === "" &&
              validationErrors.email === "" &&
              validationErrors.password === ""
            ) {
                axios.post('http://localhost:3001/signup', values)
                    .then(res => {
                            navigate('/');
                    })
                    .catch(err => console.log(err));
            }
        };
        

  return (
    <div className='d-flex justify-content-center align-items-center bg-primary vh-100'>
        <div className='bg-white p-3 rounded w-25'>
            <h2>Sign Up</h2>
            <form action="" onSubmit={handleSubmit}>
            <div className='mb-3'>
                    <label htmlFor="name"><strong>Name</strong></label>
                    <input type="name" placeholder='Enter Name' name='name' onChange={handleInput}
                    className='form-control rounded-0' />
                    {errors.name && <span>{errors.name}</span>}
                </div>
                <div className='mb-3'>
                    <label htmlFor="email"><strong>Email</strong></label>
                    <input type="email" placeholder='Enter Email' name='email' onChange={handleInput} className='form-control rounded-0' />
                    {errors.email && <span>{errors.email}</span>}
                </div>
                <div className='c'>
                    <label htmlFor="password"><strong>Password</strong></label>
                    <input type="password" placeholder='Enter Password' name='password' onChange={handleInput} className='form-control rounded-0'/>
                    {errors.password && <span>{errors.password}</span>}
                </div>
                <button type='submit' className='btn btn-success w-100  rounded-0'>Sign up</button>
                <p>You are agreed our terms and policies to use this app.</p>
                <Link to='/' className='btn btn-default border w-100 bg-light rounded-0'>Login</Link>
            </form>
        </div>
    </div>
  )
}

export default Signup;