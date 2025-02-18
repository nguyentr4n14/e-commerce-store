import mongoose from "mongoose"

const { Schema } = mongoose

const couponSchema = new Schema({
    code: {
        type: String,
        required: true,
        unique: true
    },
    discountPercentage: {
        type: Number,
        required: true,
        min: 0,
        max: 100
    },
    expirationDate: {
        type: Date,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true
    }
}, { timestamps: true })

const Coupon = mongoose.model("Coupon", couponSchema)

export default Coupon