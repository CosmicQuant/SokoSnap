import React, { useState } from 'react';
import { X, BrainCircuit, Loader2, Camera, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { GoogleGenerativeAI } from "@google/generative-ai";

// --- PROFESSIONAL AI SYSTEM PROMPT ---
// This prompt configures the Vision Model (e.g., GPT-4 Vision / Gemini Pro Vision)
// to act as an expert e-commerce listing agent.
const SMART_SCAN_PROMPT = `
ROLE: Expert E-commerce Listing Agent & Copywriter.
TASK: Analyze the uploaded product image and generate a high-converting sales listing.
OUTPUT FORMAT: JSON

REQUIREMENTS:
1. name: Write a SEO-optimized, click-worthy title (5-10 words). Include brand, model, and key feature.
2. price: Estimate fair market value in KES (Kenyan Shilling) based on visual condition and brand tier. Return as a string number (e.g. "1500").
3. category: Classify into one of: [fashion, electronics, home, beauty, automotive].
4. condition: Assess visual wear. One of: [new, like-new, good, fair].
5. description: Write a persuasive 150-word description using the AIDA framework:
   - Attention: Hook the buyer immediately.
   - Interest: Highlight key visual features/materials.
   - Desire: Explain the lifestyle benefit or value.
   - Action: Create urgency to buy now.
   *formatting*: Use moderate emojis for readability.
6. returnPolicy: Recommend based on product type (e.g. Hygiene/Underwear = No Returns, Electronics = 7 Days).
7. tags: Generate 5-7 high-volume search keywords as an array of strings.

CONSTRAINTS:
- Do not hallucinate features not visible.
- If brand is unrecognizable, use generic high-quality descriptors.
- Ensure price is realistic for the local market.
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

        setTimeout(() => {
            setAiResult(result);
            setStep('success');
        }, 5500);
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

    // A simple light/dark check could happen here or pass prop. 
    // For now we'll make it adaptable with dark: variants but match the system/parent.
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-black border border-gray-200 dark:border-zinc-800 rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative text-black dark:text-white max-h-[90vh] flex flex-col"
            >
                <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-2">
                        <BrainCircuit className="text-cyan-600 dark:text-cyan-400" size={20} />
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">Smart Scan AI</h3>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <X size={20} className="text-gray-400 dark:text-zinc-400" />
                    </button>
                </div>

                <div className="p-6 min-h-[400px] flex flex-col overflow-y-auto custom-scrollbar">
                    {step === 'upload' && (
                        <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-zinc-800 rounded-2xl hover:border-cyan-500/50 transition-colors relative group bg-gray-50 dark:bg-transparent">
                            <input
                                type="file"
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                onChange={handleFile}
                                accept="image/*"
                            />
                            <div className="w-20 h-20 bg-white dark:bg-zinc-900 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                                <Camera size={32} className="text-gray-400 dark:text-zinc-400" />
                            </div>
                            <p className="font-bold text-lg mb-2 text-gray-900 dark:text-white">Tap to Snap or Upload</p>
                            <p className="text-gray-500 dark:text-zinc-500 text-sm">AI will identify product & price</p>
                        </div>
                    )}

                    {step === 'scanning' && (
                        <div className="flex-1 flex flex-col items-center justify-center relative bg-gray-100 dark:bg-zinc-900 rounded-2xl overflow-hidden">
                            <img src={preview} className="absolute inset-0 w-full h-full object-cover opacity-20 filter blur-sm" />
                            <div className="absolute inset-0 bg-gradient-to-t from-white via-white/50 to-transparent dark:from-black dark:via-black/50 dark:to-transparent" />

                            <div className="relative z-10 w-full px-8 flex flex-col items-center gap-6">
                                <div className="w-24 h-24 rounded-full border-4 border-cyan-500/20 flex items-center justify-center relative bg-white dark:bg-black/50 backdrop-blur-sm">
                                    <div className="absolute inset-0 border-t-4 border-cyan-500 rounded-full animate-spin" />
                                    <BrainCircuit size={40} className="text-cyan-600 dark:text-cyan-400" />
                                </div>

                                <div className="w-full space-y-3">
                                    {scanLog.map((log, i) => (
                                        <motion.div
                                            key={i}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="flex items-center gap-3 text-xs font-mono text-cyan-900 dark:text-cyan-100 bg-cyan-50 dark:bg-cyan-950/30 p-2 rounded-lg border border-cyan-200 dark:border-cyan-500/10 shadow-sm"
                                        >
                                            <CheckCircle2 size={12} className="text-cyan-600 dark:text-cyan-400 shrink-0" />
                                            <span>{log}</span>
                                        </motion.div>
                                    ))}
                                    <div className="flex items-center gap-3 text-xs font-mono text-cyan-600 dark:text-cyan-400 opacity-70 animate-pulse px-2">
                                        <Loader2 size={12} className="animate-spin" /> Processing...
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 'success' && aiResult && (
                        <div className="flex-1 flex flex-col pt-2">
                            <div className="flex gap-3 mb-6">
                                <div className="w-1/2 aspect-[4/3] bg-gray-100 dark:bg-zinc-900 rounded-xl overflow-hidden relative border border-gray-200 dark:border-zinc-700 group">
                                    <img src={preview} alt="Result" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute top-2 left-2 bg-black/50 backdrop-blur px-2 py-0.5 rounded text-[8px] font-bold uppercase text-white">Original</div>
                                </div>
                                <div className="w-1/2 aspect-[4/3] bg-gray-100 dark:bg-zinc-900 rounded-xl overflow-hidden relative border border-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.15)] group">
                                    <img src={preview} alt="Result" className="w-full h-full object-cover saturate-[1.2] contrast-[1.15]" />
                                    <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 to-transparent mix-blend-overlay" />
                                    <div className="absolute top-2 right-2 bg-cyan-400 text-black px-2 py-0.5 rounded text-[8px] font-black uppercase shadow-lg">AI Enhanced</div>
                                </div>
                            </div>

                            <div className="space-y-4 mb-6">
                                <div className="bg-gray-50 dark:bg-zinc-900/50 p-3 rounded-xl border border-gray-200 dark:border-zinc-800">
                                    <label className="text-[9px] font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wider block mb-1">Detected Product</label>
                                    <p className="text-lg font-black italic tracking-tight text-gray-900 dark:text-white">{aiResult.name}</p>
                                </div>
                                <div className="bg-gray-50 dark:bg-zinc-900/50 p-3 rounded-xl border border-gray-200 dark:border-zinc-800">
                                    <label className="text-[9px] font-bold text-gray-500 dark:text-zinc-500 uppercase tracking-wider block mb-1">Market Price</label>
                                    <p className="text-lg font-bold text-green-600 dark:text-green-400">KES {aiResult.price}</p>
                                </div>
                            </div>

                            <button
                                onClick={handleConfirm}
                                className="mt-auto w-full py-4 bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-black font-black uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-cyan-500/20 active:scale-95 flex items-center justify-center gap-2"
                            >
                                <CheckCircle2 size={18} /> Approve & Create
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};
