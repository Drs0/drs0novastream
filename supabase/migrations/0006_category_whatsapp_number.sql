-- ============================================================================
-- NovaStream Migration 0006: Add Optional WhatsApp Number per Category
-- ============================================================================

ALTER TABLE public.categories
  ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;

