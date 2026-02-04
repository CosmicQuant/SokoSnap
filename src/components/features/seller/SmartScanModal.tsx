import React, { useState } from 'react';
import { X, BrainCircuit, Loader2, CheckCircle2, Image as ImageIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- PROFESSIONAL AI SYSTEM PROMPT ---
// This prompt configures the Vision Model (e.g., GPT-4 Vision / Gemini Pro Vision)
// to act as an expert e-commerce listing agent.
const SMART_SCAN_PROMPT = `
ROLE: Expert E-commerce Listing Agent & Copywriter (Amazon/Jumia/Kilimall Style).
TASK: Analyze the uploaded product image and generate a high-converting sales listing suitable for the Kenyan market.
OUTPUT FORMAT: JSON

REQUIREMENTS:
1. name: Write a concise product title. Constraint: MAXIMUM 5 words. MUST start with the specific Product Name/Model (e.g. "Oppo A18" not "Brand New Oppo A18"). Keep it short.
2. price: Estimate fair market value in KES (Kenyan Shilling). Return as string number (e.g. "1500").
3. category: Classify into one of: [fashion, electronics, home, beauty, automotive].
4. condition: Assess visual wear. One of: [new, like-new, good, fair].
5. description: Write a comprehensive description formatted like top retailers (Amazon, Jumia, Kilimall).
   - STRUCTURE: mix of summarized engaging description and bulleted specifications.
   - FOR ELECTRONICS/TECH: Must include technical specs (RAM, Storage, Battery, Screen Size, Ports) in a list format.
   - FOR FASHION: Focus on Fabric, Fit, Occasion, and Care Instructions.
   - GENERAL: Use clear, professional language. 
   - Formatting: Use markdown bullets (-) for specs.
6. returnPolicy: Recommend based on local standards (e.g. Electronics = 7 Days, Fashion = Returns Allowed if unworn).
7. tags: Generate 5-7 high-volume search keywords.

CONSTRAINTS:
- Do not hallucinate features not visible.
- Ensure price is realistic for the Local Kenyan Market.
`;

interface SmartScanModalProps {
    isOpen: boolean;
    onClose: () => void;
    onScanComplete: (product: any) => void;
}

export const SmartScanModal: React.FC<SmartScanModalProps> = ({ isOpen, onClose, onScanComplete }) => {
    const [step, setStep] = useState<'upload' | 'scanning' | 'success'>('upload');
    const [scanLog, setScanLog] = useState<string[]>([]);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string>('');

    // State to hold the "AI" result
    const [aiResult, setAiResult] = useState<any>(null);

    // Helper to convert File to Base64/InlineData
    const fileToPart = (file: File): Promise<any> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
                const base64data = reader.result?.toString().split(',')[1];
                resolve({
                    inlineData: {
                        data: base64data,
                        mimeType: file.type
                    }
                });
            };
            reader.onerror = reject;
        });
    };

    // Real API Call to Google AI Studio (Gemini)
    const performSmartScan = async (file: File) => {
        try {
            const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY;

            if (!API_KEY) {
                console.error("Missing Google AI API Key");
                return mockResult;
            }

            console.log("🚀 SENDING TO GOOGLE AI STUDIO...");

            const genAI = new GoogleGenerativeAI(API_KEY);
            const model = genAI.getGenerativeModel({
                model: "gemini-2.5-pro",
                generationConfig: { responseMimeType: "application/json" }
            });

            const imagePart = await fileToPart(file);

            const result = await model.generateContent([
                SMART_SCAN_PROMPT,
                imagePart
            ]);

            const response = await result.response;
            const text = response.text();
            console.log("🤖 AI RAW RESPONSE:", text);

            // Parse JSON response
            const data = JSON.parse(text);

            // Ensure stock is set to '1' if AI omits it
            return { ...data, stock: data.stock || '1' };

        } catch (error) {
            console.error("Smart Scan Error:", error);
            // Fallback to manual entry if API fails (e.g., quota exceeded)
            return {
                name: '',
                price: '',
                description: 'AI Analysis Failed. Please enter details manually.',
                category: 'fashion',
                condition: 'good',
                tags: [],
                returnPolicy: 'No Returns',
                stock: '1'
            };
        }
    };


    // Camera Logic
    const videoRef = React.useRef<HTMLVideoElement>(null);
    const canvasRef = React.useRef<HTMLCanvasElement>(null);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [stream, setStream] = useState<MediaStream | null>(null);

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            setStream(mediaStream);
            setIsCameraOpen(true);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Camera Error:", err);
            // Fallback for permissions or no camera
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        setIsCameraOpen(false);
    };

    // Ensure camera stops when modal closes (via prop change)
    React.useEffect(() => {
        if (!isOpen && isCameraOpen) {
            stopCamera();
        }
    }, [isOpen]);

    const capturePhoto = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext('2d');
            if (context) {
                context.drawImage(video, 0, 0, canvas.width, canvas.height);
                canvas.toBlob((blob) => {
                    if (blob) {
                        const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
                        setImage(file);
                        setPreview(URL.createObjectURL(file));
                        setStep('scanning');
                        setScanLog(['Initializing Vision Engine...', 'Uploading Image to Neural Cloud...']);
                        stopCamera();
                        runScanSequence(file);
                    }
                }, 'image/jpeg');
            }
        }
    };

    React.useEffect(() => {
        if (isOpen && step === 'upload' && !isCameraOpen) {
            startCamera();
        }
    }, [isOpen, step]);

    React.useEffect(() => {
        if (isCameraOpen && videoRef.current && stream) {
            videoRef.current.srcObject = stream;
        }
        return () => {
            // Cleanup on unmount
            if (stream) stream.getTracks().forEach(t => t.stop());
        }
    }, [isCameraOpen, stream]);


    // Mock result for fallback or if key is missing during dev
    const mockResult = {
        name: 'Smart Scan Demo Product',
        price: '0',
        description: 'AI Service unreachable. Please configure your API Key or check connectivity.',
        category: 'fashion',
        condition: 'good',
        tags: [],
        returnPolicy: 'No Returns',
        stock: '1'
    }

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            setPreview(URL.createObjectURL(file));
            setStep('scanning');
            setScanLog(['Initializing Vision Engine...', 'Uploading Image to Neural Cloud...']);

            // Trigger Scan
            runScanSequence(file);
        }
    };

    const runScanSequence = async (file: File) => {
        // Visual Log Sequence
        const sequence = [
            { msg: 'Detecting Object Geometry & Brand...', delay: 1500 },
            { msg: 'Analysing Material & Condition...', delay: 3000 },
            { msg: 'Comparing Market Prices (Nairobi Region)...', delay: 4000 },
            { msg: 'Generating High-Conversion Copy...', delay: 5000 },
            { msg: 'Complete.', delay: 5500 }
        ];

        // Run UI Logs
        sequence.forEach(s => {
            setTimeout(() => {
                if (s.msg !== 'Complete.') {
                    setScanLog(prev => [...prev, s.msg]);
                }
            }, s.delay);
        });

        // Run Actual "Logic"
        const result = await performSmartScan(file);

        // DIRECT TRANSITION: Skip "Success" review step and go straight to Add Product Modal
        // The user requested to skip the result preview.
        setTimeout(() => {
            onScanComplete({
                ...result,
                image: file, // Pass the File object directly
                generatedImages: []
            });
            onClose();

            // Reset local state
            setStep('upload');
            setImage(null);
            setScanLog([]);
            setAiResult(null);
        }, 500); // Small buffer to let the "Complete" log show for a split second
    };

    const handleConfirm = () => {
        if (!aiResult) return;

        // Pass the original image AND the AI data
        onScanComplete({
            ...aiResult,
            image: image,
            // In a real app, we might have an AI-enhanced version (background removed etc)
            // For now, we reuse the preview as a 'generated' asset placeholder if needed, 
            // but AddProductModal handles the File object best.
            generatedImages: []
        });
        onClose();

        // Reset
        setTimeout(() => {
            setStep('upload');
            setImage(null);
            setScanLog([]);
            setAiResult(null);
        }, 500);
    };

    const handleClose = () => {
        stopCamera();
        onClose();
    };

    if (!isOpen) return null;

    // Use "Light Mode" by default (white bg) + Gold Branding as requested
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full bg-black relative flex flex-col"
            >
                {/* Header Overlay */}
                <div className="absolute top-0 left-0 right-0 p-4 z-50 flex justify-between items-center bg-gradient-to-b from-black/80 to-transparent">
                    <div className="flex items-center gap-2">
                        <BrainCircuit className="text-yellow-400 drop-shadow-lg" size={24} />
                        <h3 className="font-bold text-lg text-white drop-shadow-lg">AI Snap</h3>
                    </div>
                    <button onClick={handleClose} className="p-2 bg-black/40 backdrop-blur rounded-full text-white/80 hover:bg-black/60 transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <div className="flex-1 relative overflow-hidden">
                    {/* Camera / Upload View */}
                    {step === 'upload' && (
                        <div className="absolute inset-0 bg-black">
                            <video
                                ref={videoRef}
                                autoPlay
                                playsInline
                                className="w-full h-full object-cover"
                            />
                            <canvas ref={canvasRef} className="hidden" />

                            {/* Camera Controls */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 pb-12 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-center gap-12 z-20">

                                <div className="relative group">
                                    <button className="p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20 transition-all active:scale-95">
                                        <ImageIcon size={24} />
                                    </button>
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                                        onChange={(e) => { stopCamera(); handleFile(e); }}
                                        accept="image/*"
                                    />
                                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs font-medium text-white/80 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-black/50 px-2 py-1 rounded">Gallery</span>
                                </div>

                                <button
                                    onClick={capturePhoto}
                                    className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/20 backdrop-blur active:scale-90 transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:bg-white/30"
                                >
                                    <div className="w-16 h-16 bg-white rounded-full"></div>
                                </button>

                                <button onClick={handleClose} className="p-4 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 border border-white/20 transition-all active:scale-95">
                                    <X size={24} />
                                </button>
                            </div>

                            {!isCameraOpen && (
                                <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
                                    <Loader2 className="animate-spin text-white/50" size={40} />
                                    <p className="absolute mt-16 text-white/50 text-sm font-medium">Starting Camera...</p>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 'scanning' && (
                        <div className="absolute inset-0 bg-black flex flex-col items-center justify-center relative overflow-hidden">
                            {/* Background Blur */}
                            <img src={preview} className="absolute inset-0 w-full h-full object-cover opacity-40 blur-xl scale-110" />
                            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

                            <div className="relative z-10 w-full max-w-sm px-8 flex flex-col items-center gap-8">
                                <motion.div
                                    initial={{ scale: 0.8, opacity: 0 }}
                                    animate={{ scale: 1, opacity: 1 }}
                                    className="w-32 h-32 rounded-full border-4 border-yellow-500/30 flex items-center justify-center relative bg-black/40 backdrop-blur shadow-[0_0_40px_rgba(234,179,8,0.2)]"
                                >
                                    <div className="absolute inset-0 border-t-4 border-yellow-500 rounded-full animate-spin" style={{ animationDuration: '1.5s' }} />
                                    <div className="absolute inset-2 border-r-4 border-yellow-500/50 rounded-full animate-spin" style={{ animationDuration: '2.5s', animationDirection: 'reverse' }} />
                                    <BrainCircuit size={48} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" />
                                </motion.div>

                                <div className="w-full space-y-4">
                                    {scanLog.map((log, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            className="flex items-center gap-3 text-xs font-mono text-yellow-100/90 bg-white/5 p-3 rounded-xl border border-white/10 shadow-sm backdrop-blur-md"
                                        >
                                            <CheckCircle2 size={14} className="text-yellow-400 shrink-0" />
                                            <span className="tracking-wide">{log}</span>
                                        </motion.div>
                                    ))}
                                    <div className="flex items-center gap-3 text-xs font-mono text-yellow-400 opacity-80 animate-pulse px-3">
                                        <Loader2 size={14} className="animate-spin" />
                                        <span className="uppercase tracking-widest">Processing...</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'success' && aiResult && (
                        <div className="absolute inset-0 bg-zinc-900 flex flex-col overflow-y-auto">
                            <div className="flex-1 p-6 flex flex-col">
                                <h3 className="text-white font-bold text-xl mb-6 flex items-center gap-2">
                                    <CheckCircle2 className="text-green-500" />
                                    Analysis Complete
                                </h3>

                                <div className="flex gap-4 mb-8">
                                    <div className="w-1/2 aspect-[4/5] bg-gray-800 rounded-2xl overflow-hidden relative border border-gray-700/50">
                                        <img src={preview} alt="Result" className="w-full h-full object-cover opacity-60" />
                                        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                                            <span className="text-[10px] font-bold uppercase text-white/70">Original</span>
                                        </div>
                                    </div>
                                    <div className="w-1/2 aspect-[4/5] bg-gray-900 rounded-2xl overflow-hidden relative border border-yellow-500/50 shadow-[0_0_30px_rgba(234,179,8,0.1)]">
                                        <img src={preview} alt="Result" className="w-full h-full object-cover saturate-[1.2] contrast-[1.15]" />
                                        <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 to-transparent mix-blend-overlay" />
                                        <div className="absolute top-3 right-3 bg-yellow-400 text-black px-2 py-0.5 rounded text-[8px] font-black uppercase shadow-lg z-10">AI Enhanced</div>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-8">
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Detected Product</label>
                                        <p className="text-xl font-medium text-white leading-tight">{aiResult.name}</p>
                                    </div>
                                    <div className="bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm flex justify-between items-center">
                                        <div>
                                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-1">Market Price</label>
                                            <p className="text-2xl font-bold text-green-400">KES {aiResult.price}</p>
                                        </div>
                                        <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center text-green-500">
                                            <span className="text-lg font-bold">K</span>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleConfirm}
                                    className="mt-auto w-full py-5 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest rounded-2xl transition-all shadow-[0_0_20px_rgba(234,179,8,0.3)] active:scale-95 flex items-center justify-center gap-3 text-sm"
                                >
                                    Review Listing <CheckCircle2 size={20} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
