export type WeightedPrompt = {
  id: string;
  text: string;
  weight: number;
};

export type MusicGenerationMode = 'QUALITY' | 'DIVERSITY' | 'VOCALIZATION';

export type Scale =
  | 'SCALE_UNSPECIFIED'
  | 'C_MAJOR_A_MINOR'
  | 'D_FLAT_MAJOR_B_FLAT_MINOR'
  | 'D_MAJOR_B_MINOR'
  | 'E_FLAT_MAJOR_C_MINOR'
  | 'E_MAJOR_D_FLAT_MINOR'
  | 'F_MAJOR_D_MINOR'
  | 'G_FLAT_MAJOR_E_FLAT_MINOR'
  | 'G_MAJOR_E_MINOR'
  | 'A_FLAT_MAJOR_F_MINOR'
  | 'A_MAJOR_G_FLAT_MINOR'
  | 'B_FLAT_MAJOR_G_MINOR'
  | 'B_MAJOR_A_FLAT_MINOR';

export type MusicGenerationConfig = {
  temperature?: number;
  topK?: number;
  seed?: number;
  guidance?: number;
  bpm?: number;
  density?: number;
  brightness?: number;
  scale?: Scale;
  muteBass?: boolean;
  muteDrums?: boolean;
  onlyBassAndDrums?: boolean;
  musicGenerationMode?: MusicGenerationMode;
};

export type PlaybackControl = 'PLAY' | 'PAUSE' | 'STOP' | 'RESET_CONTEXT';

export type LyriaServerMessage =
  | { setupComplete: Record<string, never> }
  | { setup_complete: Record<string, never> }
  | { serverContent: { audioChunks?: AudioChunk[]; audio_chunks?: AudioChunk[] } }
  | { filteredPrompt: FilteredPrompt; filtered_prompt?: FilteredPrompt }
  | { warning: string };

export type FilteredPrompt = {
  filteredReason?: string;
  filtered_reason?: string;
  text?: string;
};

export type AudioChunk = {
  data?: string;
  mimeType?: string;
  mime_type?: string;
  sourceMetadata?: SourceMetadata;
  source_metadata?: SourceMetadata;
};

export type SourceMetadata = {
  clientContent?: unknown;
  client_content?: unknown;
  musicGenerationConfig?: unknown;
  music_generation_config?: unknown;
};
