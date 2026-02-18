export interface LeadFormData {
  name: string
  birthDate: string
  birthTime?: string
  city: string
  birthCity?: string
  contact: string
  request?: string
  consent: boolean
  utmSource?: string | null
  utmMedium?: string | null
  utmCampaign?: string | null
  utmTerm?: string | null
  utmContent?: string | null
}

export interface Lead extends LeadFormData {
  id: string
  status: string
  createdAt: Date
  updatedAt: Date
}
