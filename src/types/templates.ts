export interface UITemplate {
  id: string
  name: string
  description: string
  previewImage?: string
}

export type TemplateId = 'default' | 'modern' | 'classic'