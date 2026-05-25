CREATE TABLE IF NOT EXISTS phone_verification_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  phone VARCHAR(30) NOT NULL,
  code VARCHAR(10) NOT NULL,

  verified_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ NOT NULL,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_phone_verification_codes_phone
ON phone_verification_codes(phone);

CREATE INDEX IF NOT EXISTS idx_phone_verification_codes_expires_at
ON phone_verification_codes(expires_at);
