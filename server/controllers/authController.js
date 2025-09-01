// in this we can create diffrent controller functions like register, login, verifyOtp, resetPassword, etc. for the user authentication process

import bcrypt from 'bcryptjs'; // used for hashing passwords
import jwt from 'jsonwebtoken'; // used for creating and verifying JSON Web Tokens
import userModel from '../models/userModel.js'; // importing the userModel to interact with the user collection in the MongoDB database
import transporter from '../config/nodemailer.js';
import { EMAIL_VERIFY_TEMPLATE,PASSWORD_RESET_TEMPLATE } from '../config/emailTemplates.js'; // importing the nodemailer transporter to send emails

export const register = async(req,res) =>{
    console.log("req.body:", req.body);
    const {name,email,password,role,phone} = req.body ;

   if(!name || !email || !password || !role || !phone){
       return res.json({success : false , message : "missing details"})
    }


         try {

            const existingUser = await userModel.findOne({email}); // checking if the user already exists in the database
            if(existingUser){
                return res.json({success : false , message : "user already exists"})
            }

            const hashedPassword = await bcrypt.hash(password,10);

            const user = new userModel ({name,email,password:hashedPassword,role,phone}); // creating a new user object with the provided details
            await user.save();
 
            const token = jwt.sign({id : user._id},process.env.JWT_SECRET,{expiresIn : '7d'}); // creating a JWT token for the user

      res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  path: "/",             // ✅ must match logout
  maxAge: 7 * 24 * 60 * 60 * 1000,
});


             
            // Generate OTP
const otp = String(Math.floor(100000 + Math.random() * 900000));

user.verifyOtp = otp;
user.verifyOtpExpireAt = Date.now() + 24*60*60*1000; // 24 hours validity
await user.save();

const mailOptions = {
  from: process.env.SENDER_EMAIL,
  to: user.email,
  subject: 'Verify Your Account',
  html: EMAIL_VERIFY_TEMPLATE
    .replace("{{otp}}", otp)
    .replace("{{email}}", user.email),
};

await transporter.sendMail(mailOptions);


            return res.json({
  success: true,
  message: "User registered successfully",
  user: {
    name: user.name,
    email: user.email,
    phone: user.phone,
    role: user.role,

  },
});


         }
         catch (error) {
            res.json({success : false , message : error.message})
         }
}

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ success: false, message: "email and password are required" });
  }

  try {
    const user = await userModel.findOne({ email }); // finding the user by email

    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }

    if (!user.isAccountVerified) {
      return res.json({
        success: false,
        message: "Please verify your email before logging in",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password); // compare provided password
    if (!isMatch) {
      return res.json({ success: false, message: "invalid password" });
    }

    // Create JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d", // JWT validity (server side)
    });

    const isProd = process.env.NODE_ENV === "production";
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

   res.cookie("token", token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  path: "/", // ✅ important for logout + global access
  maxAge: 7 * 24 * 60 * 60 * 1000,
});


    return res.json({
      success: true,
      message: "User logged in successfully",
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        isAccountVerified: user.isAccountVerified,
      },
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ---------------- LOGOUT ----------------
export const logout = async (req, res) => {
  try {
    const isProd = process.env.NODE_ENV === "production";

   res.clearCookie("token", {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  path: "/", // ✅ must match login/register
});


    return res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Function to send verification OTP to the user
export const sendVerifyOtp = async(req,res) => {
    try{
         const userId = req.userId; // extracting userId from the request body
         const user = await userModel.findById(userId); //
         if(user.isAccountVerified){
            return res.json({success : false , message : "account already verified"})
         }

        const otp= String (Math.floor(100000 + Math.random()*900000)) // generating a random 6-digit OTP

        user.verifyOtp = otp; // setting the generated OTP to the user's verifyOtp field
        user.verifyOtpExpireAt = Date.now() + 24*60*60*1000; // setting the OTP expiration time to 10 minutes from now

        await user.save(); // saving the updated user document to the database

        const mailOptions = {
            from: process.env.SENDER_EMAIL, // sender's email address from environment variables
            to: user.email, // recipient's email address
            subject: 'Verify Your Account', // subject of the email
            //text: `Your verification OTP is ${otp}. It is valid for 24 hours.`,
            html : EMAIL_VERIFY_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email) // plain text body of the email with the OTP
        }

        await transporter.sendMail(mailOptions); // sending the email using the transporter object

        return res.json({success : true , message : "OTP sent successfully"}) // sending a success response

    }
    catch(error){
        res.json({success : false , message : error.message})
    }
}


export const verifyEmail = async (req, res) => {
  const userId = req.userId;
  const { otp } = req.body;

  if (!userId || !otp) {
    return res.json({ success: false, message: "userId and otp are required" });
  }

  try {
    const user = await userModel.findById(userId);

    if (!user) {
      return res.json({ success: false, message: "user not found" });
    }

    if (user.verifyOtp === "" || user.verifyOtp !== otp) {
      return res.json({ success: false, message: "invalid OTP" });
    }

    if (user.verifyOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "OTP has expired" });
    }

    user.isAccountVerified = true;
    user.verifyOtp = "";
    user.verifyOtpExpireAt = 0;
    await user.save();

    return res.json({ success: true, message: "Email verified" });
  } catch (error) {
    return res.json({ success: false, message: error.message });
  }
};



//check user is authenticated or not
export const isAuthenticated = (req, res) => {
  try {
    if (req.userId) {
      return res.json({ success: true, userId: req.userId });
    } else {
      return res.status(401).json({ success: false, message: "Not authenticated" });
    }
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// send password reset OTP

export const sendResetOtp = async(req,res) => {
    const {email} = req.body; // extracting email from the request body

    if(!email){ 
        return res.json({success : false , message : "email is required"})
    }

    try{
          const user = await userModel.findOne({email}); // finding the user by email
          if(!user){
            return res.json({success : false , message : "user not found"})
          }
            const otp= String (Math.floor(100000 + Math.random()*900000)) // generating a random 6-digit OTP

        user.resetOtp = otp; // setting the generated OTP to the user's verifyOtp field
        user.resetOtpExpireAt = Date.now() + 15*60*1000; // setting the OTP expiration time to 10 minutes from now

        await user.save(); // saving the updated user document to the database

        const mailOptions = {
            from: process.env.SENDER_EMAIL, // sender's email address from environment variables
            to: user.email, // recipient's email address
            subject: 'Password reset Otp', // subject of the email
           // text: `Your OTP for reseting your password is ${otp}. Use this to reset your password.` ,
            html:PASSWORD_RESET_TEMPLATE.replace("{{otp}}",otp).replace("{{email}}",user.email)
        }

        await transporter.sendMail(mailOptions); // sending the email using the transporter object

       return res.json({success : true , message : "OTP sent successfully"})
    }
    catch(error){
        res.json({success : false , message : error.message}) // sending an error response if any exception occurs
    }
}


// reset user password

export const resetPassword = async(req,res) => {
    const {email,otp,newPassword} = req.body; // extracting email, otp, and newPassword from the request body
    if(!email || !otp || !newPassword){
        return res.json({success : false , message : "email, otp and new password are required"})
    }

    try{
        const user = await userModel.findOne({email}); // finding the user by email 
        if(!user){
            return res.json({success : false , message : "user not found"})
        }
        if(user.resetOtp === '' || user.resetOtp !== otp){
            return res.json({success : false , message : "invalid OTP"})
        }

        if(user.resetOtpExpireAt < Date.now()){
            return res.json({success : false , message : "OTP has expired"})
        }

        const hashedPassword = await bcrypt.hash(newPassword,10); // hashing the new password

        user.password = hashedPassword; // setting the new hashed password to the user's password field
        user.resetOtp = ''; // clearing the resetOtp field
        user.resetOtpExpireAt = 0; // clearing the resetOtpExpireAt field

        await user.save(); // saving the updated user document to the database

        return res.json({success : true , message : "Password reset successfully"}) // sending a success response
    }
    catch(error){
        return res.json({success : false , message : error.message}) // sending an error response if any exception occurs

    }
}


export const profile = (req, res) => {
  // userAuth already sets req.user and req.userId
  if (!req.user) return res.status(401).json({ success: false, message: "Not authenticated" });
  return res.json({ success: true, user: req.user });
};