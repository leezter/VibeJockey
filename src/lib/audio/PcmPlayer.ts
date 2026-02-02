export class PcmPlayer {
  private audioContext?: AudioContext;
  private nextStartTime = 0;
  private readonly sampleRate: number;
  private readonly channels: number;

  constructor(sampleRate = 48000, channels = 2) {
    this.sampleRate = sampleRate;
    this.channels = channels;
  }

  async ensureStarted() {
    if (!this.audioContext) {
      this.audioContext = new AudioContext({ sampleRate: this.sampleRate });
      this.nextStartTime = this.audioContext.currentTime + 0.1;
    }
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  enqueue(pcmBytes: Uint8Array) {
    if (!this.audioContext) {
      return;
    }
    const frameCount = pcmBytes.byteLength / 2 / this.channels;
    const audioBuffer = this.audioContext.createBuffer(
      this.channels,
      frameCount,
      this.sampleRate
    );
    const int16 = new Int16Array(
      pcmBytes.buffer,
      pcmBytes.byteOffset,
      pcmBytes.byteLength / 2
    );

    for (let channel = 0; channel < this.channels; channel += 1) {
      const channelData = audioBuffer.getChannelData(channel);
      let offset = channel;
      for (let i = 0; i < frameCount; i += 1) {
        channelData[i] = int16[offset] / 32768;
        offset += this.channels;
      }
    }

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);
    const startTime = Math.max(this.audioContext.currentTime + 0.02, this.nextStartTime);
    source.start(startTime);
    this.nextStartTime = startTime + audioBuffer.duration;
  }

  async reset() {
    if (this.audioContext) {
      await this.audioContext.close();
      this.audioContext = undefined;
      this.nextStartTime = 0;
    }
  }
}
