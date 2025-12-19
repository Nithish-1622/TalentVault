import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import supabaseAdmin from '../config/supabase.js';

export const authMiddleware = async (req, res, next) => {
  try {
    // Get token from header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'No token provided. Access denied.',
      });
    }

    const token = authHeader.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(token, config.jwt.secret);

    // Get recruiter from database
    const { data: recruiter, error } = await supabaseAdmin
      .from('recruiters')
      .select('id, email, full_name, company_name, is_active')
      .eq('id', decoded.id)
      .single();

    if (error || !recruiter) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token or recruiter not found.',
      });
    }

    if (!recruiter.is_active) {
      return res.status(403).json({
        success: false,
        error: 'Account is inactive. Please contact support.',
      });
    }

    // Attach recruiter to request
    req.recruiter = recruiter;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Token expired. Please login again.',
      });
    }

    return res.status(401).json({
      success: false,
      error: 'Invalid token.',
    });
  }
};
