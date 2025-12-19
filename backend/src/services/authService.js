import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import supabaseAdmin from '../config/supabase.js';

export const authService = {
  /**
   * Register a new recruiter
   */
  async register(email, password, fullName, companyName) {
    // Check if recruiter already exists
    const { data: existing } = await supabaseAdmin
      .from('recruiters')
      .select('id')
      .eq('email', email)
      .single();

    if (existing) {
      throw new Error('Email already registered');
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create recruiter
    const { data: recruiter, error } = await supabaseAdmin
      .from('recruiters')
      .insert({
        email,
        password_hash: passwordHash,
        full_name: fullName,
        company_name: companyName,
      })
      .select('id, email, full_name, company_name, created_at')
      .single();

    if (error) {
      throw new Error('Failed to create recruiter account');
    }

    // Generate token
    const token = jwt.sign(
      { id: recruiter.id, email: recruiter.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return {
      recruiter: {
        id: recruiter.id,
        email: recruiter.email,
        fullName: recruiter.full_name,
        companyName: recruiter.company_name,
        createdAt: recruiter.created_at,
      },
      token,
    };
  },

  /**
   * Login recruiter
   */
  async login(email, password) {
    // Get recruiter
    const { data: recruiter, error } = await supabaseAdmin
      .from('recruiters')
      .select('id, email, password_hash, full_name, company_name, is_active')
      .eq('email', email)
      .single();

    if (error || !recruiter) {
      throw new Error('Invalid email or password');
    }

    if (!recruiter.is_active) {
      throw new Error('Account is inactive');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, recruiter.password_hash);

    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = jwt.sign(
      { id: recruiter.id, email: recruiter.email },
      config.jwt.secret,
      { expiresIn: config.jwt.expiresIn }
    );

    return {
      recruiter: {
        id: recruiter.id,
        email: recruiter.email,
        fullName: recruiter.full_name,
        companyName: recruiter.company_name,
      },
      token,
    };
  },

  /**
   * Get recruiter profile
   */
  async getProfile(recruiterId) {
    const { data: recruiter, error } = await supabaseAdmin
      .from('recruiters')
      .select('id, email, full_name, company_name, created_at')
      .eq('id', recruiterId)
      .single();

    if (error || !recruiter) {
      throw new Error('Recruiter not found');
    }

    return {
      id: recruiter.id,
      email: recruiter.email,
      fullName: recruiter.full_name,
      companyName: recruiter.company_name,
      createdAt: recruiter.created_at,
    };
  },
};
