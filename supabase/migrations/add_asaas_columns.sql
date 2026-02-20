-- Migration: Add Asaas columns to leads table
-- Run this in Supabase Dashboard → SQL Editor

-- 1. Add CPF/CNPJ column (Asaas requires this to create/find customers)
ALTER TABLE leads
    ADD COLUMN IF NOT EXISTS cpf_cnpj TEXT;

-- 2. Add Asaas customer ID column
ALTER TABLE leads
    ADD COLUMN IF NOT EXISTS asaas_customer_id TEXT;

-- 3. Add Asaas subscription ID column
ALTER TABLE leads
    ADD COLUMN IF NOT EXISTS asaas_subscription_id TEXT;

-- 4. (Optional) Index for faster lookups by subscription
CREATE INDEX IF NOT EXISTS idx_leads_asaas_subscription_id
    ON leads (asaas_subscription_id);

-- Note: mp_preference_id is kept for historical records (no DROP).
-- You may remove it later once all legacy AbacatePay leads have been migrated.
