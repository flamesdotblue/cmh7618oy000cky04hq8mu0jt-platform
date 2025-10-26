import React, { useEffect, useRef, useState } from 'react';
import { MessageSquare, Mic, Image as ImageIcon, Video, Brain, RefreshCw } from 'lucide-react';

function Badge({ children }) {
  return (
    <span className="inline-flex items-center rounded-md bg-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/70">
      {children}
    </span>
  );
}

function SectionCard({ title, icon: Icon, description, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`group relative w-full text-left rounded-xl border border-white/10 bg-neutral-900/40 p-5 transition hover:border-white/20 hover:bg-neutral-900/60 ${
        active ? 'ring-2 ring-indigo-400/50' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1 grid h-11 w-11 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white">
          <Icon size={22} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">{title}</h3>
            {active && <Badge>Active</Badge>}
          </div>
          <p className="mt-1 text-sm text-white/70">{description}</p>
        </div>
      </div>
    </button>
  );
}

function TextAnalyzer() {
  const [text, setText] = useState('I am thrilled with the amazing progress today!');
  const [result, setResult] = useState(null);

  const positives = ['love','great','happy','joy','thrilled','amazing','good','awesome','fantastic','excited'];
  const negatives = ['sad','bad','angry','upset','terrible','hate','awful','frustrated','worried','anxious'];

  const analyze = () => {
    const t = text.toLowerCase();
    let score = 0;
    positives.forEach(w => { if (t.includes(w)) score += 1; });
    negatives.forEach(w => { if (t.includes(w)) score -= 1; });
    const emotion = score > 1 ? 'Joy' : score > 0 ? 'Content' : score === 0 ? 'Neutral' : score < -1 ? 'Sadness' : 'Concern';
    setResult({ emotion, score });
  };

  useEffect(() => { analyze(); // initial
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="rounded-xl border border-white/10 bg-neutral-900/40 p-5">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Text Analysis</h4>
        <button onClick={analyze} className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10 transition">
          <RefreshCw size={14} /> Analyze
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type or paste text here..."
        className="mt-3 w-full min-h-[110px] rounded-md bg-neutral-800/70 p-3 text-sm outline-none ring-1 ring-inset ring-white/10 focus:ring-indigo-400/50"
      />
      {result && (
        <div className="mt-3 flex items-center justify-between rounded-md bg-white/5 p-3 text-sm">
          <div>
            <div className="text-white/70">Predicted Emotion</div>
            <div className="text-base font-semibold">{result.emotion}</div>
          </div>
          <div className="text-right">
            <div className="text-white/70">Sentiment Score</div>
            <div className="text-base font-semibold">{result.score}</div>
          </div>
        </div>
      )}
    </div>
  );
}

function AudioAnalyzer() {
  const [recording, setRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioURL, setAudioURL] = useState('');

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mr = new MediaRecorder(stream);
    const chunks = [];
    mr.ondataavailable = (e) => chunks.push(e.data);
    mr.onstop = () => {
      const blob = new Blob(chunks, { type: 'audio/webm' });
      const url = URL.createObjectURL(blob);
      setAudioURL(url);
      stream.getTracks().forEach(t => t.stop());
    };
    mr.start();
    setMediaRecorder(mr);
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setRecording(false);
    }
  };

  return (
    <div className="rounded-xl border border-white/10 bg-neutral-900/40 p-5">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Audio Analysis</h4>
        {!recording ? (
          <button onClick={startRecording} className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10 transition">
            <Mic size={14} /> Start
          </button>
        ) : (
          <button onClick={stopRecording} className="inline-flex items-center gap-2 rounded-md border border-fuchsia-400/30 bg-fuchsia-500/20 text-fuchsia-200 px-3 py-1.5 text-sm hover:bg-fuchsia-500/30 transition">
            Stop
          </button>
        )}
      </div>

      <p className="mt-2 text-sm text-white/70">Record a short phrase. We will capture audio and provide a lightweight mock emotion result.</p>
      {audioURL && (
        <div className="mt-3 space-y-2">
          <audio controls src={audioURL} className="w-full" />
          <div className="rounded-md bg-white/5 p-3 text-sm">
            <div className="text-white/70">Mock Emotion</div>
            <div className="font-semibold">Neutral</div>
          </div>
        </div>
      )}
    </div>
  );
}

function ImageAnalyzer() {
  const [preview, setPreview] = useState('');
  const [emotion, setEmotion] = useState('');
  const canvasRef = useRef(null);

  const onFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    setEmotion('');

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      const w = 64, h = 64;
      canvas.width = w; canvas.height = h;
      ctx.drawImage(img, 0, 0, w, h);
      const { data } = ctx.getImageData(0, 0, w, h);
      let sum = 0;
      for (let i = 0; i < data.length; i += 4) {
        // simple brightness approximation
        sum += (data[i] + data[i + 1] + data[i + 2]) / 3;
      }
      const avg = sum / (w * h);
      const mood = avg > 150 ? 'Joy' : avg > 110 ? 'Calm' : avg > 80 ? 'Neutral' : 'Serious';
      setEmotion(mood);
    };
    img.src = url;
  };

  return (
    <div className="rounded-xl border border-white/10 bg-neutral-900/40 p-5">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Image Analysis</h4>
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10 transition">
          <ImageIcon size={14} /> Upload
          <input type="file" accept="image/*" onChange={onFile} className="hidden" />
        </label>
      </div>
      <p className="mt-2 text-sm text-white/70">Upload a face image to preview and run a lightweight brightness-based mock emotion.</p>
      {preview && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-3">
          <div className="aspect-video overflow-hidden rounded-md border border-white/10">
            <img src={preview} alt="preview" className="h-full w-full object-cover" />
          </div>
          <div>
            <canvas ref={canvasRef} className="w-full rounded-md border border-white/10 bg-black/30" />
            {emotion && (
              <div className="mt-3 rounded-md bg-white/5 p-3 text-sm">
                <div className="text-white/70">Predicted Emotion</div>
                <div className="font-semibold">{emotion}</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function VideoAnalyzer() {
  const videoRef = useRef(null);
  const [active, setActive] = useState(false);

  const start = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setActive(true);
    }
  };

  const stop = () => {
    const el = videoRef.current;
    if (!el) return;
    const stream = el.srcObject;
    if (stream) {
      const tracks = stream.getTracks();
      tracks.forEach((t) => t.stop());
    }
    el.srcObject = null;
    setActive(false);
  };

  return (
    <div className="rounded-xl border border-white/10 bg-neutral-900/40 p-5">
      <div className="flex items-center justify-between">
        <h4 className="font-medium">Video Analysis</h4>
        {!active ? (
          <button onClick={start} className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/5 px-3 py-1.5 text-sm hover:bg-white/10 transition">
            <Video size={14} /> Start
          </button>
        ) : (
          <button onClick={stop} className="inline-flex items-center gap-2 rounded-md border border-emerald-400/30 bg-emerald-500/20 text-emerald-200 px-3 py-1.5 text-sm hover:bg-emerald-500/30 transition">
            Stop
          </button>
        )}
      </div>
      <p className="mt-2 text-sm text-white/70">Activate your webcam for a live feed. This demo displays the stream to simulate real-time emotion recognition.</p>
      <div className="mt-3 aspect-video overflow-hidden rounded-md border border-white/10 bg-black/40">
        <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />
      </div>
      {active && (
        <div className="mt-3 rounded-md bg-white/5 p-3 text-sm">
          <div className="text-white/70">Status</div>
          <div className="font-semibold">Real-time feed active</div>
        </div>
      )}
    </div>
  );
}

export default function ModulesGrid() {
  const [active, setActive] = useState('text');

  const sections = [
    {
      key: 'text',
      title: 'Text Analysis',
      icon: MessageSquare,
      description: 'Detects emotion from written content using simple lexical cues.',
    },
    {
      key: 'audio',
      title: 'Audio Analysis',
      icon: Mic,
      description: 'Records speech and returns a mock emotion along with the clip.',
    },
    {
      key: 'image',
      title: 'Image Analysis',
      icon: ImageIcon,
      description: 'Uploads an image and infers a mock emotion via brightness heuristic.',
    },
    {
      key: 'video',
      title: 'Video Analysis',
      icon: Video,
      description: 'Streams your webcam to simulate real-time facial emotion recognition.',
    },
  ];

  return (
    <section id="modules" className="relative py-12 sm:py-16">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.12),transparent_60%)]" />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-white/90">
          <Brain size={18} />
          <h2 className="text-xl font-semibold">Analysis Modules</h2>
        </div>
        <p className="mt-2 text-sm text-white/70 max-w-2xl">
          Choose a modality to interact with the demo. Each panel provides a lightweight, client-side mock analysis to illustrate the experience.
        </p>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {sections.map((s) => (
            <SectionCard
              key={s.key}
              title={s.title}
              icon={s.icon}
              description={s.description}
              active={active === s.key}
              onClick={() => setActive(s.key)}
            />
          ))}
        </div>

        <div className="mt-6 grid grid-cols-1 gap-6">
          {active === 'text' && <TextAnalyzer />}
          {active === 'audio' && <AudioAnalyzer />}
          {active === 'image' && <ImageAnalyzer />}
          {active === 'video' && <VideoAnalyzer />}
        </div>

        <div id="about" className="mt-12 rounded-xl border border-white/10 bg-neutral-900/40 p-6">
          <h3 className="font-semibold">About this project</h3>
          <p className="mt-2 text-sm text-white/70">
            This interface showcases a multimodal approach to emotion recognition. While the demo uses simplified, on-device logic, a production system would combine large language models, acoustic feature extraction, and facial expression recognition models, then fuse their signals for a more robust, context-aware prediction.
          </p>
        </div>
      </div>
    </section>
  );
}
