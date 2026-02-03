import React, { useState } from 'react';
import { X, BrainCircuit, Loader2, Camera, CheckCircle2 } from 'lucide-react';
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

    if (!isOpen) return null;

    // Use "Light Mode" by default (white bg) + Gold Branding as requested
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white border border-gray-200 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative text-black max-h-[90vh] flex flex-col"
            >
                <div className="p-4 border-b border-gray-200 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2">
                        <BrainCircuit className="text-yellow-600" size={20} />
                        <h3 className="font-bold text-lg text-gray-900">Smart Scan AI</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>


                <div className="p-6 min-h-[400px] flex flex-col overflow-y-auto custom-scrollbar">
                    {step === 'upload' && !isCameraOpen && (
                        <div className="flex-1 flex flex-col gap-4">
                            {/* Camera Option */}
                            <button
                                onClick={startCamera}
                                className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl hover:border-yellow-500/50 hover:bg-yellow-50 transition-all p-6 group"
                            >
                                <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-sm">
                                    <Camera size={28} />
                                </div>
                                <p className="font-bold text-lg text-gray-900">Open Camera</p>
                                <p className="text-gray-500 text-xs text-center">Take a photo instantly</p>
                            </button>

                            {/* Gallery Option */}
                            <div className="relative">
                                <button className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold bg-gray-100 hover:bg-gray-200 text-gray-700 transition-colors">
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                            onChange={handleFile}
                                            accept="image/*"
                                        />
                                        <Loader2 size={18} className="animate-spin hidden" /> {/* Placeholder icon */}
                                        <span>Upload from Gallery</span>
                                    </div>
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'upload' && isCameraOpen && (
                        <div className="flex-1 flex flex-col bg-black rounded-2xl overflow-hidden relative">
                            <video ref={videoRef} autoPlay playsInline className="absolute inset-0 w-full h-full object-cover" />
                            <canvas ref={canvasRef} className="hidden" />

                            <div className="absolute bottom-6 left-0 right-0 flex items-center justify-center gap-8 z-20">
                                <button onClick={stopCamera} className="p-3 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/30">
                                    <X size={24} />
                                </button>
                                <button onClick={capturePhoto} className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center bg-white/20 backdrop-blur active:scale-95 transition-transform">
                                    <div className="w-12 h-12 bg-white rounded-full"></div>
                                </button>
                                <div className="relative p-3 rounded-full bg-white/20 backdrop-blur text-white hover:bg-white/30 cursor-pointer overflow-hidden">
                                    <input
                                        type="file"
                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                        onChange={(e) => { stopCamera(); handleFile(e); }}
                                        accept="image/*"
                                    />
                                    <CheckCircle2 size={24} />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'scanning' && (
                        <div className="flex-1 flex flex-col items-center justify-center relative bg-gray-100 rounded-2xl overflow-hidden">
                            <img src={preview} className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-sm" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent" />

                            <div className="relative z-10 w-full px-8 flex flex-col items-center gap-6">
                                <div className="w-24 h-24 rounded-full border-4 border-yellow-500/20 flex items-center justify-center relative bg-white backdrop-blur-sm">
                                    <div className="absolute inset-0 border-t-4 border-yellow-500 rounded-full animate-spin" />
                                    <BrainCircuit size={40} className="text-yellow-600" />
                                </div>

                                <div className="w-full space-y-3">
                                    {scanLog.map((log, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex items-center gap-3 text-xs font-mono text-yellow-900 bg-yellow-50 p-2 rounded-lg border border-yellow-200 shadow-sm"
                                        >
                                            <CheckCircle2 size={12} className="text-yellow-600 shrink-0" />
                                            <span>{log}</span>
                                        </motion.div>
                                    ))}
                                    <div className="flex items-center gap-3 text-xs font-mono text-yellow-600 opacity-70 animate-pulse px-2">
                                        <Loader2 size={12} className="animate-spin" /> Processing...
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'success' && aiResult && (
                        <div className="flex-1 flex flex-col pt-2">
                            <div className="flex gap-3 mb-6">
                                <div className="w-1/2 aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden relative border border-gray-200 group">
                                    <img src={preview} alt="Result" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute top-2 left-2 bg-black/50 backdrop-blur px-2 py-0.5 rounded text-[8px] font-bold uppercase text-white">Original</div>
                                </div>
                                <div className="w-1/2 aspect-[4/3] bg-gray-100 rounded-xl overflow-hidden relative border border-yellow-500 shadow-[0_0_20px_rgba(234,179,8,0.15)] group">
                                    <img src={preview} alt="Result" className="w-full h-full object-cover saturate-[1.2] contrast-[1.15]" />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-yellow-500/10 to-transparent mix-blend-overlay" />
                                    <div className="absolute top-2 right-2 bg-yellow-400 text-black px-2 py-0.5 rounded text-[8px] font-black uppercase shadow-lg">AI Enhanced</div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Detected Product</label>
                                    <p className="text-lg font-black italic tracking-tight text-gray-900">{aiResult.name}</p>
                                </div>
                                <div className="bg-gray-50 p-3 rounded-xl border border-gray-200">
                                    <label className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block mb-1">Market Price</label>
                                    <p className="text-lg font-bold text-green-600">KES {aiResult.price}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleConfirm}
                                className="mt-auto w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-black font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-yellow-500/20 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 size={18} /> Review to Generate
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
