-- Create government schemes table with official website URLs
CREATE TABLE public.government_schemes (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'ready' CHECK (status IN ('ready', 'missing_docs', 'not_eligible')),
    amount INTEGER,
    missing_docs TEXT[],
    deadline TEXT NOT NULL,
    official_url TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.government_schemes ENABLE ROW LEVEL SECURITY;

-- Public read access for schemes (anyone can view government schemes)
CREATE POLICY "Anyone can view schemes" 
ON public.government_schemes 
FOR SELECT 
USING (true);

-- Insert default government schemes with official URLs
INSERT INTO public.government_schemes (name, description, status, amount, missing_docs, deadline, official_url) VALUES
('PM-KISAN', 'Direct income support of ₹6000/year to farmer families', 'ready', 6000, NULL, '15 Feb 2024', 'https://pmkisan.gov.in/'),
('PMFBY', 'Pradhan Mantri Fasal Bima Yojana - Crop insurance', 'missing_docs', NULL, ARRAY['Land Record', 'Bank Statement'], '28 Feb 2024', 'https://pmfby.gov.in/'),
('Soil Health Card', 'Free soil testing and nutrient recommendations', 'ready', NULL, NULL, 'Open', 'https://soilhealth.dac.gov.in/'),
('PM-KUSUM', 'Solar pump subsidy for irrigation', 'ready', 50000, NULL, '31 Mar 2024', 'https://pmkusum.mnre.gov.in/'),
('Kisan Credit Card', 'Low-interest loans for agricultural expenses', 'missing_docs', NULL, ARRAY['Income Certificate'], 'Ongoing', 'https://www.pmkisan.gov.in/kcc/'),
('eNAM', 'National Agriculture Market - Sell crops online', 'not_eligible', NULL, NULL, 'Ongoing', 'https://enam.gov.in/'),
('PKVY', 'Paramparagat Krishi Vikas Yojana - Organic farming', 'ready', 31000, NULL, '15 Apr 2024', 'https://pgsindia-ncof.gov.in/pkvy/'),
('RKVY', 'Rashtriya Krishi Vikas Yojana - Agricultural development', 'not_eligible', NULL, NULL, '30 Apr 2024', 'https://rkvy.nic.in/');