import { redis } from '../lib/redis.js'
import User from '../models/user.model.js'
import jwt from 'jsonwebtoken'

const generateTokens = (userId) => {
    // Create tokens
    const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })
    const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" })

    return { accessToken, refreshToken }
}

const storeRefreshToken = async (userId, refreshToken) => {
    await redis.set(`refresh_token:${userId}`, refreshToken, "EX", 7 * 24 * 60 * 60) // 7 days
}

const setCookies = (res, accessToken, refreshToken) => {
    res.cookie("accessToken", accessToken, {
        maxAge: 15 * 60 * 1000, // ms (15 minutes)
        httpOnly: true, // Preven XSS attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" // CSRF attacks (cross-site request forgery attacks)
    })

    res.cookie("refreshToken", refreshToken, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // ms (7 days)
        httpOnly: true, // Preven XSS attacks
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" // CSRF attacks (cross-site request forgery attacks)
    })
}

export const signup = async (req, res) => {
    const { email, password, name } = req.body

    try {
        // Check email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: "Invalid email format" })
        }

        // Check existing user
        const userExists = await User.findOne({ email })
        if (userExists) {
            return res.status(400).json({ message: "User already exists" })
        }

        const user = await User.create({ name, email, password })

        // Authenticate
        const { accessToken, refreshToken } = generateTokens(user._id)

        // Store refreshToken into redis
        await storeRefreshToken(user._id, refreshToken)

        // Store accessToken into cookies
        setCookies(res, accessToken, refreshToken)

        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        })
    } catch (error) {
        console.log(`Error in signup controller: ${error.message}`)
        res.status(500).json({ message: error.message })
    }

}

export const login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (user && (await user.comparePassword(password))) {
            const { accessToken, refreshToken } = generateTokens(user._id)

            // Store refreshToken into redis
            await storeRefreshToken(user._id, refreshToken)

            // Store accessToken into cookies
            setCookies(res, accessToken, refreshToken)

            res.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            })
        } else {
            res.status(400).json({ message: "Invalid email or password" })
        }

    } catch (error) {
        console.log(`Error in login controller: ${error.message}`)
        res.status(500).json({ message: error.message })
    }
}

export const logout = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken
        if (refreshToken) {
            const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
            await redis.del(`refresh_token:${decoded.userId}`)
        }

        // Clear cookies 
        res.clearCookie("accessToken")
        res.clearCookie("refreshToken")

        res.status(200).json({ message: "Logged out successfully" })
    } catch (error) {
        console.log(`Error in logout controller: ${error.message}`)
        res.status(500).json({ message: error.message })
    }
}

// This will refresh the access token
export const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken

        if (!refreshToken) {
            return res.status(401).json({ message: "No refresh token provided" })
        }

        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)
        const storedToken = await redis.get(`refresh_token:${decoded.userId}`)

        if (storedToken !== refreshToken) {
            return res.status(401).json({ message: "Invalid refresh token" })
        }

        const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })

        res.cookie("accessToken", accessToken, {
            maxAge: 15 * 60 * 1000, // ms (15 minutes)
            httpOnly: true, // Preven XSS attacks
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict" // CSRF attacks (cross-site request forgery attacks)
        })

        res.json({ message: "Token refreshed successfully" })
    } catch (error) {
        console.log(`Error in refreshToken controller: ${error.message}`)
        res.status(500).json({ message: error.message })
    }
}

export const getProfile = async (req, res) => {
    try {
        res.json(req.user)
    } catch (error) {
        console.log(`Error in refreshToken controller: ${error.message}`)
        res.status(500).json({ message: error.message })
    }
}