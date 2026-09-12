// Store Ringing Bell Audio Synthesizer (Web Audio API)

let continuousRingingInterval = null;

// Function to play a single loud double-ring store bell sequence (DING-DONG! DING-DONG! 🔔)
export const playOrderChime = () => {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;

    const ctx = new AudioContext();

    const ringBellNote = (freq, startTime, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.7, startTime);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(startTime);
      osc.stop(startTime + duration);
    };

    const now = ctx.currentTime;

    // Ring 1: DING-DONG!
    ringBellNote(880, now, 0.3);           // High Bell (A5)
    ringBellNote(587.33, now + 0.18, 0.4);  // Low Bell (D5)

    // Ring 2: DING-DONG!
    ringBellNote(880, now + 0.45, 0.3);        // High Bell (A5)
    ringBellNote(587.33, now + 0.63, 0.5);     // Low Bell (D5)
  } catch (e) {
    console.error('Store Ringing Bell Error:', e);
  }
};

/**
 * Start continuous ringing until stopped
 */
export const startContinuousOrderRinging = () => {
  if (continuousRingingInterval) return; // Already ringing

  console.log('🔔 Starting continuous store order bell loop...');
  playOrderChime();

  // Repeat ringing every 1.8 seconds continuously until admin accepts order
  continuousRingingInterval = setInterval(() => {
    playOrderChime();
  }, 1800);
};

/**
 * Stop continuous ringing immediately when admin accepts order
 */
export const stopContinuousOrderRinging = () => {
  if (continuousRingingInterval) {
    console.log('🔕 Stopping continuous store order bell loop.');
    clearInterval(continuousRingingInterval);
    continuousRingingInterval = null;
  }
};
