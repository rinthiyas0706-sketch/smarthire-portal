
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Register a new user
export const signup = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email and password are required',
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters',
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await User.findOne({
            email: normalizedEmail,
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Email is already registered',
            });
        }

        const allowedRoles = ['student', 'recruiter'];
        const userRole = role || 'student';

        if (!allowedRoles.includes(userRole)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid user role',
            });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await User.create({
            name: name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: userRole,
        });

        const tokenSecret = process.env.JWT_SECRET;

        if (!tokenSecret) {
            return res.status(500).json({
                success: false,
                message: 'Server authentication is not configured',
            });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            tokenSecret,
            { expiresIn: '1d' }
        );

        return res.status(201).json({
            success: true,
            message: 'Account created successfully',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Signup error:', error.message);

        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Email is already registered',
            });
        }

        return res.status(500).json({
            success: false,
            message: 'Unable to create account',
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required',
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        // Password is excluded by default in the User model,
        // so explicitly request it for password verification.
        const user = await User.findOne({
            email: normalizedEmail,
        }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        const tokenSecret = process.env.JWT_SECRET;

        if (!tokenSecret) {
            return res.status(500).json({
                success: false,
                message: 'Server authentication is not configured',
            });
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            tokenSecret,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            success: true,
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error.message);

        return res.status(500).json({
            success: false,
            message: 'Unable to log in',
        });
    }
};
