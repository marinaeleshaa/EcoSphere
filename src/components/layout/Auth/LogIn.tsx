import { toggleAuthView } from '@/frontend/redux/Slice/AuthSlice'
import { AppDispatch } from '@/frontend/redux/store'
import Link from 'next/link'
import Image from "next/image";
import { FaApple, FaFacebookF, FaGoogle, FaTwitter } from 'react-icons/fa'
import { IoIosArrowRoundForward } from 'react-icons/io'
import { useDispatch } from 'react-redux'

const LogIn = () => {
 const dispatch = useDispatch<AppDispatch>();
     const handleToggle = () => {
            dispatch(toggleAuthView())
        }
  return (
    <div className='flex sm:flex gap-5 flex-col'>
                    <p className="capitalize text-center font-extrabold mb-5 text-secondary-foreground text-4xl">
              Login
            </p>

            <input
              type="email"
              placeholder="Email"
              className="bg-input text-input-foreground p-3 rounded-full transition duration-300 focus:outline-none pl-10"
            />
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                className="bg-input text-input-foreground w-full p-3 rounded-full transition duration-300 focus:outline-none pl-10"
              />
            </div>
            {/* forget password */}
            <Link href="#">
              <div className="flex justify-end px-5">
                <div className="flex gap-1 justify-center items-center text-sm group cursor-pointer">
                  <p className="text-secondary-foreground transition-all duration-300 ">
                    Forget Password
                  </p>
                  <IoIosArrowRoundForward className=" transform transition-all duration-300 ease-out group-hover:translate-x-1 " />
                </div>
              </div>
            </Link>

            <button className="myBtnPrimary">
              Login
              <Image
                src={"/leaf.png"}
                width={25}
                height={25}
                alt="leaf"
                className="scale-x-[-1]"
              />
            </button>

            {/* divider */}
            <div className="flex items-center gap-2">
              <div className="h-px bg-secondary-foreground/50 w-full"></div>
              <p className="text-stone-500">or</p>
              <div className="h-px bg-secondary-foreground/50 w-full"></div>
            </div>

            {/* social login */}
            <div className="flex justify-evenly items-center my-4 text-4xl text-secondary-foreground ">
              <Link
                href={"#"}
                className="hover:scale-115 hover:shadow-2xl shadow-primary transition duration-300"
              >
                <FaGoogle />
              </Link>
              <Link
                href={"#"}
                className="hover:scale-115 hover:shadow-2xl shadow-primary transition duration-300"
              >
                <FaFacebookF />
              </Link>
              <Link
                href={"#"}
                className="hover:scale-115 hover:shadow-2xl shadow-primary transition duration-300"
              >
                <FaApple />
              </Link>
              <Link
                href={"#"}
                className="hover:scale-115 hover:shadow-2xl shadow-primary transition duration-300"
              >
                <FaTwitter />
              </Link>
            </div>
            <p className="text-center text-stone-600 space-x-1 sm:hidden ">
              <span>New to EcoSphere ?</span>
              <button
                onClick={handleToggle}
                className="text-primary cursor-pointer"
              >
                Sign up
              </button>
            </p>
    </div>
  )
}

export default LogIn