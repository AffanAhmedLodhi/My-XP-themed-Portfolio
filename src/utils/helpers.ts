export const playSound = (type: 'startup' | 'shutdown' | 'click' | 'error') => {
  const sounds = {
    startup: '/sounds/startup.mp3',
    shutdown: '/sounds/shutdown.mp3',
    click: '/sounds/click.mp3',
    error: '/sounds/error.mp3'
  };
  
  try {
    const audio = new Audio(sounds[type]);
    audio.volume = 0.5;
    audio.play().catch(() => console.log("Audio play failed - user interaction needed first"));
  } catch (e) {
    console.error("Audio not found");
  }
};