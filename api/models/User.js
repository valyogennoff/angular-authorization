import mongoose, {Schema} from 'mongoose';

const UserSchema = mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        img: {
            type: String,
            required: false,
            default: 'https://icon-library.com/images/default-user-icon/default-user-icon-8.jpg',
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        roles: {
            type: [Schema.Types.ObjectId],
            required: true,
            ref: "Role"
        }
        
    },
    {
        timestamps: true
    }

);

export default mongoose.model("User", UserSchema);