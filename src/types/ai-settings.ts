
export interface AISettings {
  provider: 'deepseek' | 'openai';
  deepseek_api_key?: string;
  openai_api_key?: string;
  model?: string;
  [key: string]: any; // Add index signature for Json compatibility
}

export interface AIProvider {
  id: 'deepseek' | 'openai';
  name: string;
  models: AIModel[];
}

export interface AIModel {
  id: string;
  name: string;
  description?: string;
}

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: 'deepseek',
    name: 'DeepSeek',
    models: [
      { id: 'deepseek-chat', name: 'DeepSeek Chat', description: 'Standard DeepSeek model' },
      { id: 'deepseek-reasoner', name: 'DeepSeek Reasoner', description: 'Advanced reasoning model' }
    ]
  },
  {
    id: 'openai',
    name: 'OpenAI',
    models: [
      { id: 'gpt-4o', name: 'GPT-4 Omni', description: 'Most capable OpenAI model' },
      { id: 'gpt-4o-mini', name: 'GPT-4 Omni Mini', description: 'Fast and efficient model' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo', description: 'Optimized GPT-4 model' }
    ]
  }
];
