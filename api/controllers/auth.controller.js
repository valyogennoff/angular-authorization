import Role from "../models/Role.js";
import User from "../models/User.js";
import UserToken from "../models/UserToken.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import { CreateSuccess } from "../utils/success.js";
import { CreateError } from "../utils/error.js";


export const register = async (req, res, next) => {
    try {
        // Check if the username or email already exists in the database
        const existingUser = await User.findOne({
            $or: [
                { username: req.body.username },
                { email: req.body.email }
            ]
        });

        if (existingUser) {
            // User with the same username or email already exists
            return next(CreateError(400, "Username or email already in use."));
        }

        // If the username and email are unique, proceed with user registration
        const role = await Role.findOne({ role: 'User' });

        const salt = await bcrypt.genSalt(12);
        const hashedPass = await bcrypt.hash(req.body.password, salt);

        const newUser = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            email: req.body.email,
            password: hashedPass,
            img: req.body.img,
            roles: role,
        });
        await newUser.save();
        
        return next(CreateSuccess(200, "User Registered Successfully!"));
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
}


export const registerAdmin = async (req, res, next) => {
    const role = await Role.find({});

    const salt = await bcrypt.genSalt(12);
    const hashedPass = await bcrypt.hash(req.body.password, salt);

    const newUser = new User ({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        username: req.body.username,
        email: req.body.email,
        password: hashedPass,
        isAdmin: true,
        img: req.body.img,
        roles: role,
    });
    await newUser.save();
    return next(CreateSuccess(200, "Administrator Registered Successfully!"))
}

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({email: req.body.email})
        .populate("roles", "role");
        const {roles} = user;

        if(!user) {
            return next(CreateError(404, "Wrong email or password"))
        }
        const isPassCorrect = await bcrypt.compare(req.body.password, user.password);
        if(!isPassCorrect) {
            return next(CreateError(400, "Wrong email or password"));
        }
        const token = jwt.sign(
            {id: user._id, isAdmin: user.isAdmin, roles: roles},
            process.env.JWT_SECRET
        );
        // return next(CreateSuccess(200, `${user.firstName} ${user.lastName} logged in successfully!`))
        res.cookie("access_token", token, {httpOnly: true})
        .status(200)
        .json({
            status: 200,
            message: `${user.firstName} ${user.lastName} logged in successfully!`,
            data: user
        })
    } catch (error) {
        return next(CreateError(500, "Internal Server Error"));
    }
}

export const sendEmail = async (req, res, next) => {
    const email = req.body.email;
    const user = await User.findOne({email: {$regex: '^'+email+'$', $options: 'i'}});
    if (!user) {
        return next(CreateError(404, 'No user with such email'));
    }
    const payload = {
        email: user.email
    }
    // const expiryTime = 300;
    const token = jwt.sign(payload, process.env.JWT_SECRET, 
        {expiresIn: 900}
        );
    
    const newToken = new UserToken({
        userId: user._id,
        token: token,
    });

    const mailTransport = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SEND_MAIL_ADDR,
            pass: process.env.SEND_MAIL_PASS,
        }
    });
    let mailDetails = {
        from: process.env.SEND_MAIL_ADDR,
        to: email,
        subject: 'Requested Password Reset',
        html: `
        <html>
        <body>
            <h1>Password Reset Request</h1>
            <p>Dear ${user.firstName},</p>
            <p>We have received a request to reset your password for Grab My Book. To complete the password reset process, please click on the button below:</p> 
            <a href =${process.env.LIVE_URL}/reset/${token}><button style="background-color: #4CAF50; color: white; padding: 14px 20px; border: none; cursor: pointer; border-radius: 4px;">Reset Password</button></a>
            <p><span style="font-weight: 800;">Please note that this link will expire in 15 minutes.</span> If you did not request a password reset, please disregard this message.</p>
            <p></p>
            <p>Thank you!</p>
            <p>Grab My Book Team</p>
        </body>
        </html>
        `,
    };
    mailTransport.sendMail(mailDetails, async(err, data) => {
        if (err) {
            console.log(err.message);
            return next(CreateError(500, "Error while sending email: " + err.message));
        } else {
            await newToken.save();
            return next(CreateSuccess(200, "Email sent. Please, check you mailbox."))
        }
    })
}


export const resetPassword = (req, res, next) => {
    const token = req.body.token;
    const newPassword = req.body.password;

    jwt.verify(token, process.env.JWT_SECRET, async(err, data) => {
        if (err) {
            return next(CreateError(500, "Reset link has expired. Please try again."))
        } else {
            const response = data;
            const user = await User.findOne({ email: {$regex: '^' + response.email + '$', $options: 'i'}});
            const salt = await bcrypt.genSalt(10);
            const encryptedPassword = await bcrypt.hash(newPassword, salt);
            user.password = encryptedPassword;
            try {
                const updatedUser = await User.findOneAndUpdate(
                    {_id: user._id},
                    {$set: user},
                    {new: true}
                )
                return next(CreateSuccess(200, 'You have successfully reset your password!'))
            } catch (error) {
                return next(CreateError(500, "Error while resetting password: " + err.message));
            }
        }
    })
}




// export const logout = async (req, res, next) => {
//     try {
//         // Clear the access_token cookie
//         res.clearCookie("access_token");

//         return res.status(200).json({
//             status: 200,
//             message: "Logged out successfully.",
//         });
//     } catch (error) {
//         return next(CreateError(500, "Internal Server Error"));
//     }
// }